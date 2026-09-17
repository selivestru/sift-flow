import { useQuery } from 'urql'

import { getApiErrorMessage } from '~/shared/api/graphql'

import { WorkspaceJoinLinkDocument } from '../api/documents'

export const useJoinLinkQuery = (workspaceId: string) => {
  const [result, reexecuteJoinLink] = useQuery({
    query: WorkspaceJoinLinkDocument,
    variables: { workspaceId },
    requestPolicy: 'cache-and-network',
  })

  const refetch = () => reexecuteJoinLink({ requestPolicy: 'network-only' })

  return {
    link: result.data?.workspaceJoinLink ?? null,
    isLoading: result.fetching && !result.data,
    errorMessage: result.error ? getApiErrorMessage(result.error) : null,
    refetch,
  }
}
