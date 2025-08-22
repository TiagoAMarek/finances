# Personal Finance Manager

This is a [Next.js](https://nextjs.org) project for managing personal finances, built with TypeScript, PostgreSQL, and Drizzle ORM.

## Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS, shadcn/ui
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT tokens with secure password hashing
- **Testing**: Vitest with comprehensive unit and integration tests
- **Type Safety**: Zod schemas for runtime validation and TypeScript inference

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Environment variables configured (see `.env.example`)

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up your environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your database credentials
```

3. Set up the database schema:
```bash
# Generate and apply database migrations
pnpm drizzle-kit generate:pg
pnpm drizzle-kit push:pg
```

4. Start the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Schema Management

This project uses [Drizzle ORM](https://orm.drizzle.team/) for database schema management and migrations. The schema is defined in `app/api/lib/schema.ts`.

### Updating Database Schema

When you need to modify the database structure:

#### 1. Update the Schema File

Edit `app/api/lib/schema.ts` to add/modify tables, columns, or relations:

```typescript
// Example: Adding a new column
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  // ... existing columns
  newColumn: varchar("new_column", { length: 100 }), // Add new column
});
```

#### 2. Generate Migration Files

Generate SQL migration files based on your schema changes:

```bash
pnpm drizzle-kit generate:pg
```

This creates a new migration file in the `drizzle/` directory with the SQL commands needed to update your database.

#### 3. Apply Migrations to Database

Push the schema changes to your PostgreSQL database:

```bash
pnpm drizzle-kit push:pg
```

This command:
- Applies the generated SQL migrations to your database
- Updates the database structure to match your schema
- Handles column additions, deletions, and modifications

#### 4. Update Zod Schemas (if needed)

If you modified data structures, update the corresponding Zod schemas in `lib/schemas.ts`:

```typescript
// Example: Update schema validation
export const TransactionCreateSchema = z.object({
  // ... existing fields
  newField: z.string().optional(), // Add validation for new field
});
```

### Data Migration

For complex schema changes that require data transformation:

#### 1. Check Migration Status

```bash
curl -X GET http://localhost:3000/api/admin/migrate-categories
```

#### 2. Run Data Migration

```bash
curl -X POST http://localhost:3000/api/admin/migrate-categories
```

### Best Practices

- **Always backup your database** before running migrations in production
- **Test migrations locally** before applying to production
- **Review generated SQL** in the migration files before applying
- **Use transactions** for complex data migrations
- **Maintain backward compatibility** when possible during schema changes

### Common Commands

```bash
# Check what changes would be applied
pnpm drizzle-kit generate:pg --custom

# Push changes directly (development only)
pnpm drizzle-kit push:pg

# Open Drizzle Studio for database inspection
pnpm drizzle-kit studio

# Introspect existing database
pnpm drizzle-kit introspect:pg
```

### Schema Structure

The current database includes:

- **users**: User accounts with authentication
- **categories**: Transaction categories with user ownership
- **defaultCategories**: System-wide category templates
- **bankAccounts**: User bank accounts with balance tracking
- **creditCards**: Credit card accounts with limits
- **transactions**: All financial transactions with category relationships

## Development Commands

### Frontend
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript compiler check

### Testing
- `pnpm test` - Run all tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage

### Database
- `pnpm drizzle-kit generate:pg` - Generate migrations
- `pnpm drizzle-kit push:pg` - Apply schema changes
- `pnpm drizzle-kit studio` - Open database studio

## Features

- **💰 Transaction Management**: Create, edit, and categorize income/expense transactions
- **🏦 Multi-Account Support**: Manage multiple bank accounts and credit cards
- **📊 Category System**: Organize transactions with custom categories and visual indicators
- **🔒 Secure Authentication**: JWT-based authentication with password hashing
- **📱 Responsive Design**: Mobile-first design using Tailwind CSS and shadcn/ui
- **🔄 Data Migration**: Built-in utilities for migrating and transforming data
- **✅ Type Safety**: End-to-end type safety with TypeScript and Zod validation
- **🧪 Comprehensive Testing**: Unit and integration tests with high coverage

## Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components (New York style, stone base color)  
- **State Management**: TanStack Query for server state, localStorage for auth tokens
- **Validation**: Zod schemas as single source of truth for types and validation
- **Testing**: Vitest with coverage support and UI mode

### Backend Architecture
- **Database**: PostgreSQL with Drizzle ORM
- **API**: Next.js API routes following RESTful patterns
- **Authentication**: JWT with Bearer tokens, 24h expiration
- **Schema**: Centralized in `app/api/lib/schema.ts` with proper relations
- **Error Handling**: Portuguese error messages with consistent format

### Key Patterns
- **Type Safety**: Zod schemas inferred to TypeScript types across the stack
- **API Layer**: Custom `fetchWithAuth()` utility with automatic 401 handling
- **Component Structure**: Feature-based organization with reusable UI components
- **Data Flow**: Forms → Zod validation → TanStack Query → Database via Drizzle

## Project Structure

```
app/
├── api/                    # Next.js API routes
│   ├── auth/              # Authentication endpoints
│   ├── categories/        # Category CRUD operations
│   ├── transactions/      # Transaction management
│   └── lib/               # Database schema and utilities
├── categories/            # Category management pages
├── transactions/          # Transaction pages
└── components/            # Reusable UI components
    └── ui/                # shadcn/ui components

lib/
├── schemas.ts             # Zod validation schemas
└── utils/                 # Utility functions

tests/
├── unit/                  # Unit tests
├── integration/           # Integration tests
└── helpers/               # Test utilities
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM documentation
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable component library
- [TanStack Query](https://tanstack.com/query) - Data fetching and state management
- [Zod](https://zod.dev/) - TypeScript-first schema validation

## Deployment

### Environment Variables

Required environment variables for production:

```bash
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-secret-key-here
NEXTAUTH_SECRET=your-nextauth-secret
```

### Database Setup

1. Set up a PostgreSQL database
2. Run migrations: `pnpm drizzle-kit push:pg`  
3. Optionally seed with default data via the migration API

### Deploy on Vercel

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new):

1. Connect your GitHub repository
2. Add environment variables
3. Deploy automatically on every push to main

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
