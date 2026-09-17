import { useEffect, useMemo } from 'react'
import { useQuery } from 'urql'

import {
  type InvitationStatus,
  WorkspaceInvitationsDocument,
  getApiErrorMessage,
} from '~/shared/api/graphql'
import { useWorkspaceAccess } from '~/shared/hooks/useWorkspaceAccess'

import { type InvitationRow, toInvitationRow } from './invitation-row'
import { useInvitationsRefresh } from './invitations-refresh.store'
import { type InvitationStatusFilter, toInvitationStatuses } from './invitations-search'

export const useInvitationsQuery = (slug: string, filter: InvitationStatusFilter) => {
  const { workspaceId } = useWorkspaceAccess(slug)
  const revision = useInvitationsRefresh((state) => state.revision)

  const statusesKey = toInvitationStatuses(filter).join(',')

  const variables = useMemo(
    () => ({
      workspaceId: workspaceId ?? '',
      statuses: statusesKey.split(',') as InvitationStatus[],
    }),
    [workspaceId, statusesKey],
  )

  const [result, reexecuteInvitations] = useQuery({
    query: WorkspaceInvitationsDocument,
    variables,
    pause: !workspaceId,
    requestPolicy: 'cache-and-network',
  })

  useEffect(() => {
    if (revision === 0) {
      return
    }

    reexecuteInvitations({ requestPolicy: 'network-only' })
  }, [revision, reexecuteInvitations])

  const rows: InvitationRow[] =
    result.data?.workspaceInvitations.map((invitation) => toInvitationRow(invitation)) ?? []

  const refetch = () => reexecuteInvitations({ requestPolicy: 'network-only' })

  return {
    rows,
    isLoading: result.fetching && rows.length === 0,
    isFetching: result.fetching,
    errorMessage: result.error ? getApiErrorMessage(result.error) : null,
    refetch,
  }
}
