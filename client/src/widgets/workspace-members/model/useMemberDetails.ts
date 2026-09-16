import { useQuery } from 'urql'

import { WorkspaceMemberDocument, getApiErrorMessage } from '~/shared/api/graphql'

import { toMemberDetails } from './member-details'
import { useWorkspaceAccess } from './useWorkspaceAccess'

export const useMemberDetails = (slug: string, userId: string | null) => {
  const { workspaceId } = useWorkspaceAccess(slug)

  const [result, reexecute] = useQuery({
    query: WorkspaceMemberDocument,
    variables: { workspaceId: workspaceId ?? '', userId: userId ?? '' },
    pause: workspaceId === undefined || userId === null,
    requestPolicy: 'cache-and-network',
  })

  return {
    details: result.data?.workspaceMember ? toMemberDetails(result.data.workspaceMember) : null,
    isFetching: result.fetching,
    errorMessage: result.error ? getApiErrorMessage(result.error) : null,
    retry: () => reexecute({ requestPolicy: 'cache-and-network' }),
  }
}
