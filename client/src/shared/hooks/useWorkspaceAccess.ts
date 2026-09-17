import { useQuery } from 'urql'

import type { WorkspaceRole } from '~/shared/api/graphql'
import { MyWorkspacesDocument } from '~/shared/api/workspace'

interface WorkspaceAccess {
  workspaceId: string | undefined
  viewerRole: WorkspaceRole | undefined
  isPending: boolean
}

export const useWorkspaceAccess = (slug: string): WorkspaceAccess => {
  const [{ data }] = useQuery({ query: MyWorkspacesDocument, requestPolicy: 'cache-only' })
  const workspace = data?.myWorkspaces.find((entry) => entry.slug === slug)

  return {
    workspaceId: workspace?.id,
    viewerRole: workspace?.role,
    isPending: data === undefined,
  }
}
