import type { ChipProps } from '@heroui/react'

import type { WorkspaceMemberStatus } from '~/shared/api/graphql'

export const WORKSPACE_MEMBER_STATUS_LABELS: Record<WorkspaceMemberStatus, string> = {
  ACTIVE: 'Active',
  REMOVED: 'Removed',
}

export const WORKSPACE_MEMBER_STATUS_COLOR: Record<WorkspaceMemberStatus, ChipProps['color']> = {
  ACTIVE: 'success',
  REMOVED: 'danger',
}
