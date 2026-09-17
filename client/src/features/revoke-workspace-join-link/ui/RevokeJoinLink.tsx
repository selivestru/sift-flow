import { AlertDialog, Button, Typography, toast } from '@heroui/react'
import { useState } from 'react'

import { useRevokeJoinLink } from '../model/useRevokeJoinLink'

interface RevokeJoinLinkProps {
  workspaceId: string
  onRevoked: () => void
}

export const RevokeJoinLink = ({ workspaceId, onRevoked }: RevokeJoinLinkProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { revokeJoinLink, isRevoking } = useRevokeJoinLink()

  const handleConfirm = async () => {
    const errorMessage = await revokeJoinLink(workspaceId)

    if (errorMessage) {
      toast.danger('Could not revoke the link', { description: errorMessage })

      return
    }

    toast.success('New link generated', { description: 'The previous link no longer works' })
    onRevoked()
  }

  return (
    <>
      <Button variant="danger" className="max-sm:w-full" onPress={() => setIsOpen(true)}>
        Revoke &amp; regenerate
      </Button>
      <AlertDialog.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-100">
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>Revoke the current link?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <Typography type="body-sm">
                Everyone holding the old link loses access immediately. A new link is issued right
                away.
              </Typography>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                Keep it
              </Button>
              <Button slot="close" isDisabled={isRevoking} variant="danger" onPress={handleConfirm}>
                Revoke &amp; regenerate
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </>
  )
}
