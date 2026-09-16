import {
  Alert,
  Spinner,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  type Key,
} from '@heroui/react'

import { WORKSPACE_ROLE_LABELS } from '~/entities/workspace'
import type { WorkspaceRole } from '~/shared/api/graphql'

import { useUpdateMemberRole } from '../model/useUpdateMemberRole'

const toSelectedRole = (keys: Set<Key>): WorkspaceRole | null => {
  const [key] = keys

  return (key as WorkspaceRole | undefined) ?? null
}

interface ChangeMemberRoleProps {
  workspaceId: string
  userId: string
  memberName: string
  role: WorkspaceRole
  assignableRoles: WorkspaceRole[]
}

export const ChangeMemberRole = ({
  workspaceId,
  userId,
  memberName,
  role,
  assignableRoles,
}: ChangeMemberRoleProps) => {
  const { changeRole, isSaving, errorMessage } = useUpdateMemberRole()

  const handleSelectionChange = (keys: Set<Key>) => {
    const nextRole = toSelectedRole(keys)

    if (!nextRole || nextRole === role || isSaving) {
      return
    }

    void changeRole(workspaceId, userId, nextRole)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Typography color="muted" type="body-sm">
          Change role
        </Typography>
        {isSaving && <Spinner aria-label="Updating role" />}
      </div>
      <ToggleButtonGroup
        fullWidth
        aria-label={`Role of ${memberName}`}
        isDisabled={isSaving}
        selectedKeys={new Set([role])}
        selectionMode="single"
        onSelectionChange={handleSelectionChange}
      >
        {assignableRoles.map((assignableRole) => (
          <ToggleButton key={assignableRole} id={assignableRole}>
            {WORKSPACE_ROLE_LABELS[assignableRole]}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {errorMessage && (
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Could not change this role</Alert.Title>
            <Alert.Description>{errorMessage}</Alert.Description>
          </Alert.Content>
        </Alert>
      )}
    </div>
  )
}
