# Updating the GraphQL cache after a mutation

How to make a mutation result show up in already-rendered data **without refetching the query**.

## Why the default cache cannot do this

urql's stock `cacheExchange` is a _document_ cache: a result is stored under the document text +
variables pair, and there is no API to reach inside a stored result and patch one list. The only
way to see new server data was another request (`requestPolicy: 'network-only'`,
`'cache-and-network'`, or re-executing the loader) — one wasted round trip per mutation.

## What we use instead

`@urql/exchange-graphcache` — a _normalized_ cache. Entities are stored by `__typename:id`
(`WorkspaceType:01M2…`), and every mutation can declare an `updates` handler that edits the cache
directly. Nothing goes over the network.

Wiring in this repo:

- `src/shared/api/graphql/client.ts` — `exchanges: [graphqlCacheExchange, fetchExchange]`
- `src/shared/api/graphql/cache.ts` — the `updates` map, one entry per mutation
- `src/shared/api/graphql/documents.ts` — documents the cache layer patches

## Recipe 1 — append a created entity to a cached list

```ts
// src/shared/api/graphql/cache.ts
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
}
```

## Recipe 2 — entity field changes need no handler at all

A mutation result containing an entity writes that entity into the cache. Every already-rendered view
of it — a list row, a drawer, a switcher item — reads the same normalized record, so it updates with
no handler: renaming a workspace, changing a member's role, cancelling or resending an invitation.
That makes "does the UI update itself?" a **server contract question, not a cache question**: as long
as the mutation returns the entity with its `id`, nothing is written in `cache.ts`.

Handlers exist for the two things the cache cannot derive:

- **list membership** — a created entity must be appended, a removed one must leave every cached page;
- **scalars that are not fields of an entity**, e.g. `WorkspaceMemberPageType.total`.

## Recipe 3 — remove an entity from every cached list

`cache.invalidate` drops the entity *and every reference to it*, so one call removes it from every
cached page variant whatever the filters were. It only works when the mutation hands the entity back —
which is why `removeWorkspaceMember` returns `{ member, workspace }`:

```ts
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
}
```

Only the page `total` is written by hand — it is a scalar on an envelope type and the cache never
recomputes it. `Workspace.membersCount` is a field of an entity, so it needs no code: the mutation
returns the workspace and the cache writes it.

Three rules follow, and they apply to every new mutation:

- deleting something must return the deleted entity (at least `__typename` + `id`), or nothing can
  invalidate it;
- changing a count that also exists as an entity field must return that entity;
- one entity must be one GraphQL type: a member returned as `WorkspaceMemberType` in the list and as
  another type in a drawer is **two** cache entities, so each projection needs its own invalidation
  (this is why member details and member rows share `WorkspaceMemberType`).

## Recipe 4 — when a refetch genuinely is the right answer

Derived or bulk server-side changes cannot be reproduced locally. Mark the field stale and let the
active query refetch:

```ts
cache.invalidate('Query', 'myWorkspaces')
```

Note this behaves differently per policy: a query read with `requestPolicy: 'cache-only'`
(our workspace switcher) never refetches, so invalidating leaves it stale — pair `invalidate`
with a policy that can fetch, or accept the next natural fetch.

## Checklist for a new mutation that touches cached data

1. **Select the whole list-item shape.** If the list renders `membersCount` and the mutation only
   returns `id`, the appended entity is partial and the UI shows `undefined members`. The workspace-form
   documents (`CreateWorkspaceDocument`, `UpdateWorkspaceDocument`) therefore select
   `id name slug membersCount role createdAt` — the same fields as `MyWorkspaces`.
2. **Add an updater only for structural changes** — a created entity appended to a list, a removed one
   leaving it, or a scalar on an envelope type. Entity field changes (a rename, a role change) need
   none: the mutation result writes the entity itself. Check what the mutation returns before writing
   an updater, and if it returns nothing usable, fix the contract on the server instead.
3. **Keep the document inside `shared/api/graphql`.** A document used by `cache.ts` must not live
   in another segment (e.g. `shared/api/workspace`), because that other segment imports the
   `~/shared/api/graphql` index and the dependency becomes a cycle:
   `index → client → cache → otherSegment → index`. The generated `gql.ts` then evaluates after a
   consumer already called `graphql()`, and you get
   `ReferenceError: Cannot access 'documents' before initialization` on every page load.
4. **Do not replace the cache write with an explicit refetch call.** If a page needs fresher data
   than the cache holds, that is the loader's `network-only` policy talking, not the mutation's job.
5. **Verify that no request was added.** In DevTools → Network, filter `graphql` and count
   `MyWorkspaces` before and after the mutation: the count must not grow. From the page you can do
   the same with
   `performance.getEntriesByType('resource').filter((entry) => entry.name.includes('operationName=MyWorkspaces')).length`.

## Recipe 5 — an envelope type needs a `keys` entry, not an `id`

A field that returns an "envelope" — a page wrapper, a mutation result, a preview payload — has no `id`,
and the normalized cache complains in DevTools:

```
Invalid key: The GraphQL query at the field at `Query.workspaceMembers({...})` has a selection set,
but no key could be generated for the data at this field. … create a `keys` config for
`WorkspaceMemberPageType`.
```

The wrapper is not an entity: it belongs to the field that returned it (which is already keyed by its
arguments). Say so explicitly in `src/shared/api/graphql/cache.ts` — the exchange takes a `keys` map
next to `updates`:

```ts
const cacheKeys: CacheExchangeOpts['keys'] = {
  WorkspaceMemberPageType: () => null,
  WorkspaceMemberRemovalType: () => null,
  WorkspaceJoinPreviewType: () => null,
  InviteResultType: () => null,
  AuthPayload: () => null,
}

export const graphqlCacheExchange = cacheExchange({ keys: cacheKeys, updates: cacheUpdates })
```

`null` means "embed me on the parent", which is what the cache does anyway when it cannot build a key —
the entry silences the warning and makes the intent reviewable. Add one line per envelope type whenever a
new one appears; the rule is "no `id` in the selection set ⇒ `keys: () => null`". The `members` inside a
page wrapper keep their own `id` and are still normalized as entities.

## Reading policies in this project

| Consumer                                            | Policy         | Why                                                                                                                      |
| --------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Guard loader (`pages/_authenticated.tsx`)           | `network-only` | The session's real workspace list is the source of truth on every navigation into the area.                              |
| Workspace switcher (`widgets/authenticated-layout`) | `cache-only`   | It must render exactly what the cache holds — mutations update it explicitly, and the loader refreshes it on navigation. |
| Slug availability check                             | `network-only` | It is a live uniqueness question about a value being typed right now.                                                    |
