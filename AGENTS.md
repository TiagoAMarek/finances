# AGENTS.md

## Build/Lint/Test Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production  
- `pnpm lint` - Run ESLint with Next.js, TypeScript, and Prettier rules
- `pnpm drizzle-kit generate` - Generate database migrations
- `pnpm drizzle-kit push` - Push schema changes to database
- No test framework configured

## Code Style Guidelines
- **Imports**: Use `@/` alias for root imports (components, lib, utils)
- **Types**: All types inferred from Zod schemas in `@/lib/schemas` - never define types manually
- **API**: Use `fetchWithAuth()` from `@/utils/api` for all authenticated requests
- **Validation**: Zod schemas are single source of truth for validation and types
- **Error Messages**: All error messages in Portuguese (`pt-br`)
- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **Components**: shadcn/ui components from `@/components/ui`, custom in `@/components/`
- **Database**: Decimal values stored as strings, dates as ISO strings
- **Authentication**: JWT tokens in localStorage, automatic 401 handling
- **File Structure**: Pages in `app/[route]/page.tsx`, API routes in `app/api/[resource]/route.ts`