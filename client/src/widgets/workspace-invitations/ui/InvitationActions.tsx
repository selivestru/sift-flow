import { CancelInvitation } from '~/features/cancel-invitation'
import { CopyInvitationLink } from '~/features/copy-invitation-link'
import { ResendInvitation } from '~/features/resend-invitation'

import type { InvitationRow } from '../model/invitation-row'

interface InvitationActionsProps {
  invitation: InvitationRow
  workspaceId: string
  onMutated: () => void
}

export const InvitationActions = ({
  invitation,
  workspaceId,
  onMutated,
}: InvitationActionsProps) => {
  if (invitation.status !== 'PENDING') {
    return null
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <CopyInvitationLink token={invitation.token} />
      <ResendInvitation
        email={invitation.email}
        invitationId={invitation.id}
        workspaceId={workspaceId}
        onResent={onMutated}
      />
      <CancelInvitation
        email={invitation.email}
        invitationId={invitation.id}
        workspaceId={workspaceId}
        onCanceled={onMutated}
      />
    </div>
  )
}
