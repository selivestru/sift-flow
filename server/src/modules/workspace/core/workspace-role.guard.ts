import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'

import { codedException } from '~/common/errors/coded.exception.js'
import { ErrorCode } from '~/common/errors/error-code.js'
import type { GraphQLContext } from '~/common/types/graphql.types.js'
import { WorkspaceMemberStatus, WorkspaceRole } from '~/generated/prisma/client.js'
import { PrismaService } from '~/infrastructure/prisma/prisma.service.js'
import { ROLE_KEY } from '~/modules/workspace/core/role.decorator.js'
import { WORKSPACE_ROLE_RANK } from '~/modules/workspace/core/workspace-role-rank.js'

@Injectable()
export class WorkspaceRoleGuard implements CanActivate {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const minRole = this.reflector.getAllAndOverride<WorkspaceRole | undefined>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!minRole) {
      throw codedException(ErrorCode.INTERNAL_SERVER_ERROR)
    }

    const gql = GqlExecutionContext.create(context)
    const { req } = gql.getContext<GraphQLContext>()
    const userId = req.session?.userId

    if (!userId) {
      throw codedException(ErrorCode.NOT_AUTHENTICATED)
    }

    const workspaceId = this.resolveWorkspaceId(gql.getArgs<Record<string, unknown>>())

    if (!workspaceId) {
      throw codedException(ErrorCode.INTERNAL_SERVER_ERROR)
    }

    const membership = await this.prismaService.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
      select: { role: true, status: true },
    })

    if (!membership || membership.status !== WorkspaceMemberStatus.ACTIVE) {
      throw codedException(ErrorCode.WORKSPACE_NOT_FOUND)
    }

    if (WORKSPACE_ROLE_RANK[membership.role] < WORKSPACE_ROLE_RANK[minRole]) {
      throw codedException(ErrorCode.INSUFFICIENT_WORKSPACE_ROLE)
    }

    req.workspace = { id: workspaceId, role: membership.role }

    return true
  }

  private resolveWorkspaceId(args: Record<string, unknown>): string | undefined {
    const direct = args['workspaceId']

    if (typeof direct === 'string') {
      return direct
    }

    const input = args['input']

    if (typeof input === 'object' && input !== null) {
      const nested = (input as Record<string, unknown>)['workspaceId']

      if (typeof nested === 'string') {
        return nested
      }
    }

    return undefined
  }
}
