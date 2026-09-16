import { graphql } from '~/shared/api/graphql'

export const WorkspaceJoinPreviewDocument = graphql(`
  query WorkspaceJoinPreview($token: String!) {
    workspaceJoinPreview(token: $token) {
      name
      slug
      role
      kind
      email
    }
  }
`)

export const DeclineWorkspaceInvitationDocument = graphql(`
  mutation DeclineWorkspaceInvitation($token: String!) {
    declineWorkspaceInvitation(token: $token) {
      id
      status
    }
  }
`)
