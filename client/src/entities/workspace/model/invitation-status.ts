import type { ChipProps } from '@heroui/react'

import type { InvitationStatus } from '~/shared/api/graphql'

export const INVITATION_STATUS_LABELS: Record<InvitationStatus, string> = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  DECLINED: 'Declined',
  EXPIRED: 'Expired',
  CANCELED: 'Canceled',
}

export const INVITATION_STATUS_COLOR: Record<InvitationStatus, ChipProps['color']> = {
  PENDING: 'warning',
  ACCEPTED: 'success',
  DECLINED: 'default',
  EXPIRED: 'default',
  CANCELED: 'danger',
}
