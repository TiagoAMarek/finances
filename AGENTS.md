# AGENTS.md

## Build / Lint / Test Commands

- pnpm dev — start Next.js dev server
- pnpm build — production build
- pnpm lint — run ESLint (Next.js + TypeScript + Prettier)
- pnpm typecheck — ts compiler checks
- pnpm test — run full Vitest suite (server + client)
- pnpm test:watch — run tests in watch mode
- pnpm test:server — run server-side tests only
- pnpm test:client — run client-side (jsdom) tests only
- pnpm test:single <file> — run a single test file (example: pnpm test -- tests/unit/schemas.test.ts)
- pnpm test:coverage — run tests with coverage report
- pnpm drizzle-kit generate / push — manage DB migrations

## Code Style & Conventions

- Imports: use the `@/` alias for project root (components, features, lib, utils). Keep imports grouped: external, aliased, relative.
- Formatting: follow Prettier rules via ESLint; run `pnpm lint --fix` to auto-fix style issues.
- Types: derive types from Zod schemas in `@/lib/schemas`; avoid duplicating types manually.
- Naming: camelCase for variables/functions, PascalCase for React components and types/interfaces, UPPER_SNAKE for env constants.
- Components: prefer shadcn/ui from `@/components/ui`; keep small presentational components under `components/` and feature components under `app/` or `features/`.
- API: use `fetchWithAuth()` from `@/utils/api` for authenticated requests; handle 401 centrally.
- Validation & Errors: Zod schemas are the source of truth. Error messages must be in Portuguese (pt-BR) and user-friendly.
- Data: store decimals as strings and dates as ISO strings in DB and APIs.
- Authentication: JWT tokens live in localStorage; use built-in automatic 401 handling in auth helpers.
- File layout: Next app routes under `app/<route>/page.tsx`, api routes under `app/api/<resource>/route.ts`.
- Testing: Vitest with separate environments (server/node and client/jsdom). Use mocks in `mocks/` and MSW setup in `src/mocks`.

## Repo Assistant Rules

- Check for .cursor/rules or .cursorrules and respect cursor rules if present.
- Follow any GitHub Copilot instructions in `.github/copilot-instructions.md` if present.

Keep this file short and actionable for autonomous agents. Update when new CLI scripts or tooling are added.
