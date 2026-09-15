import { Modal, Typography } from '@heroui/react'

import type { WorkspaceSummary } from '../model/workspace'
import { WorkspaceForm } from './WorkspaceForm'

interface WorkspaceFormModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSuccess: (workspace: WorkspaceSummary) => void
}

export const WorkspaceFormModal = ({
  isOpen,
  onOpenChange,
  onSuccess,
}: WorkspaceFormModalProps) => {
  const close = () => onOpenChange(false)

  const handleSuccess = (workspace: WorkspaceSummary) => {
    onSuccess(workspace)
    close()
  }

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-md">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>New workspace</Modal.Heading>
            <Typography className="mt-1.5" color="muted" type="body-sm">
              A workspace is where your team's boards, lists and cards live.
            </Typography>
          </Modal.Header>
          <Modal.Body>
            <WorkspaceForm mode="create" onCancel={close} onSuccess={handleSuccess} />
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
