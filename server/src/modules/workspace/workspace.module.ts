import { Module } from '@nestjs/common'

import { WorkspaceCoreModule } from '~/modules/workspace/core/workspace-core.module.js'
import { InvitationModule } from '~/modules/workspace/invitations/invitation.module.js'
import { WorkspaceMemberModule } from '~/modules/workspace/members/workspace-member.module.js'
import { WorkspaceResolver } from '~/modules/workspace/workspace.resolver.js'
import { WorkspaceService } from '~/modules/workspace/workspace.service.js'

@Module({
  imports: [WorkspaceCoreModule, WorkspaceMemberModule, InvitationModule],
  providers: [WorkspaceResolver, WorkspaceService],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
