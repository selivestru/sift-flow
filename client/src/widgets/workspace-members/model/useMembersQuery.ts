import { useMemo, useState } from 'react'
import { useQuery } from 'urql'

import {
  type WorkspaceMembersQuery,
  type WorkspaceRole,
  getApiErrorMessage,
} from '~/shared/api/graphql'
import { WorkspaceMembersDocument } from '~/shared/api/graphql'
import { MyWorkspacesDocument } from '~/shared/api/workspace'

import { type MemberRow, toMemberRow } from './member-row'
import type { MembersFilters } from './members-search'

interface MembersPage {
  source: WorkspaceMembersQuery['workspaceMembers'] | null
  rows: MemberRow[]
  total: number
}

const EMPTY_PAGE: MembersPage = { source: null, rows: [], total: 0 }

const WORKSPACE_MISSING_MESSAGE = 'This workspace is no longer available'

export const useMembersQuery = (slug: string, filters: MembersFilters) => {
  const [{ data: workspaces }, reexecuteWorkspaces] = useQuery({
    query: MyWorkspacesDocument,
    requestPolicy: 'cache-only',
  })

  const workspaceId = workspaces?.myWorkspaces.find((workspace) => workspace.slug === slug)?.id

  const rolesKey = filters.roles.join(',')

  const variables = useMemo(
    () => ({
      workspaceId: workspaceId ?? '',
      search: filters.search === '' ? undefined : filters.search,
      roles: rolesKey === '' ? undefined : (rolesKey.split(',') as WorkspaceRole[]),
      limit: filters.pageSize,
      offset: (filters.page - 1) * filters.pageSize,
    }),
    [workspaceId, filters.search, rolesKey, filters.page, filters.pageSize],
  )

  const [result, reexecuteMembers] = useQuery({
    query: WorkspaceMembersDocument,
    variables,
    pause: !workspaceId,
    requestPolicy: 'cache-and-network',
  })

  const [page, setPage] = useState<MembersPage>(EMPTY_PAGE)

  const membersPage = result.data?.workspaceMembers

  if (membersPage && membersPage !== page.source) {
    setPage({
      source: membersPage,
      rows: membersPage.members.map(toMemberRow),
      total: membersPage.total,
    })
  }

  const isWorkspaceMissing = workspaces !== undefined && workspaceId === undefined

  const retry = () => {
    reexecuteWorkspaces({ requestPolicy: 'cache-and-network' })
    reexecuteMembers()
  }

  return {
    rows: page.rows,
    total: page.total,
    isLoading: result.fetching && page.rows.length === 0,
    isFetching: result.fetching,
    errorMessage: isWorkspaceMissing
      ? WORKSPACE_MISSING_MESSAGE
      : result.error
        ? getApiErrorMessage(result.error)
        : null,
    retry,
  }
}
