import { graphqlClient } from '~/shared/api/graphql'

import { type JoinPreviewState, toJoinPreviewFailure } from '../model/join-preview'
import { WorkspaceJoinPreviewDocument } from './documents'

export const fetchJoinPreview = async (token: string): Promise<JoinPreviewState> => {
  const result = await graphqlClient.query(
    WorkspaceJoinPreviewDocument,
    { token },
    { requestPolicy: 'network-only' },
  )

  const preview = result.data?.workspaceJoinPreview

  if (preview) {
    return { status: 'ready', preview }
  }

  return { status: 'unavailable', reason: toJoinPreviewFailure(result.error) }
}
