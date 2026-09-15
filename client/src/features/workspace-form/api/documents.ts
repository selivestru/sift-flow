import { graphql } from '~/shared/api/graphql'

export const IsWorkspaceSlugAvailableDocument = graphql(`
  query IsWorkspaceSlugAvailable($slug: String!, $workspaceId: ID) {
    isWorkspaceSlugAvailable(slug: $slug, workspaceId: $workspaceId)
  }
`)

export const CreateWorkspaceDocument = graphql(`
  mutation CreateWorkspace($input: CreateWorkspaceInput!) {
    createWorkspace(input: $input) {
      id
      name
      slug
      membersCount
      role
      createdAt
    }
  }
`)

export const UpdateWorkspaceDocument = graphql(`
  mutation UpdateWorkspace($input: UpdateWorkspaceInput!) {
    updateWorkspace(input: $input) {
      id
      name
      slug
      membersCount
      role
      createdAt
    }
  }
`)
