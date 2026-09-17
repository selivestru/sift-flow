import { graphql } from '~/shared/api/graphql'

export const RevokeWorkspaceJoinLinkDocument = graphql(`
  mutation RevokeWorkspaceJoinLink($workspaceId: ID!) {
    revokeWorkspaceJoinLink(workspaceId: $workspaceId) {
      id
      url
      role
      expiresAt
      createdAt
    }
  }
`)
