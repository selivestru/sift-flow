import { graphql } from '~/shared/api/graphql'

export const ResendInvitationDocument = graphql(`
  mutation ResendInvitation($workspaceId: ID!, $invitationId: ID!) {
    resendInvitation(workspaceId: $workspaceId, invitationId: $invitationId) {
      id
      status
      expiresAt
    }
  }
`)
