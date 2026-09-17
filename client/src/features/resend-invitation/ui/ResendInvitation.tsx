import { Button, Spinner, Tooltip, toast } from '@heroui/react'
import { Refresh } from 'reicon-react'

import { useResendInvitation } from '../model/useResendInvitation'

interface ResendInvitationProps {
  workspaceId: string
  invitationId: string
  email: string
  onResent: () => void
}

export const ResendInvitation = ({
  workspaceId,
  invitationId,
  email,
  onResent,
}: ResendInvitationProps) => {
  const { resendInvitation, isResending } = useResendInvitation()

  const handlePress = async () => {
    const errorMessage = await resendInvitation(workspaceId, invitationId)

    if (errorMessage) {
      toast.danger('Could not resend this invitation', { description: errorMessage })

      return
    }

    toast.success('Invitation resent', { description: email })
    onResent()
  }

  return (
    <Tooltip>
      <Button
        isIconOnly
        aria-label={`Resend the invitation to ${email}`}
        isDisabled={isResending}
        variant="ghost"
        onPress={handlePress}
      >
        {isResending ? (
          <Spinner aria-label="Resending the invitation" size="sm" />
        ) : (
          <Refresh className="size-5" />
        )}
      </Button>
      <Tooltip.Content>Resend invitation</Tooltip.Content>
    </Tooltip>
  )
}
