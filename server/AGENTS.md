# AGENTS.md

SiftFlow server — NestJS 12 API with a GraphQL Yoga driver (code-first schema), Prisma 7 on PostgreSQL 18, Redis-backed express-session, in `../server` of a bun workspace whose other package is the Vite client in `../client`.

## Setup

```sh
docker compose up -d          # from the repo root: postgres:18 (:5432) + redis:8 (:6379)
cp .env.example .env          # then fill DATABASE_URL, REDIS_URL, SESSION_SECRET
bun run db:push               # sync prisma/schema.prisma to the database
bun run db:generate           # generate the client into src/generated/prisma
bun run dev                   # tsc-watch -> tsc-alias -> node dist/main.js
```

`.env` is validated at boot by `validateEnv` (zod) in `src/config/env.config.ts`; a missing/invalid value aborts startup with a zod error. `SESSION_SECRET` must be at least 32 chars (`openssl rand -hex 32`). `PORT` and `ORIGIN` come from the same file — `.env.example` uses `5000` and the client origin.

## Commands

```sh
bun run dev            # watch mode, restarts on save
bun run build          # nest build && tsc-alias
bun run start          # run the built dist/main
bun run lint           # oxlint src/
bun run format         # oxfmt src/
bun run test           # vitest run (**/*.spec.ts)
bun run test:e2e       # vitest run --config ./vitest.config.e2e.ts (**/*.e2e-spec.ts)
bun run test:watch     # vitest in watch mode
bun run test:cov       # vitest run --coverage
bun run db:push        # prisma db push      (the schema workflow in use)
bun run db:reset       # prisma db push --force-reset
bun run db:migrate     # prisma migrate dev   (no migrations/ directory exists yet)
bun run db:studio      # prisma studio
```

Vitest and `@nestjs/testing` are wired (unit config `vitest.config.ts`, e2e config `vitest.config.e2e.ts`), but no `*.spec.ts` / `*.e2e-spec.ts` files exist yet: `bun run test` and `bun run test:e2e` both exit 1 with `No test files found` until you add one for your module.

## Package manager

- Use bun for all package operations: `bun install`, `bun run lint`,
  `bun run build`, `bun run test`, `bun run test:e2e`.
- Do not use npm, yarn, or pnpm.

## Code style

- Do not write code comments. No inline, JSDoc, or block comments explaining
  what the code does. Names of functions, variables, and types must carry
  the meaning instead.

## Layout and conventions

- `src/modules/<name>/` holds `*.module.ts`, `*.resolver.ts`, `*.service.ts`, `*.mapper.ts`, `dto/`, `entities/`. A domain that outgrows one flat folder splits into capabilities, each one a real Nest module wired by the domain module (`src/modules/workspace/{core,members,invitations}/`, composed in `workspace.module.ts`); domain-scoped authorization lives in that domain's `core/` (`WorkspaceRoleGuard`, `@Role`, `@CurrentWorkspaceMembership`), so `src/common/` stays domain-agnostic (`session-auth`, `csrf`, `gql-throttler`, generic decorators and errors). Cross-cutting infrastructure lives in `src/infrastructure/{prisma,redis,mail}`, config in `src/config`.
- ESM with `nodenext`: relative imports must carry the `.js` extension (`./dto/create-workspace.input.js`), even in TypeScript sources. Cross-directory imports use the `~/` alias (`~/common/errors/coded.exception.js`), declared in `tsconfig.json` and rewritten by `tsc-alias` at build time.
- Auth: `SessionAuthGuard` and `GqlThrottlerGuard` are global (`APP_GUARD` in `src/app.module.ts`). Opt out of the session guard with `@Public()`; every writing mutation adds `@UseGuards(CsrfGuard)`, and workspace-scoped ones add `WorkspaceRoleGuard` plus `@Role(WorkspaceRole.ADMIN)` (role order: `MEMBER < ADMIN < OWNER`).
- Read the caller from `@CurrentUser()` and the active membership from `@CurrentWorkspaceMembership()`; DTOs use class-validator with the `@Trim()` / `@Normalize()` decorators.
- Errors are structured codes, never raw strings: throw `codedException(ErrorCode.X)` (`src/common/errors/coded.exception.ts`) and add the new code to the `ErrorCode` map in `src/common/errors/error-code.ts`. Those code strings are a client contract — the client maps them to user copy in `client/src/shared/api/graphql/apiError.ts`.
- Validation is enforced globally: `ValidationPipe({ whitelist: true, transform: true })` with `codedException(ErrorCode.VALIDATION_FAILED)` as the exception factory.

## GraphQL

- Code-first: resolvers/DTOs are the source of truth, and `src/schema.gql` is generated on boot (`autoSchemaFile`, `sortSchema: true`). Never hand-edit it — change the resolver and let the server rewrite it.
- Served at `/graphql` (the `api` global prefix excludes it), with GraphiQL and introspection enabled. Mutations sent over GET are rejected with 405, so POST them.
- The client's GraphQL Code Generator reads `src/schema.gql`, so after changing a resolver, DTO or entity: start the server (or build) to regenerate `src/schema.gql`, then run `bun run codegen` in `../client`.
- The invite contract — the two invite kinds (email invitation vs public workspace link), link minting and revocation, acceptance, the registration binding and every error code — is documented in `docs/invite-flows.md`. Read it before touching `src/modules/workspace/invitations/`, where both kinds live.
- **Mutations are the client cache's input.** The client uses `@urql/exchange-graphcache`, which normalizes entities by `__typename:id`: a mutation that returns the entity it changed updates every rendered view of that entity with no client cache code. So deleting must return the deleted entity (at least `__typename` + `id`), and a counter that also exists as an entity field (e.g. `Workspace.membersCount`) must be returned as that entity rather than as a scalar on a wrapper.
- **One entity, one GraphQL type.** Two types describing the same row are two cache entries, and every projection then needs its own invalidation — hence `workspaceMembers` rows and `workspaceMember` details share `WorkspaceMemberType`. Client-side rules: `../client/docs/graphql-cache.md`.

## Pitfalls

- `prisma/schema.prisma` is the source of truth for the DB shape; `bun run db:push` applies it. `prisma/migrations/` does not exist, so `db:migrate` will create a baseline on first use.
- `bun run db:push` refuses a destructive or unique-index change when it cannot prompt (non-interactive shell). The workflow that works: `bunx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script` into a file, apply it with a `pg` client, then `bun run db:push` reports "already in sync". Do not reach for `--accept-data-loss` without asking.
- Prisma 7 needs a driver adapter — a bare `new PrismaClient()` throws at construction. For a one-off query, mirror `src/infrastructure/prisma/prisma.service.ts` (`new PrismaClient({ adapter: new PrismaPg(new Pool({ connectionString: process.env.DATABASE_URL })) })`) in a temp `.mjs` inside `server/` and run it with `node --env-file=.env <script>.mjs` (that is how you get `.env` values and resolve `pg`); there is no `psql` here.
- `@Field({ nullable: true })` on a field whose TypeScript type is a union (`Date | null`) aborts boot with `UndefinedTypeError: … providing an explicit type for …`. Write `@Field(() => Date, { nullable: true })`. A green `tsc` and `bun run build` prove nothing here — only starting the app proves the schema compiles.
- Throttling is global (100 req/60 s) and `register`/`login` are 5 req/60 s per IP, so a multi-user script or signup loop needs registrations spaced ~60 s apart, or it gets `TOO_MANY_REQUESTS` (which looks like a broken auth flow).
- Invitation email goes through BullMQ → Resend. Without `RESEND_API_KEY` the job fails with a clear log; with the example sender `onboarding@resend.dev` only the Resend account owner receives mail, so invites to other addresses are rejected by the provider (failures collect in the `bull:email:failed` Redis set).
- `src/generated/prisma/` and `dist/` are build output — never edit them by hand.
- The dev script compiles through `tsc-watch` + `tsc-alias`, so it runs `dist/main.js`, not `src/`: a fresh clone needs `bun run build` (or `bun run dev`, which builds) before `bun run start`.
- Sessions live in Redis; if Redis is down the API boots but auth fails. Stale cookies survive a `db:reset`, so log out (or clear the session store) after resetting.
- lefthook (repo root) runs `bunx oxlint --fix` + `bunx oxfmt` on staged files at commit and `bunx tsc --noEmit --incremental false -p tsconfig.json` at push. Run `bun run lint`, `bun run format` and `bunx tsc --noEmit -p tsconfig.json` before committing.
- Commits follow conventional commits with an optional scope: `feat: …`, `feat(client): …`, `chore: …`.
