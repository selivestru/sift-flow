import type { WorkspaceRole } from '~/generated/prisma/client.js'

export interface WorkspaceMembership {
  id: string
  role: WorkspaceRole
}

declare global {
  namespace Express {
    interface Request {
      workspace?: WorkspaceMembership
    }
  }
}
