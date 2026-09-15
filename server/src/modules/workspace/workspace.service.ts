import { Injectable } from '@nestjs/common'

import { codedException } from '~/common/errors/coded.exception.js'
import { ErrorCode } from '~/common/errors/error-code.js'
import type { WorkspaceMembership } from '~/common/types/workspace.types.js'
import { Prisma, WorkspaceRole } from '~/generated/prisma/client.js'
import { PrismaService } from '~/infrastructure/prisma/prisma.service.js'

import { CreateWorkspaceInput } from './dto/create-workspace.input.js'
import { UpdateWorkspaceInput } from './dto/update-workspace.input.js'
import { WorkspaceType } from './entities/workspace.entity.js'
import { WORKSPACE_MEMBERS_COUNT_INCLUDE, toWorkspaceType } from './workspace.mapper.js'

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
      where: { members: { some: { userId, role: WorkspaceRole.OWNER } } },
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
      where: { userId },
      include: { workspace: { include: WORKSPACE_MEMBERS_COUNT_INCLUDE } },
      orderBy: { createdAt: 'asc' },
    })

    return memberships.map((membership) => toWorkspaceType(membership.workspace, membership.role))
  }
}
