import { graphql } from '~/shared/api/graphql'

export const InviteWorkspaceMemberDocument = graphql(`
  mutation InviteWorkspaceMember($input: InviteWorkspaceMemberInput!) {
    inviteWorkspaceMember(input: $input) {
      id
      email
      status
    }
  }
`)
