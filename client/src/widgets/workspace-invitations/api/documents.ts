import { graphql } from '~/shared/api/graphql'

export const WorkspaceJoinLinkDocument = graphql(`
  query WorkspaceJoinLink($workspaceId: ID!) {
    workspaceJoinLink(workspaceId: $workspaceId) {
      id
      url
      role
      expiresAt
      createdAt
    }
  }
`)
