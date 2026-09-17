import { graphql } from '~/shared/api/graphql'

export const CancelInvitationDocument = graphql(`
  mutation CancelInvitation($workspaceId: ID!, $invitationId: ID!) {
    cancelInvitation(workspaceId: $workspaceId, invitationId: $invitationId) {
      id
      status
    }
  }
`)
