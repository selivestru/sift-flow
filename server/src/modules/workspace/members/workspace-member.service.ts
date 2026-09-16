import { Injectable } from '@nestjs/common'

import { codedException } from '~/common/errors/coded.exception.js'
import { ErrorCode } from '~/common/errors/error-code.js'
import { Prisma, WorkspaceMemberStatus } from '~/generated/prisma/client.js'
import { PrismaService } from '~/infrastructure/prisma/prisma.service.js'
import type { WorkspaceMembership } from '~/modules/workspace/core/workspace-membership.types.js'
import { WORKSPACE_ROLE_RANK } from '~/modules/workspace/core/workspace-role-rank.js'
import {
  WORKSPACE_MEMBERS_COUNT_INCLUDE,
  toWorkspaceType,
} from '~/modules/workspace/core/workspace.mapper.js'
import {
  WorkspaceMemberPageType,
  WorkspaceMemberRemovalType,
  WorkspaceMemberType,
  WorkspaceTaskMode,
} from '~/modules/workspace/members/entities/workspace-member.entity.js'

import { RemoveWorkspaceMemberInput } from './dto/remove-workspace-member.input.js'
import { UpdateWorkspaceMemberRoleInput } from './dto/update-workspace-member-role.input.js'
import { WorkspaceMembersArgs } from './dto/workspace-members.args.js'

const MEMBER_INCLUDE = { user: true } satisfies Prisma.WorkspaceMemberInclude

type MemberWithUser = Prisma.WorkspaceMemberGetPayload<{ include: typeof MEMBER_INCLUDE }>

@Injectable()
export class WorkspaceMemberService {
  constructor(private readonly prismaService: PrismaService) {}

  async findPage(args: WorkspaceMembersArgs): Promise<WorkspaceMemberPageType> {
    const where = this.buildWhere(args)

    const [members, total] = await this.prismaService.$transaction([
      this.prismaService.workspaceMember.findMany({
        where,
        include: MEMBER_INCLUDE,
        orderBy: [{ role: 'asc' }, { createdAt: 'asc' }],
        skip: args.offset,
        take: args.limit,
      }),
      this.prismaService.workspaceMember.count({ where }),
    ])

    return { members: members.map((member) => this.toMemberType(member)), total }
  }

  async findOne(workspaceId: string, userId: string): Promise<WorkspaceMemberType> {
    const member = await this.findActiveMember(workspaceId, userId)

    return this.toMemberType(member)
  }

  async updateRole(
    actorUserId: string,
    membership: WorkspaceMembership,
    input: UpdateWorkspaceMemberRoleInput,
  ): Promise<WorkspaceMemberType> {
    const target = await this.findActiveMember(membership.id, input.userId)

    if (target.userId === actorUserId) {
      throw codedException(ErrorCode.INSUFFICIENT_WORKSPACE_ROLE)
    }

    if (
      WORKSPACE_ROLE_RANK[target.role] >= WORKSPACE_ROLE_RANK[membership.role] ||
      WORKSPACE_ROLE_RANK[input.role] >= WORKSPACE_ROLE_RANK[membership.role]
    ) {
      throw codedException(ErrorCode.INSUFFICIENT_WORKSPACE_ROLE)
    }

    const updated = await this.prismaService.workspaceMember.update({
      where: { id: target.id },
      data: { role: input.role },
      include: MEMBER_INCLUDE,
    })

    return this.toMemberType(updated)
  }

  async remove(
    actorUserId: string,
    membership: WorkspaceMembership,
    input: RemoveWorkspaceMemberInput,
  ): Promise<WorkspaceMemberRemovalType> {
    const target = await this.findActiveMember(membership.id, input.userId)

    if (
      target.userId === actorUserId ||
      WORKSPACE_ROLE_RANK[target.role] >= WORKSPACE_ROLE_RANK[membership.role]
    ) {
      throw codedException(ErrorCode.INSUFFICIENT_WORKSPACE_ROLE)
    }

    if (input.tasks?.mode === WorkspaceTaskMode.REASSIGN) {
      await this.findActiveMember(membership.id, input.tasks.reassignToUserId as string)
    }

    const removed = await this.prismaService.workspaceMember.update({
      where: { id: target.id },
      data: {
        status: WorkspaceMemberStatus.REMOVED,
        removedAt: new Date(),
        removedById: actorUserId,
      },
      include: MEMBER_INCLUDE,
    })

    const workspace = await this.prismaService.workspace.findUniqueOrThrow({
      where: { id: membership.id },
      include: WORKSPACE_MEMBERS_COUNT_INCLUDE,
    })

    return {
      member: this.toMemberType(removed),
      workspace: toWorkspaceType(workspace, membership.role),
    }
  }

  private async findActiveMember(workspaceId: string, userId: string): Promise<MemberWithUser> {
    const member = await this.prismaService.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
      include: MEMBER_INCLUDE,
    })

    if (!member || member.status !== WorkspaceMemberStatus.ACTIVE) {
      throw codedException(ErrorCode.WORKSPACE_MEMBER_NOT_FOUND)
    }

    return member
  }

  private buildWhere(args: WorkspaceMembersArgs): Prisma.WorkspaceMemberWhereInput {
    const where: Prisma.WorkspaceMemberWhereInput = {
      workspaceId: args.workspaceId,
      status: WorkspaceMemberStatus.ACTIVE,
    }

    if (args.roles?.length) {
      where.role = { in: args.roles }
    }

    if (args.search) {
      where.user = {
        is: {
          OR: [
            { fullName: { contains: args.search, mode: 'insensitive' } },
            { email: { contains: args.search, mode: 'insensitive' } },
          ],
        },
      }
    }

    return where
  }

  private toMemberType(member: MemberWithUser): WorkspaceMemberType {
    return {
      id: member.id,
      role: member.role,
      status: member.status,
      user: {
        id: member.user.id,
        email: member.user.email,
        fullName: member.user.fullName,
      },
      joinedAt: member.createdAt,
      projects: [],
      assignedTasks: [],
    }
  }
}
