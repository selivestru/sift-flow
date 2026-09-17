import {
  SearchField,
  Spinner,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  type Key,
} from '@heroui/react'
import { useState } from 'react'

import { WORKSPACE_ROLE_LABELS } from '~/entities/workspace'
import type { WorkspaceRole } from '~/shared/api/graphql'
import { useDebounceEffect } from '~/shared/hooks/useDebounceEffect'

import { WORKSPACE_ROLES } from '../model/members-search'

const SEARCH_DEBOUNCE_MS = 300

interface MembersToolbarProps {
  search: string
  roles: WorkspaceRole[]
  countLabel: string | null
  isFetching: boolean
  onSearchChange: (search: string) => void
  onRolesChange: (roles: WorkspaceRole[]) => void
}

const toSelectedRoles = (keys: Set<Key>) => WORKSPACE_ROLES.filter((role) => keys.has(role))

export const MembersToolbar = ({
  search,
  roles,
  countLabel,
  isFetching,
  onSearchChange,
  onRolesChange,
}: MembersToolbarProps) => {
  const [searchText, setSearchText] = useState(search)
  const [appliedSearch, setAppliedSearch] = useState(search)

  if (search !== appliedSearch) {
    setAppliedSearch(search)
    setSearchText(search)
  }

  useDebounceEffect(
    () => {
      if (searchText !== search) {
        onSearchChange(searchText)
      }
    },
    SEARCH_DEBOUNCE_MS,
    [searchText],
  )

  return (
    <div className="flex flex-wrap items-center gap-3">
      <SearchField
        aria-label="Search members"
        className="w-full sm:w-72"
        value={searchText}
        variant="secondary"
        onChange={setSearchText}
      >
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input aria-label="Search members" placeholder="Search by name or email" />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>
      <ToggleButtonGroup
        aria-label="Filter by role"
        selectedKeys={new Set(roles)}
        selectionMode="multiple"
        onSelectionChange={(keys) => onRolesChange(toSelectedRoles(keys))}
      >
        {WORKSPACE_ROLES.map((role) => (
          <ToggleButton key={role} id={role}>
            {WORKSPACE_ROLE_LABELS[role]}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {isFetching && <Spinner aria-label="Loading members" />}
      {countLabel && (
        <Typography className="ml-auto" color="muted" type="body-sm">
          {countLabel}
        </Typography>
      )}
    </div>
  )
}
