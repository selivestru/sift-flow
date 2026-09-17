import { z } from 'zod'

import { INVITATION_STATUS_LABELS } from '~/entities/workspace'
import type { InvitationStatus } from '~/shared/api/graphql'

export const INVITATION_STATUSES: InvitationStatus[] = [
  'PENDING',
  'ACCEPTED',
  'DECLINED',
  'EXPIRED',
  'CANCELED',
]

export const INVITATION_STATUS_FILTERS = [...INVITATION_STATUSES, 'ALL'] as const

export type InvitationStatusFilter = (typeof INVITATION_STATUS_FILTERS)[number]

export const DEFAULT_INVITATION_STATUS_FILTER: InvitationStatusFilter = 'PENDING'

export const INVITATION_STATUS_FILTER_LABELS: Record<InvitationStatusFilter, string> = {
  ...INVITATION_STATUS_LABELS,
  ALL: 'All',
}

export interface InvitationsSearch {
  status?: InvitationStatusFilter
}

const invitationsSearchSchema = z.object({
  status: z.string().optional(),
})

const isStatusFilter = (value: string): value is InvitationStatusFilter =>
  (INVITATION_STATUS_FILTERS as readonly string[]).includes(value)

export const parseInvitationsSearch = (search: Record<string, unknown>): InvitationsSearch => {
  const parsed = invitationsSearchSchema.safeParse(search)

  if (!parsed.success) {
    return {}
  }

  const { status } = parsed.data

  return status === undefined ||
    !isStatusFilter(status) ||
    status === DEFAULT_INVITATION_STATUS_FILTER
    ? {}
    : { status }
}

export const toInvitationStatusFilter = (search: InvitationsSearch): InvitationStatusFilter =>
  search.status ?? DEFAULT_INVITATION_STATUS_FILTER

export const toInvitationsSearch = (filter: InvitationStatusFilter): InvitationsSearch =>
  parseInvitationsSearch({ status: filter })

export const toInvitationStatuses = (filter: InvitationStatusFilter): InvitationStatus[] =>
  filter === 'ALL' ? INVITATION_STATUSES : [filter]
