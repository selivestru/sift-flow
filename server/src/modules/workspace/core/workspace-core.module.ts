import { Module } from '@nestjs/common'

import { WorkspaceRoleGuard } from '~/modules/workspace/core/workspace-role.guard.js'

@Module({
  providers: [WorkspaceRoleGuard],
  exports: [WorkspaceRoleGuard],
})
export class WorkspaceCoreModule {}
