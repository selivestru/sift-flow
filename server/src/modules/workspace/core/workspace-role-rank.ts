import { WorkspaceRole } from '~/generated/prisma/client.js'

export const WORKSPACE_ROLE_RANK: Record<WorkspaceRole, number> = {
  [WorkspaceRole.MEMBER]: 1,
  [WorkspaceRole.ADMIN]: 2,
  [WorkspaceRole.OWNER]: 3,
}
