# Inviting people to a workspace

How both invite kinds work end to end: minting, preview, acceptance, revocation, and what happens to a
visitor who has no account yet. Server-side contract only — the client is written against it.

## Two kinds, one table

An invitation row carries an explicit discriminator, so no query has to guess what it is looking at.

|            | `EMAIL`                         | `LINK`                                                        |
| ---------- | ------------------------------- | ------------------------------------------------------------- |
| audience   | one address (`email`)           | anyone holding the URL                                        |
| expiry     | `expiresAt` = now + 7 days      | `expiresAt = null` (until revoked)                            |
| uses       | one, burns on acceptance        | unlimited                                                     |
| role           | `role` from the invitation      | always `MEMBER` — not configurable       |
| revocation | `cancelInvitation` → `CANCELED` | `revokeWorkspaceJoinLink` → `CANCELED`, a fresh row is issued |

Shared: `token` (unique, 32 random bytes as hex — the token _is_ the link
`${ORIGIN}/invite/<token>`), `status`, `invitedById`, `workspaceId`. `Workspace` carries no join
columns at all.

### Where the code lives

- `src/modules/workspace/invitations/` — `invitation.service.ts` + `invitation.resolver.ts` (email
  invitations) and `workspace-join-link.service.ts` + `workspace-join-link.resolver.ts` (the shareable
  link and its public preview), with `dto/` and `entities/` for both
- `src/modules/workspace/core/` — `WorkspaceRoleGuard`, `@Role`, `@CurrentWorkspaceMembership`
- `src/modules/auth/` — `RegisterInput.inviteToken`, `AuthPayload.joinedWorkspaceSlug`

## Flow A — the public workspace link

1. **It already exists.** The link is created in the same write that creates the workspace:
   `createWorkspace` inserts the `LINK` row (role `MEMBER`, no address, no expiry, `invitedById` = the
   creator) alongside the owner membership, so no caller ever has to ask whether a link exists, and
   creating a workspace plus revoking a link are the only two places that write a link row. **Reading
   the current link back is not exposed in the API right now**: the `workspaceJoinLink` query was
   removed, so the only response that carries a URL is `revokeWorkspaceJoinLink`. Expose it again
   (a query, or a field on the workspace) before the members screen has to display the link.
2. **Revoke.** `revokeWorkspaceJoinLink(workspaceId: ID!)` (`ADMIN`+): every active `LINK` row of the
   workspace becomes `CANCELED`, a fresh row is created immediately, and **the fresh one is returned** —
   the client can show the new URL in the same response. The old token dies at once: it fails both
   `workspaceJoinPreview` (`WORKSPACE_JOIN_LINK_INVALID`) and acceptance (`INVITATION_NOT_FOUND`).
3. **Lobby.** `workspaceJoinPreview(token: String!): WorkspaceJoinPreviewType!` is **public** (no
   session) and returns `{ name, slug, role, kind, email }`. `kind` tells the client which invite it is;
   `email` is the invited address, used to lock the register form. No member list, no other addresses.
4. **Accept.** `acceptWorkspaceInvitation(token: String!): WorkspaceType!` (session + CSRF). If the row
   exists, is `PENDING` and is not expired, the membership is upserted — created, or revived if the
   person was removed — as a `MEMBER`; the row **stays `PENDING`**, so the link keeps working. Returns
   `{ slug, role, membersCount }`. The per-user workspace limit does not apply: joining is not creating.

A link grants `MEMBER` and nothing else. It is a public URL: whoever holds it can use it, so it must not
be able to mint admins. Elevation has two proper paths instead — a personal invitation with role
`ADMIN` (address-bound and auditable), or promoting somebody from the members list afterwards.

## Flow B — a personal email invitation

1. **Invite.** `inviteWorkspaceMember(input: { workspaceId, email, role })` (`ADMIN`+), or the batch
   `inviteWorkspaceMembers(input: { workspaceId, emails: [String!]!, role })`. The batch trims,
   lowercases and de-duplicates; each address yields `INVITED | ALREADY_MEMBER | INVALID_EMAIL` and one
   bad address does not abort the rest. An `ADMIN` cannot invite as `ADMIN`. Re-inviting the same
   address is an upsert on `(workspaceId, email)` that issues a **new token** and a new 7-day expiry.
   The email goes out through BullMQ → Resend with the `/invite/<token>` link.
2. **List.** `workspaceInvitations(workspaceId, statuses: [InvitationStatus!])` (`ADMIN`+) returns
   `EMAIL` rows only, `PENDING` by default — that is the "pending invites" tab, and link rows can never
   show up in it. `myWorkspaceInvitations` is the invitee's own view: their `PENDING` rows by address,
   with expired rows lazily marked `EXPIRED` and hidden.
3. **Resend / cancel.** `resendInvitation(invitationId, workspaceId)` extends `expiresAt` and queues the
   mail again — **the token is not rotated**. `cancelInvitation(invitationId, workspaceId)` sets
   `CANCELED` and the token dies. Both are email-only: against a `LINK` row they answer
   `INVITATION_NOT_FOUND` (links are revoked with `revokeWorkspaceJoinLink`).
4. **Lobby.** Same `workspaceJoinPreview`, now with `kind = EMAIL` and the invited `email`.
5. **Accept.** Same `acceptWorkspaceInvitation`, with two differences: the signed-in address must match
   the invited one (otherwise `INVITATION_EMAIL_MISMATCH`), and on success the row becomes `ACCEPTED` —
   it **burns**, so a second acceptance answers `INVITATION_NOT_FOUND`.
6. **Decline.** `declineWorkspaceInvitation(token: String!): Boolean!` sets `DECLINED` (`EMAIL` only;
   for a link it answers `INVITATION_NOT_FOUND`).

## Flow C — a visitor without an account

1. The client catches `/invite/<token>`, calls the public `workspaceJoinPreview` and renders "You are
   invited to X as Y", locking the address field to `email` when `kind = EMAIL`.
2. The token is carried through registration (URL or cookie) and passed as
   `register(input: { email, fullName, password, inviteToken })`. The server creates the account and
   **tries to bind**: for `EMAIL` it checks the address, for `LINK` there is nothing to check. On success
   an `EMAIL` row becomes `ACCEPTED`.
3. `AuthPayload.joinedWorkspaceSlug` is the answer. Non-empty → the client routes straight to
   `/w/<slug>`, skipping onboarding. Empty → nothing was bound (wrong address, expired, revoked) → fall
   through to the normal onboarding. This is **not an error**: account creation never fails because of a
   stale token.
4. A visitor who already has an account logs in and then calls `acceptWorkspaceInvitation` — two
   operations, since `login` deliberately takes no token.
5. `register` and `login` are throttled to 5 requests / 60 s per IP.

## Row lifecycle

```
PENDING ──accept (EMAIL)──▶ ACCEPTED     burned
        ──decline────────▶ DECLINED
        ──expiry─────────▶ EXPIRED      marked lazily on read
        ──cancel─────────▶ CANCELED     admin withdrew an email invite
        ──revoke─────────▶ CANCELED     link revoked; a fresh PENDING row is issued at once
```

Only `PENDING` is acceptable. A workspace has at most one active `LINK` row; revoked ones stay as
history, each with its own `invitedById`.

## Role on arrival

The invitation's role applies when the membership is **created or revived**. A member who is already
active keeps the role they have — accepting the link neither demotes nor promotes them, so an `ADMIN`
who clicks a `MEMBER` link stays `ADMIN`. Removal resets that: a removed member who returns through an
invite or link comes back with the role carried by that invite.

## Errors

| code                          | HTTP | when                                                     |
| ----------------------------- | ---- | -------------------------------------------------------- |
| `WORKSPACE_JOIN_LINK_INVALID` | 404  | preview: no such token, or the row is not `PENDING`      |
| `INVITATION_NOT_FOUND`        | 404  | accept: no such token, not `PENDING`, burned, or revoked |
| `INVITATION_EXPIRED`          | 410  | expiry passed (checked lazily, then marked `EXPIRED`)    |
| `INVITATION_EMAIL_MISMATCH`   | 403  | a personal invitation accepted from another address      |
| `INSUFFICIENT_WORKSPACE_ROLE` | 403  | not `ADMIN` for link/invite management                   |
| `WORKSPACE_MEMBER_EXISTS`     | 409  | inviting somebody who is already an active member        |
| `WORKSPACE_NOT_FOUND`         | 404  | an outsider touching the workspace                       |
| `INVALID_CSRF_TOKEN`          | 403  | acceptance and management need the CSRF header              |
| `NOT_AUTHENTICATED`           | 401  | acceptance and management need a session                    |
| `INTERNAL_SERVER_ERROR`       | 500  | the workspace has no active link row (broken invariant)     |

## Guardrails

- Joining never consumes the 5-workspace creation limit.
- Every workspace has exactly one active `LINK` row from the moment it is created. Creating a
  workspace and revoking a link are the only writers; a read never invents a row, so a missing link
  surfaces as `INTERNAL_SERVER_ERROR` (repair the data, do not paper over it).
- Links do not expire and always grant `MEMBER`; the only lever is revocation. Adding a TTL or a role
  choice back is a one-line change in the link service if it is ever wanted — the role option was
  deliberately removed, because a public URL must not be able to mint admins.
- `workspaceJoinPreview` is public and reveals only the workspace name/slug, the role, the kind and the
  invited address.
- The preview address is visible to anyone holding the token — i.e. the invitee and whoever the link was
  forwarded to.
- Email endpoints stay email-only: a link row answers `INVITATION_NOT_FOUND` to list/resend/cancel
  unless it is asked for by kind.
- Every failure on the registration path degrades to "not bound" instead of an error.

## Client checklist

- Route `/invite/$token` — one route for both kinds, branching on `kind` from the preview.
- Persist the token across registration (URL/cookie) and pass it as `inviteToken`.
- Already signed in → `acceptWorkspaceInvitation`; brand new → `register`, then route on
  `joinedWorkspaceSlug`.
- Members screen: get/copy the link and revoke it; pending tab with `resend` and `cancel`.
- Copy for `INVITATION_EMAIL_MISMATCH` in `apiError.ts`; drop `WORKSPACE_JOIN_LINK_DISABLED`, which no
  longer exists.
- `bun run codegen` after any schema change.

## Verified

Full matrix against a live server: 34/34. Role rule checked separately against the database — an
`ADMIN` clicking a `MEMBER` link stays `ADMIN`; a removed member returning through a link comes back as
`MEMBER` with the same membership row and an empty `removedAt`. Provisioning checked separately: the
link returned by `workspaceJoinLink` carries the same `createdAt` as the workspace itself (a read
seconds later returns that row instead of minting one), and every workspace in the database has exactly
one active link. The link role setting was removed: the mutation is gone from the schema, everybody
arriving through a link is a `MEMBER`, and revoking still issues a fresh `MEMBER` link.
