import { cacheExchange } from '@urql/exchange-graphcache'
import type { CacheExchangeOpts } from '@urql/exchange-graphcache'

import type { CreateWorkspaceMutation, UpdateWorkspaceMutation } from '~/shared/api/graphql'

import { MyWorkspacesDocument } from './documents'

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
    updateWorkspace: (result, _args, cache) => {
      const updatedWorkspace = (result as UpdateWorkspaceMutation).updateWorkspace

      if (!updatedWorkspace) {
        return
      }

      cache.updateQuery({ query: MyWorkspacesDocument }, (data) => {
        if (!data) {
          return data
        }

        return {
          ...data,
          myWorkspaces: data.myWorkspaces.map((workspace) =>
            workspace.id === updatedWorkspace.id
              ? {
                  ...workspace,
                  name: updatedWorkspace.name,
                  slug: updatedWorkspace.slug,
                }
              : workspace,
          ),
        }
      })
    },
  },
}

export const graphqlCacheExchange = cacheExchange({ updates: cacheUpdates })
