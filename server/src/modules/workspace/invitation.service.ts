import { randomBytes } from 'node:crypto'

import { Injectable } from '@nestjs/common'

import { codedException } from '~/common/errors/coded.exception.js'
import { ErrorCode } from '~/common/errors/error-code.js'
import type { WorkspaceMembership } from '~/common/types/workspace.types.js'
import { Invitation, InvitationStatus, Prisma, WorkspaceRole } from '~/generated/prisma/client.js'
import { PrismaService } from '~/infrastructure/prisma/prisma.service.js'

import { InviteWorkspaceMemberInput } from './dto/invite-workspace-member.input.js'
import { WorkspaceInvitationType } from './entities/workspace-invitation.entity.js'
import { WorkspaceType } from './entities/workspace.entity.js'
import { WORKSPACE_MEMBERS_COUNT_INCLUDE, toWorkspaceType } from './workspace.mapper.js'

const INVITATION_INCLUDE = {
  workspace: true,
  invitedBy: true,
} satisfies Prisma.InvitationInclude

type InvitationWithRelations = Prisma.InvitationGetPayload<{ include: typeof INVITATION_INCLUDE }>

@Injectable()
export class InvitationService {
  private readonly INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1000

  constructor(private readonly prismaService: PrismaService) {}

  async inviteWorkspaceMember(
    userId: string,
    membership: WorkspaceMembership,
    input: InviteWorkspaceMemberInput,
  ): Promise<WorkspaceInvitationType> {
    if (membership.role === WorkspaceRole.ADMIN && input.role === WorkspaceRole.ADMIN) {
      throw codedException(ErrorCode.INSUFFICIENT_WORKSPACE_ROLE)
    }

    const invitee = await this.prismaService.user.findFirst({
      where: { email: { equals: input.email, mode: 'insensitive' } },
      select: { id: true },
    })

    if (invitee) {
      const inviteeMembership = await this.prismaService.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId: membership.id, userId: invitee.id } },
        select: { id: true },
      })

      if (inviteeMembership) {
        throw codedException(ErrorCode.WORKSPACE_MEMBER_EXISTS)
      }
    }

    const invitation = await this.prismaService.invitation.upsert({
      where: { workspaceId_email: { workspaceId: membership.id, email: input.email } },
      create: {
        workspaceId: membership.id,
        email: input.email,
        role: input.role,
        token: this.issueToken(),
        invitedById: userId,
        expiresAt: this.issueExpiry(),
      },
      update: {
        role: input.role,
        token: this.issueToken(),
        invitedById: userId,
        status: InvitationStatus.PENDING,
        expiresAt: this.issueExpiry(),
      },
      include: INVITATION_INCLUDE,
    })

    return this.toInvitationType(invitation)
  }

  async myWorkspaceInvitations(userEmail: string): Promise<WorkspaceInvitationType[]> {
    const invitations = await this.prismaService.invitation.findMany({
      where: { email: userEmail.toLowerCase(), status: InvitationStatus.PENDING },
      include: INVITATION_INCLUDE,
      orderBy: { createdAt: 'asc' },
    })

    const now = new Date()
    const expired = invitations.filter((invitation) => invitation.expiresAt <= now)

    if (expired.length > 0) {
      await this.expire(expired.map((invitation) => invitation.id))
    }

    return invitations
      .filter((invitation) => invitation.expiresAt > now)
      .map((invitation) => this.toInvitationType(invitation))
  }

  async acceptWorkspaceInvitation(userId: string, token: string): Promise<WorkspaceType> {
    const invitation = await this.findInvitation(token)

    const [membership] = await this.prismaService.$transaction([
      this.prismaService.workspaceMember.upsert({
        where: { workspaceId_userId: { workspaceId: invitation.workspaceId, userId } },
        create: { workspaceId: invitation.workspaceId, userId, role: invitation.role },
        update: {},
      }),
      this.prismaService.invitation.update({
        where: { id: invitation.id },
        data: { status: InvitationStatus.ACCEPTED },
      }),
    ])

    const workspace = await this.prismaService.workspace.findUniqueOrThrow({
      where: { id: invitation.workspaceId },
      include: WORKSPACE_MEMBERS_COUNT_INCLUDE,
    })

    return toWorkspaceType(workspace, membership.role)
  }

  async declineWorkspaceInvitation(token: string): Promise<boolean> {
    const invitation = await this.findInvitation(token)

    if (invitation.status === InvitationStatus.ACCEPTED) {
      throw codedException(ErrorCode.INVITATION_NOT_FOUND)
    }

    await this.prismaService.invitation.update({
      where: { id: invitation.id },
      data: { status: InvitationStatus.DECLINED },
    })

    return true
  }

  private async findInvitation(token: string): Promise<Invitation> {
    const invitation = await this.prismaService.invitation.findUnique({ where: { token } })

    if (!invitation) {
      throw codedException(ErrorCode.INVITATION_NOT_FOUND)
    }

    if (invitation.status !== InvitationStatus.ACCEPTED && invitation.expiresAt <= new Date()) {
      await this.expire([invitation.id])

      throw codedException(ErrorCode.INVITATION_EXPIRED)
    }

    return invitation
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
