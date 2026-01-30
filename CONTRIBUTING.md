# Contributing to Personal Finance Manager

Thank you for your interest in contributing to this personal finance management application! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Security](#security)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of background or identity.

### Our Standards

- Be respectful and considerate
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Accept responsibility for mistakes
- Show empathy towards others

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/finances.git
   cd finances
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/TiagoAMarek/finances.git
   ```

## Development Setup

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Git

### Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database credentials
   ```

3. Set up the database:
   ```bash
   pnpm drizzle-kit generate:pg
   pnpm drizzle-kit push:pg
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

### Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint with auto-fix
- `pnpm typecheck` - Run TypeScript compiler check
- `pnpm test` - Run all tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report

## How to Contribute

### Reporting Bugs

Before creating a bug report:
1. Check if the bug has already been reported
2. Verify you're using the latest version
3. Collect relevant information (browser, OS, steps to reproduce)

When creating a bug report, include:
- Clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details

### Suggesting Features

Feature suggestions are welcome! Please:
1. Check if the feature has already been suggested
2. Provide a clear use case
3. Explain how it benefits users
4. Consider implementation complexity

### Code Contributions

1. **Find an issue** to work on or create one
2. **Comment on the issue** to let others know you're working on it
3. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** following our coding standards
5. **Test your changes** thoroughly
6. **Commit your changes** following our commit guidelines
7. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Create a Pull Request** on GitHub

## Coding Standards

### TypeScript

- **Never use `any`** - always use explicit types
- Derive types from Zod schemas when possible
- Use strict TypeScript configuration
- Prefer interfaces for object types
- Use type inference where appropriate

### React/Next.js

- Use functional components with hooks
- Prefer Server Components by default
- Only add `'use client'` when necessary
- Use shadcn/ui components from `@/components/ui`
- Follow Next.js 15 App Router conventions

### File Organization

- Pages: `app/[route]/page.tsx`
- Page components: `app/[route]/_components/`
- API routes: `app/api/[resource]/route.ts`
- Features: `features/[feature-name]/`
- Shared components: `features/shared/components/`

### Naming Conventions

- **camelCase**: variables, functions
- **PascalCase**: React components, types, interfaces
- **UPPER_SNAKE_CASE**: constants

### Imports

- Use `@/` alias for project root
- Group imports: external → aliased → relative
- Sort imports logically

Example:
```typescript
// External packages
import { useState } from 'react';
import { z } from 'zod';

// Project imports with @/ alias
import { Button } from '@/components/ui/button';
import { TransactionSchema } from '@/lib/schemas';

// Relative imports
import { TransactionForm } from './TransactionForm';
```

### Styling

- Use Tailwind CSS for styling
- Follow shadcn/ui patterns (New York style, stone base color)
- Use Lucide React for icons
- Maintain responsive design (mobile-first)

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic changes)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```
feat(transactions): add transaction filtering by category

Implemented a dropdown filter that allows users to filter
transactions by category on the transactions page.

Closes #123
```

```
fix(auth): resolve JWT token expiration handling

Fixed an issue where expired tokens were not being properly
cleared from localStorage, causing authentication errors.
```

## Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Ensure all tests pass**: `pnpm test`
4. **Run linter**: `pnpm lint`
5. **Run type checker**: `pnpm typecheck`
6. **Update CHANGELOG.md** if applicable
7. **Request review** from maintainers

### Pull Request Checklist

- [ ] Code follows project coding standards
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Commits follow commit message guidelines
- [ ] PR description explains what and why

## Testing Requirements

### Test Coverage

- Aim for 80%+ code coverage
- Write unit tests for utilities and hooks
- Write integration tests for API routes
- Write component tests for UI components
- Use MSW for API mocking

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test suites
pnpm test:server    # Server-side tests
pnpm test:client    # Client-side tests
pnpm test:browser   # Browser tests with Playwright
```

### Writing Tests

- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Test edge cases and error conditions
- Use MSW for mocking API calls
- Keep tests focused and isolated

Example:
```typescript
import { describe, it, expect } from 'vitest';

describe('TransactionForm', () => {
  it('should validate required fields', async () => {
    // Arrange
    const { getByRole, getByText } = render(<TransactionForm />);
    
    // Act
    const submitButton = getByRole('button', { name: /submit/i });
    submitButton.click();
    
    // Assert
    expect(getByText(/campo obrigatório/i)).toBeInTheDocument();
  });
});
```

## Security

### Reporting Security Issues

Please refer to [SECURITY.md](SECURITY.md) for our security policy and how to report vulnerabilities.

### Security Best Practices

- **Never commit secrets** - use environment variables
- **Validate all input** - use Zod schemas
- **Sanitize user data** - prevent XSS attacks
- **Use parameterized queries** - prevent SQL injection
- **Hash passwords** - use bcrypt
- **Test security** - include security tests

### Environment Variables

When adding new environment variables:
1. Add to `.env.example` with placeholder value
2. Document in README.md
3. Use in code via `process.env.VARIABLE_NAME`
4. Never commit actual values

## Questions?

If you have questions:
- Check existing issues and discussions
- Create a new issue with the `question` label
- Be clear and provide context

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes (for significant contributions)
- CHANGELOG.md

Thank you for contributing! 🎉
