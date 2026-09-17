import type {
  InvitationStatus,
  WorkspaceInvitationsQuery,
  WorkspaceRole,
} from '~/shared/api/graphql'

export interface InvitationRow {
  id: string
  email: string
  role: WorkspaceRole
  status: InvitationStatus
  invitedBy: string
  createdAt: string
  expiresAt: string
  token: string
}

const INVITATION_DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const formatInvitationDate = (value: unknown) => {
  const date = new Date(String(value))

  return Number.isNaN(date.getTime()) ? '—' : INVITATION_DATE_FORMAT.format(date)
}

export const toInvitationRow = (
  invitation: WorkspaceInvitationsQuery['workspaceInvitations'][number],
): InvitationRow => {
  return {
    id: invitation.id,
    email: invitation.email ?? '—',
    role: invitation.role,
    status: invitation.status,
    invitedBy: invitation.invitedBy.fullName,
    createdAt: formatInvitationDate(invitation.createdAt),
    expiresAt:
      invitation.expiresAt === null || invitation.expiresAt === undefined
        ? '—'
        : formatInvitationDate(invitation.expiresAt),
    token: invitation.token,
  }
}

export const formatInvitationsCount = (count: number) =>
  count === 1 ? '1 invitation' : `${count} invitations`
