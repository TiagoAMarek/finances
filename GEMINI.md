# Project Overview

This is a personal finance management application built with Next.js, React, and TypeScript. It allows users to track their bank accounts, credit cards, and transactions. The application uses a PostgreSQL database with Drizzle ORM for data access, and Tailwind CSS for styling.

## Key Technologies

- **Framework:** Next.js
- **Language:** TypeScript
- **UI:** React, Tailwind CSS, shadcn/ui
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Testing:** Vitest, React Testing Library
- **Linting:** ESLint
- **Package Manager:** pnpm

# Building and Running

## Prerequisites

- Node.js (v20 or later)
- pnpm
- PostgreSQL

## Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Set up your environment variables by copying `.env.example` to `.env` and filling in the required values, including your database connection string.
4.  Run database migrations:
    ```bash
    pnpm drizzle:migrate
    ```

## Running the Application

To run the development server:

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Running Tests

To run the test suite:

```bash
pnpm test
```

To run tests in watch mode:

```bash
pnpm test:watch
```

# Development Conventions

## Code Style

This project uses ESLint and Prettier to enforce a consistent code style. It is recommended to set up your editor to format on save.

## Testing

Tests are written with Vitest and React Testing Library. Test files are located in the `__tests__` directory and follow the `*.test.ts` or `*.test.tsx` naming convention.

## Database

The database schema is managed by Drizzle ORM. Schema definitions are located in `app/api/lib/schema.ts`. To create a new migration, run:

```bash
pnpm drizzle:generate
```

To apply migrations, run:

```bash
pnpm drizzle:migrate
```

## API

The backend API is built with Next.js API routes and is located in the `app/api` directory.
