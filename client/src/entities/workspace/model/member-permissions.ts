import type { WorkspaceRole } from '~/shared/api/graphql'

const ROLE_RANK: Record<WorkspaceRole, number> = {
  MEMBER: 1,
  ADMIN: 2,
  OWNER: 3,
}

const ASSIGNABLE_ROLES: WorkspaceRole[] = ['MEMBER', 'ADMIN']

export interface MemberPermissions {
  canManage: boolean
  canChangeRole: boolean
  assignableRoles: WorkspaceRole[]
  canRemove: boolean
}

const denied: MemberPermissions = {
  canManage: false,
  canChangeRole: false,
  assignableRoles: [],
  canRemove: false,
}

export const getMemberPermissions = (
  viewerRole: WorkspaceRole | undefined,
  targetRole: WorkspaceRole,
  isSelf: boolean,
): MemberPermissions => {
  const canActOn =
    Boolean(viewerRole) && !isSelf && ROLE_RANK[targetRole] < ROLE_RANK[viewerRole as WorkspaceRole]

  if (!viewerRole || ROLE_RANK[viewerRole] < ROLE_RANK.ADMIN || !canActOn) {
    return denied
  }

  const assignableRoles = ASSIGNABLE_ROLES.filter((role) => ROLE_RANK[role] < ROLE_RANK[viewerRole])
  const canChangeRole = assignableRoles.some((role) => role !== targetRole)

  return {
    canManage: true,
    canChangeRole,
    assignableRoles,
    canRemove: true,
  }
}
