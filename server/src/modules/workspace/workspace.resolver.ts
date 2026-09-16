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
import { WorkspaceType } from '~/modules/workspace/core/workspace.entity.js'
import { CreateWorkspaceInput } from '~/modules/workspace/dto/create-workspace.input.js'
import { UpdateWorkspaceInput } from '~/modules/workspace/dto/update-workspace.input.js'
import { WorkspaceSlugArgs } from '~/modules/workspace/dto/workspace-slug.args.js'
import { WorkspaceService } from '~/modules/workspace/workspace.service.js'

@Resolver(() => WorkspaceType)
export class WorkspaceResolver {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Query(() => Boolean)
  isWorkspaceSlugAvailable(@Args() args: WorkspaceSlugArgs): Promise<boolean> {
    return this.workspaceService.isSlugAvailable(args.slug, args.workspaceId)
  }

  @Query(() => [WorkspaceType])
  myWorkspaces(@CurrentUser() user: UserType): Promise<WorkspaceType[]> {
    return this.workspaceService.myWorkspaces(user.id)
  }

  @Mutation(() => WorkspaceType)
  @UseGuards(CsrfGuard)
  createWorkspace(
    @Args('input') input: CreateWorkspaceInput,
    @CurrentUser() user: UserType,
  ): Promise<WorkspaceType> {
    return this.workspaceService.createWorkspace(user.id, input)
  }

  @Mutation(() => WorkspaceType)
  @UseGuards(CsrfGuard, WorkspaceRoleGuard)
  @Role(WorkspaceRole.ADMIN)
  updateWorkspace(
    @Args('input') input: UpdateWorkspaceInput,
    @CurrentWorkspaceMembership() membership: WorkspaceMembership,
  ): Promise<WorkspaceType> {
    return this.workspaceService.updateWorkspace(membership, input)
  }
}
