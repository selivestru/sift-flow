import type { ChipProps } from '@heroui/react'

import type { WorkspaceRole } from '~/shared/api/graphql'

export const WORKSPACE_ROLE_LABELS: Record<WorkspaceRole, string> = {
  OWNER: 'Owner',
  ADMIN: 'Admin',
  MEMBER: 'Member',
}

export const WORKSPACE_ROLE_COLOR: Record<WorkspaceRole, ChipProps['color']> = {
  OWNER: 'accent',
  ADMIN: 'warning',
  MEMBER: 'default',
}
