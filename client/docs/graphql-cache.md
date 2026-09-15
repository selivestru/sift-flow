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

## Recipe 2 — patch an entity already in a cached list

```ts
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
          ? { ...workspace, name: updatedWorkspace.name, slug: updatedWorkspace.slug }
          : workspace,
      ),
    }
  })
}
```

Merge only the fields the mutation actually changes, and spread the rest (`...workspace`) so
counters and roles the list shows stay intact.

## Recipe 3 — when a refetch genuinely is the right answer

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
   returns `id`, the appended entity is partial and the UI shows `undefined members`. Our
   `CreateWorkspaceDocument`/`UpdateWorkspaceDocument` therefore select
   `id name slug membersCount role createdAt` — the same fields as `MyWorkspaces`.
2. **Add an updater** in `cacheUpdates.Mutation` in `src/shared/api/graphql/cache.ts`.
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

## Reading policies in this project

| Consumer                                            | Policy         | Why                                                                                                                      |
| --------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Guard loader (`pages/_authenticated.tsx`)           | `network-only` | The session's real workspace list is the source of truth on every navigation into the area.                              |
| Workspace switcher (`widgets/authenticated-layout`) | `cache-only`   | It must render exactly what the cache holds — mutations update it explicitly, and the loader refreshes it on navigation. |
| Slug availability check                             | `network-only` | It is a live uniqueness question about a value being typed right now.                                                    |
