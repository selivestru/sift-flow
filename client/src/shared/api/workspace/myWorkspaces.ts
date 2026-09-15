import { MyWorkspacesDocument, graphqlClient } from '~/shared/api/graphql'

export { MyWorkspacesDocument }

export const fetchMyWorkspaces = async () => {
  const result = await graphqlClient.query(
    MyWorkspacesDocument,
    {},
    { requestPolicy: 'network-only' },
  )

  if (result.error) {
    throw result.error
  }

  return result.data?.myWorkspaces ?? []
}
