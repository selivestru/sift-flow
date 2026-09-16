import { Module } from '@nestjs/common'

import { WorkspaceCoreModule } from '~/modules/workspace/core/workspace-core.module.js'
import { WorkspaceMemberResolver } from '~/modules/workspace/members/workspace-member.resolver.js'
import { WorkspaceMemberService } from '~/modules/workspace/members/workspace-member.service.js'

@Module({
  imports: [WorkspaceCoreModule],
  providers: [WorkspaceMemberResolver, WorkspaceMemberService],
  exports: [WorkspaceMemberService],
})
export class WorkspaceMemberModule {}
