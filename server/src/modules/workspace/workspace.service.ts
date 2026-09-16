import { Injectable } from '@nestjs/common'

import { codedException } from '~/common/errors/coded.exception.js'
import { ErrorCode } from '~/common/errors/error-code.js'
import { Prisma, WorkspaceMemberStatus, WorkspaceRole } from '~/generated/prisma/client.js'
import { PrismaService } from '~/infrastructure/prisma/prisma.service.js'
import type { WorkspaceMembership } from '~/modules/workspace/core/workspace-membership.types.js'
import { WorkspaceType } from '~/modules/workspace/core/workspace.entity.js'
import {
  WORKSPACE_MEMBERS_COUNT_INCLUDE,
  toWorkspaceType,
} from '~/modules/workspace/core/workspace.mapper.js'
import { CreateWorkspaceInput } from '~/modules/workspace/dto/create-workspace.input.js'
import { UpdateWorkspaceInput } from '~/modules/workspace/dto/update-workspace.input.js'
import { buildJoinLinkData } from '~/modules/workspace/invitations/workspace-join-link.service.js'

@Injectable()
export class WorkspaceService {
  private readonly WORKSPACE_LIMIT_PER_USER = 5

  constructor(private readonly prismaService: PrismaService) {}

  async isSlugAvailable(slug: string, excludeWorkspaceId?: string): Promise<boolean> {
    const workspace = await this.prismaService.workspace.findFirst({
      where: { slug, id: excludeWorkspaceId ? { not: excludeWorkspaceId } : undefined },
      select: { id: true },
    })

    return workspace === null
  }

  async createWorkspace(userId: string, input: CreateWorkspaceInput): Promise<WorkspaceType> {
    const ownedCount = await this.prismaService.workspace.count({
      where: {
        members: {
          some: { userId, role: WorkspaceRole.OWNER, status: WorkspaceMemberStatus.ACTIVE },
        },
      },
    })

    if (ownedCount >= this.WORKSPACE_LIMIT_PER_USER) {
      throw codedException(ErrorCode.WORKSPACE_LIMIT_REACHED)
    }

    try {
      const workspace = await this.prismaService.workspace.create({
        data: {
          name: input.name,
          slug: input.slug,
          members: { create: { userId, role: WorkspaceRole.OWNER } },
          invitations: { create: buildJoinLinkData(userId) },
        },
        include: WORKSPACE_MEMBERS_COUNT_INCLUDE,
      })

      return toWorkspaceType(workspace, WorkspaceRole.OWNER)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw codedException(ErrorCode.WORKSPACE_SLUG_TAKEN)
      }

      throw error
    }
  }

  async updateWorkspace(
    membership: WorkspaceMembership,
    input: UpdateWorkspaceInput,
  ): Promise<WorkspaceType> {
    if (input.name === undefined && input.slug === undefined) {
      throw codedException(ErrorCode.VALIDATION_FAILED)
    }

    try {
      const workspace = await this.prismaService.workspace.update({
        where: { id: membership.id },
        data: { name: input.name, slug: input.slug },
        include: WORKSPACE_MEMBERS_COUNT_INCLUDE,
      })

      return toWorkspaceType(workspace, membership.role)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw codedException(ErrorCode.WORKSPACE_SLUG_TAKEN)
      }

      throw error
    }
  }

  async myWorkspaces(userId: string): Promise<WorkspaceType[]> {
    const memberships = await this.prismaService.workspaceMember.findMany({
      where: { userId, status: WorkspaceMemberStatus.ACTIVE },
      include: { workspace: { include: WORKSPACE_MEMBERS_COUNT_INCLUDE } },
      orderBy: { createdAt: 'asc' },
    })

    return memberships.map((membership) => toWorkspaceType(membership.workspace, membership.role))
  }
}
