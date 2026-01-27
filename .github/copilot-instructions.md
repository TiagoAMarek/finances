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

### Don'ts
- Never use `any` in TypeScript
- Don't use floats for monetary values (use decimal strings)
- Don't add new libraries unless absolutely necessary
- Don't duplicate type definitions (derive from Zod)
- Don't skip validation on API endpoints
- Don't store sensitive data in localStorage except auth tokens
- Don't introduce breaking changes to exported APIs
- Don't create files unless absolutely necessary
- Don't proactively create documentation files

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
