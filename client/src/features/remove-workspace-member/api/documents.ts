import { graphql } from '~/shared/api/graphql'

export const RemoveWorkspaceMemberDocument = graphql(`
  mutation RemoveWorkspaceMember($input: RemoveWorkspaceMemberInput!) {
    removeWorkspaceMember(input: $input) {
      member {
        id
        status
        role
        user {
          id
          email
          fullName
        }
      }
      workspace {
        id
        membersCount
      }
    }
  }
`)
