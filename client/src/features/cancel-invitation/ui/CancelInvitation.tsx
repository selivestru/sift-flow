import { AlertDialog, Button, Tooltip, Typography, toast } from '@heroui/react'
import { useState } from 'react'
import { X } from 'reicon-react'

import { useCancelInvitation } from '../model/useCancelInvitation'

interface CancelInvitationProps {
  workspaceId: string
  invitationId: string
  email: string
  onCanceled: () => void
}

export const CancelInvitation = ({
  workspaceId,
  invitationId,
  email,
  onCanceled,
}: CancelInvitationProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { cancelInvitation, isCanceling } = useCancelInvitation()

  const handleConfirm = async () => {
    const errorMessage = await cancelInvitation(workspaceId, invitationId)

    if (errorMessage) {
      toast.danger('Could not cancel this invitation', { description: errorMessage })

      return
    }

    toast.success('Invitation canceled', { description: email })
    onCanceled()
  }

  return (
    <>
      <Tooltip>
        <Button
          isIconOnly
          aria-label={`Cancel the invitation to ${email}`}
          variant="ghost"
          onPress={() => setIsOpen(true)}
        >
          <X className="size-5" />
        </Button>
        <Tooltip.Content>Cancel invitation</Tooltip.Content>
      </Tooltip>
      <AlertDialog.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-100">
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>Cancel the invitation to {email}?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <Typography type="body-sm">
                Their invitation link stops working immediately. You can invite them again later.
              </Typography>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                Keep it
              </Button>
              <Button
                slot="close"
                isDisabled={isCanceling}
                variant="danger"
                onPress={handleConfirm}
              >
                Cancel invitation
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </>
  )
}
