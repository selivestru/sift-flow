import { Module } from '@nestjs/common'

import { WorkspaceRoleGuard } from '~/common/guards/workspace-role.guard.js'

import { InvitationService } from './invitation.service.js'
import { WorkspaceInvitationResolver } from './workspace-invitation.resolver.js'
import { WorkspaceResolver } from './workspace.resolver.js'
import { WorkspaceService } from './workspace.service.js'

@Module({
  providers: [
    WorkspaceResolver,
    WorkspaceInvitationResolver,
    WorkspaceService,
    InvitationService,
    WorkspaceRoleGuard,
  ],
})
export class WorkspaceModule {}
