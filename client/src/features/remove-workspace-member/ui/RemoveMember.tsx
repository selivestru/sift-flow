import { Alert, AlertDialog, Button, Typography } from '@heroui/react'
import { useState } from 'react'

import { useRemoveMember } from '../model/useRemoveMember'

interface RemoveMemberProps {
  workspaceId: string
  userId: string
  memberName: string
  onRemoved: () => void
}

export const RemoveMember = ({ workspaceId, userId, memberName, onRemoved }: RemoveMemberProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { removeMember, isRemoving, errorMessage } = useRemoveMember()

  const handleConfirm = async () => {
    const isRemoved = await removeMember(workspaceId, userId)

    if (isRemoved) {
      onRemoved()
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button fullWidth isDisabled={isRemoving} variant="danger" onPress={() => setIsOpen(true)}>
        Remove from workspace
      </Button>
      <AlertDialog.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[400px]">
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>Remove {memberName} from this workspace?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <Typography type="body-sm">
                They lose access to this workspace and everything in it. You can invite them again
                later.
              </Typography>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                Cancel
              </Button>
              <Button slot="close" isDisabled={isRemoving} variant="danger" onPress={handleConfirm}>
                Remove
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
      {errorMessage && (
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Could not remove this member</Alert.Title>
            <Alert.Description>{errorMessage}</Alert.Description>
          </Alert.Content>
        </Alert>
      )}
    </div>
  )
}
