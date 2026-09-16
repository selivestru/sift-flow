import { randomBytes } from 'node:crypto'

import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { codedException } from '~/common/errors/coded.exception.js'
import { ErrorCode } from '~/common/errors/error-code.js'
import type { EnvConfig } from '~/config/env.config.js'
import { InvitationKind, InvitationStatus, WorkspaceRole } from '~/generated/prisma/client.js'
import { PrismaService } from '~/infrastructure/prisma/prisma.service.js'
import type { WorkspaceMembership } from '~/modules/workspace/core/workspace-membership.types.js'
import {
  WorkspaceJoinLinkType,
  WorkspaceJoinPreviewType,
} from '~/modules/workspace/invitations/entities/workspace-join-link.entity.js'

export const buildJoinLinkData = (userId: string) => ({
  kind: InvitationKind.LINK,
  role: WorkspaceRole.MEMBER,
  token: randomBytes(32).toString('hex'),
  invitedById: userId,
})

@Injectable()
export class WorkspaceJoinLinkService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService<EnvConfig, true>,
  ) {}

  async preview(token: string): Promise<WorkspaceJoinPreviewType> {
    const invitation = await this.prismaService.invitation.findUnique({
      where: { token },
      include: { workspace: true },
    })

    if (!invitation || invitation.status !== InvitationStatus.PENDING) {
      throw codedException(ErrorCode.WORKSPACE_JOIN_LINK_INVALID)
    }

    if (invitation.expiresAt !== null && invitation.expiresAt <= new Date()) {
      throw codedException(ErrorCode.INVITATION_EXPIRED)
    }

    return {
      name: invitation.workspace.name,
      slug: invitation.workspace.slug,
      role: invitation.role,
      kind: invitation.kind,
      email: invitation.email,
    }
  }

  async revoke(membership: WorkspaceMembership, userId: string): Promise<WorkspaceJoinLinkType> {
    await this.prismaService.invitation.updateMany({
      where: {
        workspaceId: membership.id,
        kind: InvitationKind.LINK,
        status: InvitationStatus.PENDING,
      },
      data: { status: InvitationStatus.CANCELED },
    })

    const link = await this.prismaService.invitation.create({
      data: {
        workspaceId: membership.id,
        ...buildJoinLinkData(userId),
      },
    })

    return {
      id: link.id,
      url: `${this.configService.get('ORIGIN', { infer: true })}/invite/${link.token}`,
      role: link.role,
      expiresAt: link.expiresAt,
      createdAt: link.createdAt,
    }
  }
}
