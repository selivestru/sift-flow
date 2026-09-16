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
import {
  InviteResultType,
  WorkspaceInvitationType,
} from '~/modules/workspace/invitations/entities/workspace-invitation.entity.js'
import { InvitationService } from '~/modules/workspace/invitations/invitation.service.js'

import { InvitationIdArgs } from './dto/invitation-id.args.js'
import { InvitationTokenArgs } from './dto/invitation-token.args.js'
import { InviteWorkspaceMemberInput } from './dto/invite-workspace-member.input.js'
import { InviteWorkspaceMembersInput } from './dto/invite-workspace-members.input.js'
import { WorkspaceInvitationsArgs } from './dto/workspace-invitations.args.js'

@Resolver()
export class InvitationResolver {
  constructor(private readonly invitationService: InvitationService) {}

  @Query(() => [WorkspaceInvitationType])
  myWorkspaceInvitations(@CurrentUser() user: UserType): Promise<WorkspaceInvitationType[]> {
    return this.invitationService.myWorkspaceInvitations(user.email)
  }

  @Query(() => [WorkspaceInvitationType])
  @UseGuards(WorkspaceRoleGuard)
  @Role(WorkspaceRole.ADMIN)
  workspaceInvitations(
    @Args() args: WorkspaceInvitationsArgs,
    @CurrentWorkspaceMembership() membership: WorkspaceMembership,
  ): Promise<WorkspaceInvitationType[]> {
    return this.invitationService.invitations(membership, args)
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

  @Mutation(() => [InviteResultType])
  @UseGuards(CsrfGuard, WorkspaceRoleGuard)
  @Role(WorkspaceRole.ADMIN)
  inviteWorkspaceMembers(
    @Args('input') input: InviteWorkspaceMembersInput,
    @CurrentUser() user: UserType,
    @CurrentWorkspaceMembership() membership: WorkspaceMembership,
  ): Promise<InviteResultType[]> {
    return this.invitationService.inviteWorkspaceMembers(user.id, membership, input)
  }

  @Mutation(() => WorkspaceInvitationType)
  @UseGuards(CsrfGuard, WorkspaceRoleGuard)
  @Role(WorkspaceRole.ADMIN)
  resendInvitation(
    @Args() args: InvitationIdArgs,
    @CurrentWorkspaceMembership() membership: WorkspaceMembership,
  ): Promise<WorkspaceInvitationType> {
    return this.invitationService.resend(membership, args.invitationId)
  }

  @Mutation(() => WorkspaceInvitationType)
  @UseGuards(CsrfGuard, WorkspaceRoleGuard)
  @Role(WorkspaceRole.ADMIN)
  cancelInvitation(
    @Args() args: InvitationIdArgs,
    @CurrentWorkspaceMembership() membership: WorkspaceMembership,
  ): Promise<WorkspaceInvitationType> {
    return this.invitationService.cancel(membership, args.invitationId)
  }

  @Mutation(() => WorkspaceType)
  @UseGuards(CsrfGuard)
  acceptWorkspaceInvitation(
    @Args() args: InvitationTokenArgs,
    @CurrentUser() user: UserType,
  ): Promise<WorkspaceType> {
    return this.invitationService.accept(user.id, user.email, args.token)
  }

  @Mutation(() => WorkspaceInvitationType)
  @UseGuards(CsrfGuard)
  declineWorkspaceInvitation(@Args() args: InvitationTokenArgs): Promise<WorkspaceInvitationType> {
    return this.invitationService.decline(args.token)
  }
}
