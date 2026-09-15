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

- `src/modules/<name>/` holds `*.module.ts`, `*.resolver.ts`, `*.service.ts`, `*.mapper.ts`, `dto/`, `entities/`. Cross-cutting code lives in `src/common/{decorators,guards,errors,types,utils}`, infrastructure in `src/infrastructure/{prisma,redis}`, config in `src/config`.
- ESM with `nodenext`: relative imports must carry the `.js` extension (`./dto/create-workspace.input.js`), even in TypeScript sources. Cross-directory imports use the `~/` alias (`~/common/errors/coded.exception.js`), declared in `tsconfig.json` and rewritten by `tsc-alias` at build time.
- Auth: `SessionAuthGuard` and `GqlThrottlerGuard` are global (`APP_GUARD` in `src/app.module.ts`). Opt out of the session guard with `@Public()`; every writing mutation adds `@UseGuards(CsrfGuard)`, and workspace-scoped ones add `WorkspaceRoleGuard` plus `@Role(WorkspaceRole.ADMIN)` (role order: `MEMBER < ADMIN < OWNER`).
- Read the caller from `@CurrentUser()` and the active membership from `@CurrentWorkspaceMembership()`; DTOs use class-validator with the `@Trim()` / `@Normalize()` decorators.
- Errors are structured codes, never raw strings: throw `codedException(ErrorCode.X)` (`src/common/errors/coded.exception.ts`) and add the new code to the `ErrorCode` map in `src/common/errors/error-code.ts`. Those code strings are a client contract — the client maps them to user copy in `client/src/shared/api/graphql/apiError.ts`.
- Validation is enforced globally: `ValidationPipe({ whitelist: true, transform: true })` with `codedException(ErrorCode.VALIDATION_FAILED)` as the exception factory.

## GraphQL

- Code-first: resolvers/DTOs are the source of truth, and `src/schema.gql` is generated on boot (`autoSchemaFile`, `sortSchema: true`). Never hand-edit it — change the resolver and let the server rewrite it.
- Served at `/graphql` (the `api` global prefix excludes it), with GraphiQL and introspection enabled. Mutations sent over GET are rejected with 405, so POST them.
- The client's GraphQL Code Generator reads `src/schema.gql`, so after changing a resolver, DTO or entity: start the server (or build) to regenerate `src/schema.gql`, then run `bun run codegen` in `../client`.

## Pitfalls

- `prisma/schema.prisma` is the source of truth for the DB shape; `bun run db:push` applies it. `prisma/migrations/` does not exist, so `db:migrate` will create a baseline on first use.
- `src/generated/prisma/` and `dist/` are build output — never edit them by hand.
- The dev script compiles through `tsc-watch` + `tsc-alias`, so it runs `dist/main.js`, not `src/`: a fresh clone needs `bun run build` (or `bun run dev`, which builds) before `bun run start`.
- Sessions live in Redis; if Redis is down the API boots but auth fails. Stale cookies survive a `db:reset`, so log out (or clear the session store) after resetting.
- lefthook (repo root) runs `oxlint --fix` + `oxfmt` on staged files at commit and `tsc --noEmit` at push. Run `bun run lint`, `bun run format` and `bunx tsc --noEmit -p tsconfig.json` before committing.
- Commits follow conventional commits with an optional scope: `feat: …`, `feat(client): …`, `chore: …`.
