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

export const AcceptWorkspaceInvitationDocument = graphql(`
  mutation AcceptWorkspaceInvitation($token: String!) {
    acceptWorkspaceInvitation(token: $token) {
      id
      name
      slug
      membersCount
      role
      createdAt
    }
  }
`)

export const WorkspaceMembersDocument = graphql(`
  query WorkspaceMembers(
    $workspaceId: ID!
    $search: String
    $roles: [WorkspaceRole!]
    $limit: Int
    $offset: Int
  ) {
    workspaceMembers(
      workspaceId: $workspaceId
      search: $search
      roles: $roles
      limit: $limit
      offset: $offset
    ) {
      total
      members {
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
  }
`)

export const WorkspaceMemberDocument = graphql(`
  query WorkspaceMember($workspaceId: ID!, $userId: ID!) {
    workspaceMember(workspaceId: $workspaceId, userId: $userId) {
      id
      role
      status
      joinedAt
      user {
        id
        email
        fullName
      }
      projects {
        id
        name
      }
      assignedTasks {
        id
        title
      }
    }
  }
`)

export const InviteWorkspaceMemberDocument = graphql(`
  mutation InviteWorkspaceMember($input: InviteWorkspaceMemberInput!) {
    inviteWorkspaceMember(input: $input) {
      id
      email
      role
      status
    }
  }
`)

export const WorkspaceInvitationsDocument = graphql(`
  query WorkspaceInvitations($workspaceId: ID!, $statuses: [InvitationStatus!]) {
    workspaceInvitations(workspaceId: $workspaceId, statuses: $statuses) {
      id
      email
      role
      status
      token
      expiresAt
      createdAt
      invitedBy {
        id
        email
        fullName
      }
    }
  }
`)

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
