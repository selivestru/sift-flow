import { Spinner, ToggleButton, ToggleButtonGroup, Typography, type Key } from '@heroui/react'

import {
  DEFAULT_INVITATION_STATUS_FILTER,
  INVITATION_STATUS_FILTERS,
  INVITATION_STATUS_FILTER_LABELS,
  type InvitationStatusFilter,
} from '../model/invitations-search'

interface InvitationsToolbarProps {
  filter: InvitationStatusFilter
  countLabel: string | null
  isFetching: boolean
  onFilterChange: (filter: InvitationStatusFilter) => void
}

const toSelectedFilter = (keys: Set<Key>): InvitationStatusFilter =>
  INVITATION_STATUS_FILTERS.find((filter) => keys.has(filter)) ?? DEFAULT_INVITATION_STATUS_FILTER

export const InvitationsToolbar = ({
  filter,
  countLabel,
  isFetching,
  onFilterChange,
}: InvitationsToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ToggleButtonGroup
        aria-label="Filter invitations by status"
        className="max-w-full flex-wrap"
        selectedKeys={new Set([filter])}
        selectionMode="single"
        onSelectionChange={(keys) => onFilterChange(toSelectedFilter(keys))}
      >
        {INVITATION_STATUS_FILTERS.map((statusFilter) => (
          <ToggleButton key={statusFilter} id={statusFilter}>
            {INVITATION_STATUS_FILTER_LABELS[statusFilter]}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {isFetching && <Spinner aria-label="Loading invitations" />}
      {countLabel && (
        <Typography className="ml-auto" color="muted" type="body-sm">
          {countLabel}
        </Typography>
      )}
    </div>
  )
}
