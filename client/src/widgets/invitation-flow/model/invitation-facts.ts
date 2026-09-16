import { WORKSPACE_ROLE_LABELS } from '~/entities/workspace'

import { getInvitedEmail, type JoinPreview } from './join-preview'

export interface InvitationFact {
  label: string
  value: string
}

export const buildInvitationFacts = (preview: JoinPreview): InvitationFact[] => {
  const invitedEmail = getInvitedEmail(preview)

  return [
    { label: 'Role', value: WORKSPACE_ROLE_LABELS[preview.role] },
    ...(invitedEmail === null ? [] : [{ label: 'Sent to', value: invitedEmail }]),
  ]
}
