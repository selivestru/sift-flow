import { Card } from '@heroui/react'

import { WorkspaceForm, type WorkspaceSummary } from '~/features/workspace-form'

interface CreateWorkspaceStepProps {
  onCreated: (workspace: WorkspaceSummary) => void
}

export const CreateWorkspaceStep = ({ onCreated }: CreateWorkspaceStepProps) => {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Create a workspace</Card.Title>
        <Card.Description>
          Everything you track lives in a workspace — boards, lists and cards. You can create more
          later.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <WorkspaceForm mode="create" onSuccess={onCreated} />
      </Card.Content>
    </Card>
  )
}
