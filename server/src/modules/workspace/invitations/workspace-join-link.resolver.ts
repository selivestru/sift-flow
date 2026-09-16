import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { CurrentUser } from '~/common/decorators/current-user.decorator.js'
import { Public } from '~/common/decorators/public.decorator.js'
import { CsrfGuard } from '~/common/guards/csrf.guard.js'
import { WorkspaceRole } from '~/generated/prisma/client.js'
import { UserType } from '~/modules/auth/entities/auth.entity.js'
import { CurrentWorkspaceMembership } from '~/modules/workspace/core/current-workspace-membership.decorator.js'
import { Role } from '~/modules/workspace/core/role.decorator.js'
import type { WorkspaceMembership } from '~/modules/workspace/core/workspace-membership.types.js'
import { WorkspaceRoleGuard } from '~/modules/workspace/core/workspace-role.guard.js'
import {
  WorkspaceJoinLinkArgs,
  WorkspaceJoinPreviewArgs,
} from '~/modules/workspace/invitations/dto/workspace-join-link.args.js'
import {
  WorkspaceJoinLinkType,
  WorkspaceJoinPreviewType,
} from '~/modules/workspace/invitations/entities/workspace-join-link.entity.js'
import { WorkspaceJoinLinkService } from '~/modules/workspace/invitations/workspace-join-link.service.js'

@Resolver()
export class WorkspaceJoinLinkResolver {
  constructor(private readonly workspaceJoinLinkService: WorkspaceJoinLinkService) {}

  @Public()
  @Query(() => WorkspaceJoinPreviewType)
  workspaceJoinPreview(@Args() args: WorkspaceJoinPreviewArgs): Promise<WorkspaceJoinPreviewType> {
    return this.workspaceJoinLinkService.preview(args.token)
  }

  @Mutation(() => WorkspaceJoinLinkType)
  @UseGuards(CsrfGuard, WorkspaceRoleGuard)
  @Role(WorkspaceRole.ADMIN)
  revokeWorkspaceJoinLink(
    @Args() _args: WorkspaceJoinLinkArgs,
    @CurrentUser() user: UserType,
    @CurrentWorkspaceMembership() membership: WorkspaceMembership,
  ): Promise<WorkspaceJoinLinkType> {
    return this.workspaceJoinLinkService.revoke(membership, user.id)
  }
}
