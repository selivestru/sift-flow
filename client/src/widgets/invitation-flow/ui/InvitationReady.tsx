import { Button, ErrorMessage, Spinner, Typography } from '@heroui/react'
import { useNavigate } from '@tanstack/react-router'

import { useAuthStore } from '~/shared/stores/auth.store'

import { buildInvitationFacts } from '../model/invitation-facts'
import { getInvitedEmail, isEmailInvitation, type JoinPreview } from '../model/join-preview'
import { useDeclineInvitation } from '../model/useDeclineInvitation'
import { useJoinWorkspace } from '../model/useJoinWorkspace'
import { AcceptedInvitation } from './AcceptedInvitation'
import { DeclinedInvitation } from './DeclinedInvitation'
import { InvitationCard } from './InvitationCard'

interface InvitationReadyProps {
  preview: JoinPreview
  token: string
}

export const InvitationReady = ({ preview, token }: InvitationReadyProps) => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const { join, isJoining, error: joinError, isJoined } = useJoinWorkspace(token)
  const { decline, isDeclining, error: declineError, isDeclined } = useDeclineInvitation(token)

  const isEmail = isEmailInvitation(preview)
  const invitedEmail = getInvitedEmail(preview)
  const signedInEmail = user?.email ?? null
  const isSignedInAsOtherAddress =
    signedInEmail !== null && invitedEmail !== null && signedInEmail !== invitedEmail

  const facts = buildInvitationFacts(preview)

  const openWorkspace = () => {
    navigate({ to: '/w/$slug/dashboard', params: { slug: preview.slug } })
  }

  const backToOnboarding = () => {
    navigate({ to: '/onboarding' })
  }

  const loginWithInvite = () => {
    navigate({ to: '/auth/login', search: { invite: token } })
  }

  const registerWithInvite = () => {
    navigate({ to: '/auth/register', search: { invite: token } })
  }

  const switchAccount = () => {
    useAuthStore.getState().clearUser()
    loginWithInvite()
  }

  if (isJoined) {
    return <AcceptedInvitation name={preview.name} slug={preview.slug} onOpen={openWorkspace} />
  }

  if (isDeclined) {
    return <DeclinedInvitation name={preview.name} onBack={backToOnboarding} />
  }

  if (isSignedInAsOtherAddress) {
    facts.push({ label: 'Current account', value: signedInEmail })

    return (
      <InvitationCard facts={facts} preview={preview}>
        <Button fullWidth onPress={switchAccount}>
          Sign in with a different account
        </Button>
      </InvitationCard>
    )
  }

  if (signedInEmail === null) {
    return (
      <InvitationCard facts={facts} preview={preview}>
        <div className="flex flex-col gap-2">
          <Button fullWidth onPress={loginWithInvite}>
            Log in to join
          </Button>
          <Button fullWidth variant="outline" onPress={registerWithInvite}>
            Create an account
          </Button>
        </div>
        <Typography color="muted" type="body-sm">
          You need a SiftFlow account to accept this invitation.
        </Typography>
      </InvitationCard>
    )
  }

  const serverError = joinError ?? declineError

  return (
    <InvitationCard facts={facts} preview={preview}>
      {serverError && <ErrorMessage>{serverError}</ErrorMessage>}
      <div className="flex flex-col gap-2">
        <Button fullWidth isPending={isJoining} onPress={join}>
          {({ isPending }) => (
            <>
              {isPending && <Spinner color="current" size="sm" />}
              {isPending ? 'Joining…' : 'Join workspace'}
            </>
          )}
        </Button>
        {isEmail && (
          <Button fullWidth isPending={isDeclining} variant="outline" onPress={decline}>
            {({ isPending }) => (
              <>
                {isPending && <Spinner color="current" size="sm" />}
                {isPending ? 'Declining…' : 'Decline invitation'}
              </>
            )}
          </Button>
        )}
      </div>
    </InvitationCard>
  )
}
