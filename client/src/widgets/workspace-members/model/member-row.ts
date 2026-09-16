import type {
  WorkspaceMembersQuery,
  WorkspaceMemberStatus,
  WorkspaceRole,
} from '~/shared/api/graphql'

export interface MemberRow {
  id: string
  userId: string
  fullName: string
  email: string
  role: WorkspaceRole
  status: WorkspaceMemberStatus
  joinedAt: string
}

const JOINED_AT_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export const formatJoinedAt = (value: unknown) => {
  const date = new Date(String(value))

  return Number.isNaN(date.getTime()) ? '—' : JOINED_AT_FORMAT.format(date)
}

export const toMemberRow = (
  member: WorkspaceMembersQuery['workspaceMembers']['members'][number],
): MemberRow => {
  return {
    id: member.id,
    userId: member.user.id,
    fullName: member.user.fullName,
    email: member.user.email,
    role: member.role,
    status: member.status,
    joinedAt: formatJoinedAt(member.joinedAt),
  }
}

export const formatMembersCount = (count: number) => (count === 1 ? '1 member' : `${count} members`)
