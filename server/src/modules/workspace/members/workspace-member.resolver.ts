import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { CurrentUser } from '~/common/decorators/current-user.decorator.js'
import { CsrfGuard } from '~/common/guards/csrf.guard.js'
import { WorkspaceRole } from '~/generated/prisma/client.js'
import { UserType } from '~/modules/auth/entities/auth.entity.js'
import { CurrentWorkspaceMembership } from '~/modules/workspace/core/current-workspace-membership.decorator.js'
import { Role } from '~/modules/workspace/core/role.decorator.js'
import type { WorkspaceMembership } from '~/modules/workspace/core/workspace-membership.types.js'
import { WorkspaceRoleGuard } from '~/modules/workspace/core/workspace-role.guard.js'
import {
  WorkspaceMemberPageType,
  WorkspaceMemberRemovalType,
  WorkspaceMemberType,
} from '~/modules/workspace/members/entities/workspace-member.entity.js'
import { WorkspaceMemberService } from '~/modules/workspace/members/workspace-member.service.js'

import { RemoveWorkspaceMemberInput } from './dto/remove-workspace-member.input.js'
import { UpdateWorkspaceMemberRoleInput } from './dto/update-workspace-member-role.input.js'
import { WorkspaceMemberArgs } from './dto/workspace-member.args.js'
import { WorkspaceMembersArgs } from './dto/workspace-members.args.js'

@Resolver()
export class WorkspaceMemberResolver {
  constructor(private readonly workspaceMemberService: WorkspaceMemberService) {}

  @Query(() => WorkspaceMemberPageType)
  @UseGuards(WorkspaceRoleGuard)
  @Role(WorkspaceRole.MEMBER)
  workspaceMembers(@Args() args: WorkspaceMembersArgs): Promise<WorkspaceMemberPageType> {
    return this.workspaceMemberService.findPage(args)
  }

  @Query(() => WorkspaceMemberType)
  @UseGuards(WorkspaceRoleGuard)
  @Role(WorkspaceRole.MEMBER)
  workspaceMember(@Args() args: WorkspaceMemberArgs): Promise<WorkspaceMemberType> {
    return this.workspaceMemberService.findOne(args.workspaceId, args.userId)
  }

  @Mutation(() => WorkspaceMemberType)
  @UseGuards(CsrfGuard, WorkspaceRoleGuard)
  @Role(WorkspaceRole.ADMIN)
  updateWorkspaceMemberRole(
    @Args('input') input: UpdateWorkspaceMemberRoleInput,
    @CurrentUser() user: UserType,
    @CurrentWorkspaceMembership() membership: WorkspaceMembership,
  ): Promise<WorkspaceMemberType> {
    return this.workspaceMemberService.updateRole(user.id, membership, input)
  }

  @Mutation(() => WorkspaceMemberRemovalType)
  @UseGuards(CsrfGuard, WorkspaceRoleGuard)
  @Role(WorkspaceRole.ADMIN)
  removeWorkspaceMember(
    @Args('input') input: RemoveWorkspaceMemberInput,
    @CurrentUser() user: UserType,
    @CurrentWorkspaceMembership() membership: WorkspaceMembership,
  ): Promise<WorkspaceMemberRemovalType> {
    return this.workspaceMemberService.remove(user.id, membership, input)
  }
}
