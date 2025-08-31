# AGENTS.md

## Build / Lint / Test Commands

- pnpm dev — start Next.js dev server
- pnpm dev:mocked — start dev server with mocked APIs (NEXT_PUBLIC_USE_MOCKS=true)
- pnpm dev:real — start dev server with real APIs (NEXT_PUBLIC_USE_MOCKS=false)
- pnpm build — production build
- pnpm start — start production server
- pnpm lint — run ESLint (Next.js + TypeScript + Prettier); use --fix to auto-fix
- pnpm typecheck — ts compiler checks (use typecheck:all for both app + tests)
- pnpm test — run full Vitest suite (server + client)
- pnpm test:watch — run tests in watch mode
- pnpm test:ui — run tests with UI
- pnpm test:server — run server-side tests only
- pnpm test:client — run client-side (jsdom) tests only
- pnpm test:browser — run browser tests with Playwright
- pnpm test <file> — run a single test file (example: pnpm test __tests__/unit/schemas.test.ts)
- pnpm test:coverage — run tests with coverage report
- pnpm drizzle-kit generate / push — manage DB migrations

## Code Style & Conventions

- Imports: use `@/` alias for project root; group: external, aliased, relative
- Formatting: Prettier via ESLint; run `pnpm lint --fix` to auto-fix
- Types: derive from Zod schemas in `@/lib/schemas`; avoid manual duplication
- Naming: camelCase for vars/functions, PascalCase for React components/types, UPPER_SNAKE for env constants
- Components: prefer shadcn/ui from `@/components/ui`; feature components under `features/`, pages under `app/`
- API: use `fetchWithAuth()` from `@/utils/api` for authenticated requests; 401 handled centrally
- Validation: Zod schemas as source of truth; error messages in Portuguese (pt-BR) from `@/lib/validation-messages`
- Data: decimals as strings, dates as ISO strings in DB/APIs
- Authentication: JWT in localStorage; automatic 401 handling
- File layout: Next.js app router under `app/`, API routes under `app/api/`
- Testing: Vitest with environments (server/node, client/jsdom, browser/playwright); mocks in `__tests__/mocks/`

## Repo Assistant Rules

- No .cursor/rules or .cursorrules found
- No .github/copilot-instructions.md found

Keep this file short and actionable for autonomous agents. Update when new CLI scripts or tooling are added.
