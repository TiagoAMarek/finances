# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Frontend (Next.js)

- `pnpm dev` - Start development server on port 3000
- `pnpm dev:mocked` - Start development server with MSW mocking enabled
- `pnpm dev:real` - Start development server with real API calls
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint with Next.js, TypeScript, and Prettier rules (auto-fixes issues)
- `pnpm typecheck` - Run TypeScript compiler check
- `pnpm typecheck:tests` - Run TypeScript check on test files
- `pnpm typecheck:all` - Run both main and test TypeScript checks

### Testing

- `pnpm test` - Run all tests once
- `pnpm test:watch` - Run Vitest in watch mode
- `pnpm test:ui` - Open Vitest UI for interactive testing
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm test:server` - Run server-side tests only (Node environment)
- `pnpm test:server:watch` - Watch server-side tests
- `pnpm test:client` - Run client-side tests only (jsdom environment)
- `pnpm test:client:watch` - Watch client-side tests
- `pnpm test:server:coverage` - Server tests with coverage
- `pnpm test:client:coverage` - Client tests with coverage
- `pnpm test:browser` - Run browser tests with Playwright
- `pnpm test:browser:watch` - Watch browser tests
- `pnpm test:browser:coverage` - Browser tests with coverage
- `pnpm test:browser:ui` - Open browser test UI

### Database

- `pnpm drizzle-kit generate` - Generate database migrations
- `pnpm drizzle-kit push` - Push schema changes to database
- Database schema is located at `app/api/lib/schema.ts`

## Architecture Overview

### Frontend Architecture

- **Framework**: Next.js 15 with App Router in TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components (New York style, stone base color)
- **Icons**: Lucide React
- **State Management**: TanStack Query for server state, localStorage for authentication tokens
- **Authentication**: JWT tokens stored in localStorage, handled via `fetchWithAuth` utility
- **Validation**: Zod schemas serve as single source of truth for all types and validation
- **Testing**: Vitest for unit testing with coverage support and UI mode

### Database & Backend

- **Database**: PostgreSQL with Drizzle ORM
- **API**: Next.js API routes following RESTful patterns
- **Authentication**: JWT with Bearer tokens, 24h expiration
- **Schema**: Centralized in `app/api/lib/schema.ts` with proper relations

### Key Architectural Patterns

#### Feature-Based Organization

- Features organized in `features/` directory with dedicated hooks and utilities
- Each feature exports from `features/[feature]/index.ts` for clean imports
- Hooks split into `data/` (API operations) and `ui/` (component logic) subdirectories
- Shared utilities in `features/shared/` for cross-feature functionality

#### Type Safety with Zod

- All types are inferred from Zod schemas in `lib/schemas.ts`
- API validation reuses frontend schemas via `app/api/lib/validation.ts`
- Error messages are in Portuguese (`pt-br`)

#### API Layer

- Custom `fetchWithAuth()` utility handles authentication and error responses
- Automatic 401 handling redirects to login page
- All API routes follow pattern: `/api/[resource]/route.ts` and `/api/[resource]/[id]/route.ts`

#### Component Structure

- Pages in `app/[route]/page.tsx`
- Feature-specific components in `app/[route]/_components/`
- Reusable components in `components/`
- shadcn/ui components in `components/ui/`
- Custom hooks exported from `features/` directory

#### Testing Architecture

- **Triple Environment**: Separate server (Node), client (jsdom), and browser (Playwright) test projects
- **MSW Integration**: Complete Mock Service Worker setup for API testing
- **Coverage Thresholds**: 80% coverage requirement across branches, functions, lines, statements
- **Test Organization**: Unit tests in `tests/unit/`, integration tests in `tests/integration/`, component tests in `__tests__/`, browser tests in `__tests__/browser/`
- **Authentication Mocking**: Comprehensive auth testing utilities in `__tests__/mocks/`
- **Browser Testing**: Real browser interaction tests using Playwright with screenshot capabilities

#### Data Flow

1. Forms use Zod schemas for validation
2. Feature hooks handle API operations (`features/[feature]/hooks/data/`)
3. TanStack Query manages caching and state
4. `fetchWithAuth` handles authentication and errors

### Database Schema Structure

- **users**: Basic authentication (id, name, email, hashedPassword)
- **categories**: Transaction categories with user ownership (id, name, type, color, icon, isDefault, ownerId)
- **defaultCategories**: System-wide category templates for seeding new users
- **bankAccounts**: User bank accounts with balance tracking (id, name, balance, currency, ownerId)
- **creditCards**: Credit cards with limits and current bill tracking (id, name, limit, currentBill, ownerId)
- **transactions**: All financial transactions (id, description, amount, type, date, categoryId, ownerId, accountId, creditCardId, toAccountId for transfers)

### Import Patterns

- Use `@/` alias for root imports
- Schemas imported from `@/lib/schemas`
- API utilities from `@/utils/api`
- Components use absolute imports with `@/components/`
- shadcn/ui components from `@/components/ui`
- Feature imports: `@/features/[feature]/*` with dedicated paths in tsconfig.json
- Features export from `features/[feature]/index.ts` for clean imports

### Error Handling

- Portuguese error messages throughout the application
- Zod validation errors are caught and displayed with specific messages
- API errors follow consistent format: `{ detail: "error message" }`
- 401 responses automatically clear tokens and redirect to login

### Authentication Flow

1. Login/Register via `/api/auth/[action]/route.ts`
2. JWT token stored in localStorage as `access_token`
3. `fetchWithAuth` includes Bearer token in all requests
4. Middleware can be used for route protection (configured in `middleware.ts`)

### Financial Transaction Logic

- Transactions can be linked to bank accounts OR credit cards (not both)
- Transfers require `fromAccount` and `toAccount` and create two related transactions
- Balance calculations are handled server-side
- All monetary values are stored as decimal strings for precision

### Testing Patterns

#### MSW (Mock Service Worker) Integration

- Comprehensive authentication mocking system in `__tests__/mocks/`
- Separate handlers for each API resource (`handlers/auth.ts`, `handlers/accounts.ts`, etc.)
- Mock data organized by feature (`data/auth.ts`, `data/accounts.ts`, etc.)
- Test utilities for common authentication scenarios (`utils/auth-helpers.ts`)

#### Test Environment Setup

- Server tests (`pnpm test:server`) run in Node environment for API route testing
- Client tests (`pnpm test:client`) run in jsdom environment for component testing
- Browser tests (`pnpm test:browser`) run in real Playwright browser for E2E testing
- Shared setup files configure MSW and test utilities
- Coverage reports generated separately for each environment

#### Authentication Testing

- Pre-configured user credentials for different test scenarios
- Utilities for login/logout flows and token management
- Error simulation for network and validation failures
- Protected route testing patterns with automatic token handling

#### Browser Testing Capabilities

- Real browser interactions using Playwright with Chrome
- Automated screenshot capture for visual regression testing
- Form interaction testing with real user events
- Component behavior validation in actual browser environment

### shadcn/ui Configuration

- Style: New York variant
- Base color: Stone
- CSS variables enabled
- Icons: Lucide React
- All UI components follow shadcn/ui patterns and conventions

## FormModal System

### Reusable FormModal Components

- **Location**: `features/shared/components/FormModal/`
- **Architecture**: Modular system with individual component exports (not compound)
- **Integration**: React Hook Form + Zod validation + TypeScript
- **Components**: FormModalBase, FormModalHeader, FormModalFormWithHook, FormModalActions, FormModalField
- **Features**: Automatic validation state management, escape hatches for customization, preview mode for edit modals

### Usage Pattern

```typescript
// Import individual components
import { 
  FormModalBase, 
  FormModalHeader, 
  FormModalFormWithHook, 
  FormModalField,
  FormModalActions 
} from '@/features/shared/components/FormModal'

// Standard usage with react-hook-form
<FormModalBase open={isOpen} onOpenChange={setIsOpen}>
  <FormModalHeader icon={Plus} title="Create Account" description="Add a new bank account" />
  <FormModalFormWithHook form={form} onSubmit={onSubmit}>
    <FormModalField form={form} name="name" label="Account Name" required>
      <Input placeholder="Enter account name" />
    </FormModalField>
  </FormModalFormWithHook>
  <FormModalActions form={form} onCancel={handleCancel} submitText="Create Account" isLoading={isLoading} />
</FormModalBase>
```

## Component Organization

### Feature-Based Structure

- **Features Directory**: `features/[feature-name]/`
- **Components**: `components/` - Feature-specific UI components
- **Hooks**: `hooks/` - Split into `data/` (API) and `ui/` (component logic)
- **Index Exports**: Clean imports via `features/[feature]/index.ts`

### Shared Components

- **Location**: `features/shared/components/`
- **UI Components**: Enhanced versions of shadcn/ui components with Brazilian localization
- **Business Components**: Charts, forms, and financial-specific components
- **Layout Components**: AppLayout, AppSidebar, PageHeader, etc.

## Development Practices

### Code Quality

- **Linting**: Next.js ESLint config with auto-fixing via `pnpm lint`
- **Type Checking**: Strict TypeScript with separate configs for main and test files
- **Validation**: Zod schemas with Portuguese error messages
- **Error Messages**: Centralized in `lib/validation-messages.ts`

### State Management Patterns

- **Server State**: TanStack Query with feature-specific hooks
- **Client State**: React state and localStorage for auth tokens
- **Form State**: React Hook Form with Zod resolvers
- **Global State**: Minimal - prefer server state and prop drilling

### API Integration

- **Authentication**: `fetchWithAuth()` utility with automatic token handling
- **Error Handling**: Consistent error format with Portuguese messages
- **Validation**: Shared Zod schemas between frontend and backend
- **Route Pattern**: RESTful `/api/[resource]/` and `/api/[resource]/[id]/`

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
- always try to search on the web how to test shadcn components
- always try to use regex to query for elements when writing tests