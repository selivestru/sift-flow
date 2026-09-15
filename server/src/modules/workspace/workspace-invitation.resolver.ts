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

import { InvitationTokenArgs } from './dto/invitation-token.args.js'
import { InviteWorkspaceMemberInput } from './dto/invite-workspace-member.input.js'
import { WorkspaceInvitationType } from './entities/workspace-invitation.entity.js'
import { WorkspaceType } from './entities/workspace.entity.js'
import { InvitationService } from './invitation.service.js'

@Resolver()
export class WorkspaceInvitationResolver {
  constructor(private readonly invitationService: InvitationService) {}

  @Query(() => [WorkspaceInvitationType])
  myWorkspaceInvitations(@CurrentUser() user: UserType): Promise<WorkspaceInvitationType[]> {
    return this.invitationService.myWorkspaceInvitations(user.email)
  }

  @Mutation(() => WorkspaceInvitationType)
  @UseGuards(CsrfGuard, WorkspaceRoleGuard)
  @Role(WorkspaceRole.ADMIN)
  inviteWorkspaceMember(
    @Args('input') input: InviteWorkspaceMemberInput,
    @CurrentUser() user: UserType,
    @CurrentWorkspaceMembership() membership: WorkspaceMembership,
  ): Promise<WorkspaceInvitationType> {
    return this.invitationService.inviteWorkspaceMember(user.id, membership, input)
  }

  @Mutation(() => WorkspaceType)
  @UseGuards(CsrfGuard)
  acceptWorkspaceInvitation(
    @Args() args: InvitationTokenArgs,
    @CurrentUser() user: UserType,
  ): Promise<WorkspaceType> {
    return this.invitationService.acceptWorkspaceInvitation(user.id, args.token)
  }

  @Mutation(() => Boolean)
  @UseGuards(CsrfGuard)
  declineWorkspaceInvitation(@Args() args: InvitationTokenArgs): Promise<boolean> {
    return this.invitationService.declineWorkspaceInvitation(args.token)
  }
}
