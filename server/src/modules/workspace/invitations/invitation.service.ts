import { randomBytes } from 'node:crypto'

import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { isEmail } from 'class-validator'

import { codedException, CodedException } from '~/common/errors/coded.exception.js'
import { ErrorCode } from '~/common/errors/error-code.js'
import type { EnvConfig } from '~/config/env.config.js'
import {
  Invitation,
  InvitationKind,
  InvitationStatus,
  Prisma,
  WorkspaceMemberStatus,
  WorkspaceRole,
} from '~/generated/prisma/client.js'
import { MailQueueService } from '~/infrastructure/mail/mail-queue.service.js'
import { PrismaService } from '~/infrastructure/prisma/prisma.service.js'
import { UserType } from '~/modules/auth/entities/auth.entity.js'
import type { WorkspaceMembership } from '~/modules/workspace/core/workspace-membership.types.js'
import { WorkspaceType } from '~/modules/workspace/core/workspace.entity.js'
import {
  WORKSPACE_MEMBERS_COUNT_INCLUDE,
  toWorkspaceType,
} from '~/modules/workspace/core/workspace.mapper.js'
import { InviteWorkspaceMemberInput } from '~/modules/workspace/invitations/dto/invite-workspace-member.input.js'
import { InviteWorkspaceMembersInput } from '~/modules/workspace/invitations/dto/invite-workspace-members.input.js'
import { WorkspaceInvitationsArgs } from '~/modules/workspace/invitations/dto/workspace-invitations.args.js'
import {
  InviteResultStatus,
  InviteResultType,
  WorkspaceInvitationType,
} from '~/modules/workspace/invitations/entities/workspace-invitation.entity.js'

const INVITATION_INCLUDE = {
  workspace: true,
  invitedBy: true,
} satisfies Prisma.InvitationInclude

type InvitationWithRelations = Prisma.InvitationGetPayload<{ include: typeof INVITATION_INCLUDE }>

@Injectable()
export class InvitationService {
  private readonly INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1000

  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailQueueService: MailQueueService,
    private readonly configService: ConfigService<EnvConfig, true>,
  ) {}

  inviteWorkspaceMember(
    userId: string,
    membership: WorkspaceMembership,
    input: InviteWorkspaceMemberInput,
  ): Promise<WorkspaceInvitationType> {
    return this.inviteByEmail(userId, membership, input.email, input.role)
  }

  async inviteWorkspaceMembers(
    userId: string,
    membership: WorkspaceMembership,
    input: InviteWorkspaceMembersInput,
  ): Promise<InviteResultType[]> {
    const emails = [
      ...new Set(input.emails.map((email) => email.trim().toLowerCase()).filter(Boolean)),
    ]
    const results: InviteResultType[] = []

    for (const email of emails) {
      if (email.length > 254 || !isEmail(email)) {
        results.push({ email, status: InviteResultStatus.INVALID_EMAIL, invitation: null })
        continue
      }

      try {
        const invitation = await this.inviteByEmail(userId, membership, email, input.role)

        results.push({ email, status: InviteResultStatus.INVITED, invitation })
      } catch (error) {
        if (
          error instanceof CodedException &&
          error.extensions.code === ErrorCode.WORKSPACE_MEMBER_EXISTS
        ) {
          results.push({ email, status: InviteResultStatus.ALREADY_MEMBER, invitation: null })
          continue
        }

        throw error
      }
    }

    return results
  }

  async invitations(
    membership: WorkspaceMembership,
    args: WorkspaceInvitationsArgs,
  ): Promise<WorkspaceInvitationType[]> {
    const statuses = args.statuses?.length ? args.statuses : [InvitationStatus.PENDING]
    const invitations = await this.prismaService.invitation.findMany({
      where: {
        workspaceId: membership.id,
        kind: InvitationKind.EMAIL,
        status: { in: statuses },
      },
      include: INVITATION_INCLUDE,
      orderBy: { createdAt: 'desc' },
    })

    return invitations.map((invitation) => this.toInvitationType(invitation))
  }

  async resend(
    membership: WorkspaceMembership,
    invitationId: string,
  ): Promise<WorkspaceInvitationType> {
    const invitation = await this.findEmailInvitation(membership.id, invitationId)
    const resent = await this.prismaService.invitation.update({
      where: { id: invitation.id },
      data: { expiresAt: this.issueExpiry() },
      include: INVITATION_INCLUDE,
    })

    await this.enqueueInvitationEmail(resent)

    return this.toInvitationType(resent)
  }

  async cancel(
    membership: WorkspaceMembership,
    invitationId: string,
  ): Promise<WorkspaceInvitationType> {
    const invitation = await this.findEmailInvitation(membership.id, invitationId)
    const canceled = await this.prismaService.invitation.update({
      where: { id: invitation.id },
      data: { status: InvitationStatus.CANCELED },
      include: INVITATION_INCLUDE,
    })

    return this.toInvitationType(canceled)
  }

  async myWorkspaceInvitations(userEmail: string): Promise<WorkspaceInvitationType[]> {
    const invitations = await this.prismaService.invitation.findMany({
      where: {
        email: userEmail.toLowerCase(),
        kind: InvitationKind.EMAIL,
        status: InvitationStatus.PENDING,
      },
      include: INVITATION_INCLUDE,
      orderBy: { createdAt: 'asc' },
    })

    const now = new Date()
    const expired = invitations.filter(
      (invitation) => invitation.expiresAt !== null && invitation.expiresAt <= now,
    )

    if (expired.length > 0) {
      await this.expire(expired.map((invitation) => invitation.id))
    }

    return invitations
      .filter((invitation) => invitation.expiresAt === null || invitation.expiresAt > now)
      .map((invitation) => this.toInvitationType(invitation))
  }

  async accept(userId: string, userEmail: string, token: string): Promise<WorkspaceType> {
    const invitation = await this.findInvitation(token)

    if (this.isAnotherAddress(invitation, userEmail)) {
      throw codedException(ErrorCode.INVITATION_EMAIL_MISMATCH)
    }

    return this.join(invitation, userId)
  }

  async decline(token: string): Promise<WorkspaceInvitationType> {
    const invitation = await this.findInvitation(token)

    if (invitation.kind !== InvitationKind.EMAIL) {
      throw codedException(ErrorCode.INVITATION_NOT_FOUND)
    }

    const declined = await this.prismaService.invitation.update({
      where: { id: invitation.id },
      data: { status: InvitationStatus.DECLINED },
      include: INVITATION_INCLUDE,
    })

    return this.toInvitationType(declined)
  }

  async bindInvitationToUser(user: UserType, token: string): Promise<string | null> {
    try {
      const invitation = await this.findInvitation(token)

      if (this.isAnotherAddress(invitation, user.email)) {
        return null
      }

      const workspace = await this.join(invitation, user.id)

      return workspace.slug
    } catch (error) {
      if (error instanceof CodedException) {
        return null
      }

      throw error
    }
  }

  private async join(invitation: Invitation, userId: string): Promise<WorkspaceType> {
    const existing = await this.prismaService.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: invitation.workspaceId, userId } },
      select: { role: true, status: true },
    })

    const role = existing?.status === WorkspaceMemberStatus.ACTIVE ? existing.role : invitation.role

    const membership = await this.prismaService.workspaceMember.upsert({
      where: { workspaceId_userId: { workspaceId: invitation.workspaceId, userId } },
      create: {
        workspaceId: invitation.workspaceId,
        userId,
        role,
        status: WorkspaceMemberStatus.ACTIVE,
      },
      update: {
        role,
        status: WorkspaceMemberStatus.ACTIVE,
        removedAt: null,
        removedById: null,
      },
    })

    if (invitation.kind === InvitationKind.EMAIL) {
      await this.prismaService.invitation.update({
        where: { id: invitation.id },
        data: { status: InvitationStatus.ACCEPTED },
      })
    }

    const workspace = await this.prismaService.workspace.findUniqueOrThrow({
      where: { id: invitation.workspaceId },
      include: WORKSPACE_MEMBERS_COUNT_INCLUDE,
    })

    return toWorkspaceType(workspace, membership.role)
  }

  private isAnotherAddress(invitation: Invitation, userEmail: string): boolean {
    if (invitation.kind !== InvitationKind.EMAIL || invitation.email === null) {
      return false
    }

    return invitation.email.toLowerCase() !== userEmail.toLowerCase()
  }

  private async inviteByEmail(
    userId: string,
    membership: WorkspaceMembership,
    email: string,
    role: WorkspaceRole,
  ): Promise<WorkspaceInvitationType> {
    if (membership.role === WorkspaceRole.ADMIN && role === WorkspaceRole.ADMIN) {
      throw codedException(ErrorCode.INSUFFICIENT_WORKSPACE_ROLE)
    }

    const invitee = await this.prismaService.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
      select: { id: true },
    })

    if (invitee) {
      const inviteeMembership = await this.prismaService.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId: membership.id, userId: invitee.id } },
        select: { status: true },
      })

      if (inviteeMembership?.status === WorkspaceMemberStatus.ACTIVE) {
        throw codedException(ErrorCode.WORKSPACE_MEMBER_EXISTS)
      }
    }

    const invitation = await this.prismaService.invitation.upsert({
      where: { workspaceId_email: { workspaceId: membership.id, email } },
      create: {
        workspaceId: membership.id,
        kind: InvitationKind.EMAIL,
        email,
        role,
        token: this.issueToken(),
        invitedById: userId,
        expiresAt: this.issueExpiry(),
      },
      update: {
        role,
        token: this.issueToken(),
        invitedById: userId,
        status: InvitationStatus.PENDING,
        expiresAt: this.issueExpiry(),
      },
      include: INVITATION_INCLUDE,
    })

    await this.enqueueInvitationEmail(invitation)

    return this.toInvitationType(invitation)
  }

  private async findInvitation(token: string): Promise<Invitation> {
    const invitation = await this.prismaService.invitation.findUnique({ where: { token } })

    if (!invitation || invitation.status !== InvitationStatus.PENDING) {
      throw codedException(ErrorCode.INVITATION_NOT_FOUND)
    }

    if (invitation.expiresAt !== null && invitation.expiresAt <= new Date()) {
      await this.expire([invitation.id])

      throw codedException(ErrorCode.INVITATION_EXPIRED)
    }

    return invitation
  }

  private async findEmailInvitation(
    workspaceId: string,
    invitationId: string,
  ): Promise<InvitationWithRelations> {
    const invitation = await this.prismaService.invitation.findFirst({
      where: { id: invitationId, workspaceId, kind: InvitationKind.EMAIL },
      include: INVITATION_INCLUDE,
    })

    if (!invitation) {
      throw codedException(ErrorCode.INVITATION_NOT_FOUND)
    }

    return invitation
  }

  private async enqueueInvitationEmail(invitation: InvitationWithRelations): Promise<void> {
    if (invitation.email === null) {
      return
    }

    await this.mailQueueService.enqueueWorkspaceInvitation({
      email: invitation.email,
      workspaceName: invitation.workspace.name,
      role: invitation.role,
      invitationUrl: `${this.configService.get('ORIGIN', { infer: true })}/invite/${invitation.token}`,
    })
  }

  private expire(ids: string[]): Promise<Prisma.BatchPayload> {
    return this.prismaService.invitation.updateMany({
      where: { id: { in: ids } },
      data: { status: InvitationStatus.EXPIRED },
    })
  }

  private issueToken(): string {
    return randomBytes(32).toString('hex')
  }

  private issueExpiry(): Date {
    return new Date(Date.now() + this.INVITATION_TTL_MS)
  }

  private toInvitationType(invitation: InvitationWithRelations): WorkspaceInvitationType {
    return {
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      status: invitation.status,
      token: invitation.token,
      expiresAt: invitation.expiresAt,
      createdAt: invitation.createdAt,
      workspace: {
        id: invitation.workspace.id,
        name: invitation.workspace.name,
        slug: invitation.workspace.slug,
      },
      invitedBy: {
        id: invitation.invitedBy.id,
        email: invitation.invitedBy.email,
        fullName: invitation.invitedBy.fullName,
      },
    }
  }
}
