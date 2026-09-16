import type { WorkspaceRole } from '~/generated/prisma/client.js'

export const EMAIL_QUEUE = 'email'
export const WORKSPACE_INVITATION_JOB = 'workspace-invitation'

export interface WorkspaceInvitationEmail {
  email: string
  workspaceName: string
  role: WorkspaceRole
  invitationUrl: string
}
