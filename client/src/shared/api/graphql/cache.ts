import { cacheExchange } from '@urql/exchange-graphcache'
import type { CacheExchangeOpts } from '@urql/exchange-graphcache'

import type {
  AcceptWorkspaceInvitationMutation,
  CreateWorkspaceMutation,
  RemoveWorkspaceMemberMutation,
  WorkspaceMembersQueryVariables,
} from '~/shared/api/graphql'

import { MyWorkspacesDocument, WorkspaceMembersDocument } from './documents'

const memberPageVariables = (cache: {
  inspectFields: (entity: string) => { fieldName: string; arguments: unknown }[]
}) =>
  cache
    .inspectFields('Query')
    .filter((field) => field.fieldName === 'workspaceMembers' && field.arguments)
    .map((field) => field.arguments as WorkspaceMembersQueryVariables)

export const cacheUpdates: CacheExchangeOpts['updates'] = {
  Mutation: {
    createWorkspace: (result, _args, cache) => {
      const createdWorkspace = (result as CreateWorkspaceMutation).createWorkspace

      if (!createdWorkspace) {
        return
      }

      cache.updateQuery({ query: MyWorkspacesDocument }, (data) => {
        if (!data) {
          return data
        }

        return { ...data, myWorkspaces: [...data.myWorkspaces, createdWorkspace] }
      })
    },
    acceptWorkspaceInvitation: (result, _args, cache) => {
      const joinedWorkspace = (result as AcceptWorkspaceInvitationMutation)
        .acceptWorkspaceInvitation

      if (!joinedWorkspace) {
        return
      }

      cache.updateQuery({ query: MyWorkspacesDocument }, (data) => {
        if (!data) {
          return data
        }

        const isKnown = data.myWorkspaces.some((workspace) => workspace.id === joinedWorkspace.id)

        return {
          ...data,
          myWorkspaces: isKnown
            ? data.myWorkspaces.map((workspace) =>
                workspace.id === joinedWorkspace.id ? joinedWorkspace : workspace,
              )
            : [...data.myWorkspaces, joinedWorkspace],
        }
      })
    },
    register: (_result, _args, cache) => {
      cache.invalidate('Query', 'myWorkspaces')
    },
    removeWorkspaceMember: (result, _args, cache) => {
      const removed = (result as RemoveWorkspaceMemberMutation).removeWorkspaceMember

      if (!removed) {
        return
      }

      cache.invalidate({ __typename: 'WorkspaceMemberType', id: removed.member.id })

      memberPageVariables(cache).forEach((variables) => {
        cache.updateQuery({ query: WorkspaceMembersDocument, variables }, (data) => {
          if (!data?.workspaceMembers) {
            return data
          }

          return {
            ...data,
            workspaceMembers: {
              ...data.workspaceMembers,
              total: Math.max(0, data.workspaceMembers.total - 1),
            },
          }
        })
      })
    },
  },
}

const cacheKeys: CacheExchangeOpts['keys'] = {
  WorkspaceMemberPageType: () => null,
  WorkspaceMemberRemovalType: () => null,
  WorkspaceJoinPreviewType: () => null,
  InviteResultType: () => null,
  AuthPayload: () => null,
}

export const graphqlCacheExchange = cacheExchange({ keys: cacheKeys, updates: cacheUpdates })
