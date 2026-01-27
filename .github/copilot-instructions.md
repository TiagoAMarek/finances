# GitHub Copilot Instructions

## Project Overview

This is a personal finance management application built with Next.js, React, and TypeScript. It allows users to track bank accounts, credit cards, and transactions with a PostgreSQL database.

## Technology Stack

- **Framework**: Next.js 15 with App Router in TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components (New York style, stone base color)
- **Icons**: Lucide React
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: TanStack Query for server state, localStorage for auth tokens
- **Authentication**: JWT tokens with Bearer auth
- **Validation**: Zod schemas for all types and validation
- **Testing**: Vitest with triple environment (server/Node, client/jsdom, browser/Playwright)
- **API Mocking**: Mock Service Worker (MSW)

## Build, Lint & Test Commands

### Development
- `pnpm dev` - Start Next.js dev server on port 3000
- `pnpm dev:mocked` - Start dev server with MSW mocking (NEXT_PUBLIC_USE_MOCKS=true)
- `pnpm dev:real` - Start dev server with real API calls
- `pnpm build` - Production build
- `pnpm start` - Start production server

### Code Quality
- `pnpm lint` - Run ESLint (Next.js + TypeScript + Prettier); includes auto-fix
- `pnpm typecheck` - TypeScript compiler check
- `pnpm typecheck:tests` - TypeScript check on test files
- `pnpm typecheck:all` - Both main and test TypeScript checks

### Testing
- `pnpm test` - Run full Vitest suite (server + client)
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:ui` - Open Vitest UI
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm test:server` - Server-side tests only (Node environment)
- `pnpm test:client` - Client-side tests only (jsdom environment)
- `pnpm test:browser` - Browser tests with Playwright
- `pnpm test <file>` - Run a single test file

### Database
- `pnpm drizzle-kit generate` - Generate database migrations
- `pnpm drizzle-kit push` - Push schema changes to database
- Database schema: `app/api/lib/schema.ts`

## Tooling & Configuration

### Next.js 15 Configuration
- **Version**: Currently using Next.js 15.4.11
- **Turbopack**: Available in experimental mode (stable in Next.js 16+)
- **Typed Routes**: Enable via `typedRoutes` in `next.config.*` (requires TypeScript)
- **ESLint**: Use `next lint` or ESLint CLI directly

### Environment Variables
- Store secrets in `.env.local` - never commit to version control
- `NEXT_PUBLIC_` variables are inlined at build time (changing after build won't affect deployed build)
- For runtime evaluation, follow Next.js guidance (e.g., call `connection()` before reading `process.env`)

## Code Style & Conventions

### Imports
- Use `@/` alias for project root
- Group imports: external, aliased, relative
- Schemas from `@/lib/schemas`
- API utilities from `@/utils/api`
- Components from `@/components/` or `@/components/ui`
- Features: `@/features/[feature]/*`

### Naming Conventions
- **camelCase**: variables, functions
- **PascalCase**: React components, types, interfaces
- **UPPER_SNAKE_CASE**: environment constants

### File Structure
- Pages: `app/[route]/page.tsx`
- Page components: `app/[route]/_components/`
- API routes: `app/api/[resource]/route.ts` and `app/api/[resource]/[id]/route.ts`
- Features: `features/[feature-name]/`
- Shared components: `features/shared/components/`
- shadcn/ui: `components/ui/`

### React Components
- Prefer functional components with hooks over class components
- Use shadcn/ui components from `@/components/ui`
- Feature components in `features/[feature]/components/`
- Each feature exports from `features/[feature]/index.ts`

## TypeScript & Validation

### Type Safety Rules
- **Never use `any`** - always use explicit types
- Derive all types from Zod schemas in `@/lib/schemas`
- Avoid manual type duplication
- Validation schemas are the single source of truth

### Zod Schemas
- All validation uses Zod schemas
- Error messages in Portuguese (pt-BR) from `@/lib/validation-messages.ts`
- API validation reuses frontend schemas via `app/api/lib/validation.ts`
- Forms use Zod with React Hook Form via `@hookform/resolvers/zod`

## API & Authentication

### API Patterns
- All authenticated requests use `fetchWithAuth()` from `@/utils/api`
- 401 responses automatically clear tokens and redirect to login
- Error format: `{ detail: "error message" }` (Portuguese)
- RESTful patterns: `/api/[resource]/` and `/api/[resource]/[id]/`

### Route Handlers (API Routes)
- Location: `app/api/` directory
- HTTP Methods: Export async functions named after HTTP verbs (`GET`, `POST`, etc.)
- Use Web `Request` and `Response` APIs, or `NextRequest`/`NextResponse` for advanced features
- **Performance**: Don't call your own Route Handlers from Server Components - extract shared logic into `lib/` modules and call directly to avoid extra server hops
- Dynamic segments: Use `[param]` for dynamic routes (e.g., `app/api/users/[id]/route.ts`)
- Always validate input with Zod schemas
- Return appropriate HTTP status codes and error messages

### Authentication Flow
1. Login/Register via `/api/auth/[action]/route.ts`
2. JWT token stored in localStorage as `access_token`
3. `fetchWithAuth` includes Bearer token in all requests
4. Route protection via `middleware.ts`

### Data Handling
- Monetary values: decimal strings (never use floats for money)
- Dates: ISO strings in DB/APIs
- JWT expiration: 24h

## Testing Practices

### Test Organization
- Unit tests: `tests/unit/`
- Integration tests: `tests/integration/`
- Component tests: `__tests__/`
- Browser tests: `__tests__/browser/`
- Mocks: `__tests__/mocks/`

### Testing Requirements
- 80% coverage threshold (branches, functions, lines, statements)
- Server tests in Node environment (`pnpm test:server`)
- Client tests in jsdom environment (`pnpm test:client`)
- Browser tests with Playwright (`pnpm test:browser`)

### MSW Integration
- Comprehensive authentication mocking in `__tests__/mocks/`
- Handlers per resource: `handlers/auth.ts`, `handlers/accounts.ts`, etc.
- Mock data by feature: `data/auth.ts`, `data/accounts.ts`, etc.
- Test utilities: `utils/auth-helpers.ts`

### Testing shadcn Components
- Always search the web for best practices on testing shadcn components
- Use regex to query for elements when writing tests

## Database Schema

- **users**: id, name, email, hashedPassword
- **categories**: id, name, type, color, icon, isDefault, ownerId
- **defaultCategories**: System-wide category templates
- **bankAccounts**: id, name, balance, currency, ownerId
- **creditCards**: id, name, limit, currentBill, ownerId
- **transactions**: id, description, amount, type, date, categoryId, ownerId, accountId, creditCardId, toAccountId

### Database Rules
- Schema centralized in `app/api/lib/schema.ts`
- Transactions link to bank accounts OR credit cards (not both)
- Transfers require `fromAccount` and `toAccount`
- Balance calculations are server-side

## Feature-Based Architecture

### Feature Organization
- Features in `features/[feature-name]/` directory
- Components: `features/[feature]/components/`
- Hooks split into:
  - `hooks/data/` - API operations
  - `hooks/ui/` - Component logic
- Each feature exports from `features/[feature]/index.ts`

### Shared Utilities
- Cross-feature functionality: `features/shared/`
- Enhanced UI components: `features/shared/components/`
- Brazilian localization for shadcn/ui components

## State Management

- **Server State**: TanStack Query with feature-specific hooks
- **Client State**: React state and localStorage for auth tokens
- **Form State**: React Hook Form with Zod resolvers
- **Global State**: Minimal - prefer server state and prop drilling

## Server & Client Component Integration

### Critical Rules
- **Never use `next/dynamic` with `{ ssr: false }` inside a Server Component** - This is not supported and will cause errors
- **Correct approach**: Move all client-only logic into a dedicated Client Component (with `'use client'` at top) and import it directly
- **Server Components cannot use client-only features** or dynamic imports with SSR disabled
- **Client Components can be rendered inside Server Components**, but not the other way around

### Example
```tsx
// Server Component
import DashboardNavbar from "@/components/DashboardNavbar";

export default async function DashboardPage() {
  // ...server logic...
  return (
    <>
      <DashboardNavbar /> {/* This is a Client Component */}
      {/* ...rest of server-rendered page... */}
    </>
  );
}
```

## Next.js 15 Async Request APIs

- **Request-bound data is async**: In Next.js 15, `cookies()`, `headers()`, and `draftMode()` return Promises and must be awaited
- **Route props are Promises**: `params` and `searchParams` are Promises in Server Components - always `await` them
- **Breaking change from Next.js 14**: These APIs were synchronous in v14, now async in v15
- **Avoid accidental dynamic rendering**: Accessing request data opts the route into dynamic behavior - read them intentionally and isolate behind `Suspense` boundaries when appropriate

### Migration Pattern
```tsx
// Next.js 14 (old - synchronous)
export default function Page({ params }) {
  const { id } = params; // ❌ No longer works in v15
}

// Next.js 15 (current - asynchronous)
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // ✅ Correct
}
```

## Caching & Revalidation

### Next.js 15 Approach
- Use `fetch()` with caching options for data fetching
- Use `revalidatePath()` and `revalidateTag()` for cache invalidation
- Server Actions for mutations with automatic revalidation
- `unstable_cache` for function-level caching (use sparingly)

### Future: Next.js 16 Cache Components (Not Yet Available)
- Next.js 16 introduces **Cache Components** with `use cache` directive
- Opt-in, explicit caching model replacing complex heuristics
- When upgrading to v16, consider migration to Cache Components pattern
- Features: `cacheTag()`, `cacheLife()`, `updateTag()` for granular control

## Performance Best Practices

- **Images**: Use `next/image` for automatic optimization
- **Fonts**: Use `next/font` for font optimization
- **Route prefetching**: Leverage automatic prefetching
- **Code splitting**: Keep most logic in Server Components to reduce client bundle
- **Suspense**: Use Suspense and loading states for async data
- **Route Handlers**: Don't call your own Route Handlers from Server Components - extract shared logic into `lib/` and call directly

## Security Best Practices

- **Input validation**: Always validate and sanitize user input using Zod schemas
- **Authentication**: Protect sensitive routes using middleware or server-side session checks
- **Authorization**: Always perform server-side authorization for Server Actions and Route Handlers - never trust client input
- **HTTPS**: Use HTTPS in production
- **HTTP Headers**: Set secure HTTP headers
- **Secrets**: Store in `.env.local` and never commit to version control
- **CSRF Protection**: Implement CSRF protection for forms
- **Rate Limiting**: Implement rate limiting for API routes

## Accessibility Best Practices

- **Semantic HTML**: Use proper HTML elements for their intended purpose
- **ARIA Attributes**: Add ARIA attributes where needed for screen readers
- **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
- **Focus Management**: Handle focus states properly in modals and dynamic content
- **Testing**: Test with screen readers and keyboard-only navigation

## Best Practices

### Do's
- Use existing libraries whenever possible
- Run `pnpm lint --fix` before committing
- Run `pnpm typecheck` to catch type errors
- Write unit tests for new functionality
- Document public functions with JSDoc
- Use feature-specific hooks from `features/[feature]/hooks/`
- Follow RESTful API patterns
- Handle errors in Portuguese
- Use Server Components by default - only add `'use client'` when needed
- Implement proper error boundaries for client components
- Use optimistic updates where appropriate for better UX
- Write responsive designs with Tailwind CSS
- Follow semantic HTML structure

### Don'ts
- Never use `any` in TypeScript
- Don't use floats for monetary values (use decimal strings)
- Don't add new libraries unless absolutely necessary
- Don't duplicate type definitions (derive from Zod)
- Don't skip validation on API endpoints
- Don't store sensitive data in localStorage except auth tokens
- Don't introduce breaking changes to exported APIs
- Don't create files unless absolutely necessary
- Don't proactively create documentation files or example/demo files
- Don't use `next/dynamic` with `{ ssr: false }` in Server Components
- Don't call your own Route Handlers from Server Components

## FormModal System

### Location & Components
- **Path**: `features/shared/components/FormModal/`
- **Components**: FormModalBase, FormModalHeader, FormModalFormWithHook, FormModalActions, FormModalField
- **Integration**: React Hook Form + Zod validation

### Usage Pattern
```typescript
import { 
  FormModalBase, 
  FormModalHeader, 
  FormModalFormWithHook, 
  FormModalField,
  FormModalActions 
} from '@/features/shared/components/FormModal'

<FormModalBase open={isOpen} onOpenChange={setIsOpen}>
  <FormModalHeader icon={Plus} title="Title" description="Description" />
  <FormModalFormWithHook form={form} onSubmit={onSubmit}>
    <FormModalField form={form} name="fieldName" label="Label" required>
      <Input placeholder="Enter value" />
    </FormModalField>
  </FormModalFormWithHook>
  <FormModalActions form={form} onCancel={handleCancel} submitText="Submit" />
</FormModalBase>
```

## Error Messages

- All error messages in Portuguese (pt-BR)
- Zod validation errors from `@/lib/validation-messages.ts`
- API errors follow format: `{ detail: "error message" }`
- 401 responses clear tokens and redirect to login

## Code Quality Requirements

- ESLint with Next.js, TypeScript, and Prettier rules
- Prettier for automatic formatting
- Strict TypeScript configuration
- 80% test coverage
- All commits must pass linting and type checking
