import { Module } from '@nestjs/common'

import { MailModule } from '~/infrastructure/mail/mail.module.js'
import { WorkspaceCoreModule } from '~/modules/workspace/core/workspace-core.module.js'
import { InvitationResolver } from '~/modules/workspace/invitations/invitation.resolver.js'
import { InvitationService } from '~/modules/workspace/invitations/invitation.service.js'
import { WorkspaceJoinLinkResolver } from '~/modules/workspace/invitations/workspace-join-link.resolver.js'
import { WorkspaceJoinLinkService } from '~/modules/workspace/invitations/workspace-join-link.service.js'

@Module({
  imports: [WorkspaceCoreModule, MailModule],
  providers: [
    InvitationResolver,
    InvitationService,
    WorkspaceJoinLinkResolver,
    WorkspaceJoinLinkService,
  ],
  exports: [InvitationService, WorkspaceJoinLinkService],
})
export class InvitationModule {}
