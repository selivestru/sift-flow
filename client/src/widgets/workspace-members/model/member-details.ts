import type {
  WorkspaceMemberQuery,
  WorkspaceMemberStatus,
  WorkspaceRole,
} from '~/shared/api/graphql'

import { formatJoinedAt } from './member-row'

export interface MemberDetails {
  id: string
  fullName: string
  email: string
  role: WorkspaceRole
  status: WorkspaceMemberStatus
  joinedAt: string
  projects: WorkspaceMemberQuery['workspaceMember']['projects']
  assignedTasks: WorkspaceMemberQuery['workspaceMember']['assignedTasks']
}

export const toMemberDetails = (member: WorkspaceMemberQuery['workspaceMember']): MemberDetails => {
  return {
    id: member.id,
    fullName: member.user.fullName,
    email: member.user.email,
    role: member.role,
    status: member.status,
    joinedAt: formatJoinedAt(member.joinedAt),
    projects: member.projects,
    assignedTasks: member.assignedTasks,
  }
}
