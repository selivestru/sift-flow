import { graphql } from './gql'

export const MyWorkspacesDocument = graphql(`
  query MyWorkspaces {
    myWorkspaces {
      id
      name
      slug
      membersCount
      role
      createdAt
    }
  }
`)
