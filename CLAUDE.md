# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Frontend (Next.js)

- `pnpm dev` - Start development server on port 3000
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint with Next.js, TypeScript, and Prettier rules
- `pnpm typecheck` - Run TypeScript compiler check
- `pnpm test` - Run Vitest tests
- `pnpm test:watch` - Run Vitest in watch mode
- `pnpm test:coverage` - Run tests with coverage report

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
- Reusable components in `components/`
- shadcn/ui components in `components/ui/`
- Custom hooks for API operations in `hooks/`

#### Data Flow

1. Forms use Zod schemas for validation
2. Custom hooks (`useAccounts`, `useTransactions`, etc.) handle API calls
3. TanStack Query manages caching and state
4. `fetchWithAuth` handles authentication and errors

### Database Schema Structure

- **users**: Basic authentication (id, email, hashedPassword)
- **bankAccounts**: User bank accounts with balance tracking
- **creditCards**: Credit cards with limits and current bill tracking
- **transactions**: All financial transactions (income, expense, transfer) with references to accounts/cards

### Import Patterns

- Use `@/` alias for root imports
- Schemas imported from `@/lib/schemas`
- API utilities from `@/utils/api`
- Components use absolute imports with `@/components/`
- shadcn/ui components from `@/components/ui`

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

### shadcn/ui Configuration

- Style: New York variant
- Base color: Stone
- CSS variables enabled
- Icons: Lucide React
- All UI components follow shadcn/ui patterns and conventions
