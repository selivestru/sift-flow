import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { CurrentUser } from '~/common/decorators/current-user.decorator.js'
import { CurrentWorkspaceMembership } from '~/common/decorators/current-workspace-membership.decorator.js'
import { Role } from '~/common/decorators/role.decorator.js'
import { CsrfGuard } from '~/common/guards/csrf.guard.js'
import { WorkspaceRoleGuard } from '~/common/guards/workspace-role.guard.js'
import type { WorkspaceMembership } from '~/common/types/workspace.types.js'
import { WorkspaceRole } from '~/generated/prisma/client.js'
import { UserType } from '~/modules/auth/entities/auth.entity.js'

import { CreateWorkspaceInput } from './dto/create-workspace.input.js'
import { UpdateWorkspaceInput } from './dto/update-workspace.input.js'
import { WorkspaceSlugArgs } from './dto/workspace-slug.args.js'
import { WorkspaceType } from './entities/workspace.entity.js'
import { WorkspaceService } from './workspace.service.js'

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
