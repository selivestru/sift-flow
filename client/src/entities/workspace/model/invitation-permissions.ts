import type { WorkspaceRole } from '~/shared/api/graphql'

const ROLE_RANK: Record<WorkspaceRole, number> = {
  MEMBER: 1,
  ADMIN: 2,
  OWNER: 3,
}

const INVITABLE_ROLES: WorkspaceRole[] = ['ADMIN', 'MEMBER']

export const DEFAULT_INVITABLE_ROLE: WorkspaceRole = 'MEMBER'

export interface InvitationPermissions {
  canManageInvitations: boolean
  assignableRoles: WorkspaceRole[]
}

const denied: InvitationPermissions = {
  canManageInvitations: false,
  assignableRoles: [],
}

export const getInvitationPermissions = (
  viewerRole: WorkspaceRole | undefined,
): InvitationPermissions => {
  const viewerRank = viewerRole === undefined ? 0 : ROLE_RANK[viewerRole]

  if (viewerRank < ROLE_RANK.ADMIN) {
    return denied
  }

  return {
    canManageInvitations: true,
    assignableRoles: INVITABLE_ROLES.filter((role) => ROLE_RANK[role] < viewerRank),
  }
}
