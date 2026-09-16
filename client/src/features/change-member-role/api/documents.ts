import { graphql } from '~/shared/api/graphql'

export const UpdateWorkspaceMemberRoleDocument = graphql(`
  mutation UpdateWorkspaceMemberRole($input: UpdateWorkspaceMemberRoleInput!) {
    updateWorkspaceMemberRole(input: $input) {
      id
      role
      status
      joinedAt
      user {
        id
        email
        fullName
      }
    }
  }
`)
