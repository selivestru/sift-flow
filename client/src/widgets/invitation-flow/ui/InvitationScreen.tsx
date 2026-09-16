import type { JoinPreviewState } from '../model/join-preview'
import { InvitationReady } from './InvitationReady'
import { InvitationShell } from './InvitationShell'
import { InvitationUnavailable } from './InvitationUnavailable'

interface InvitationScreenProps {
  state: JoinPreviewState
  token: string
}

export const InvitationScreen = ({ state, token }: InvitationScreenProps) => {
  return (
    <InvitationShell>
      {state.status === 'ready' ? (
        <InvitationReady preview={state.preview} token={token} />
      ) : (
        <InvitationUnavailable reason={state.reason} />
      )}
    </InvitationShell>
  )
}
