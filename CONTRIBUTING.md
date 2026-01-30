# Contributing to Personal Finance Manager

Thank you for your interest in this personal finance management application!

## Open Source Project

This project is open source and licensed under the Apache License 2.0. We welcome contributions from the community!

## Copyright and License

Copyright (c) 2026 Tiago A Marek

Licensed under the Apache License, Version 2.0. See the [LICENSE](LICENSE) file for complete terms and conditions.

### What You Can Do

- ✅ View, use, and modify the source code
- ✅ Use it for personal or commercial projects
- ✅ Distribute original or modified versions
- ✅ Contribute improvements back to the project
- ✅ Fork the repository

### Contribution Requirements

When contributing, you agree that:
- Your contributions will be licensed under the Apache License 2.0
- You have the right to submit the code you're contributing
- You retain copyright to your contributions

## How to Contribute

### Reporting Issues

If you find a bug or security vulnerability:

1. **Security Issues**: Please follow the [Security Policy](SECURITY.md)
2. **Bug Reports**: Open an issue using the bug report template
3. **Feature Suggestions**: Open an issue using the feature request template

### Contributing Code

We welcome pull requests! Here's how to contribute:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Run tests** (`pnpm test`)
5. **Run linter** (`pnpm lint`)
6. **Commit your changes** (`git commit -m 'feat: add amazing feature'`)
7. **Push to your fork** (`git push origin feature/amazing-feature`)
8. **Open a Pull Request**

### Pull Request Guidelines

Please ensure your PR:
- Follows the project's coding standards
- Includes appropriate tests for new features
- Passes all linting and type checks (`pnpm lint && pnpm typecheck`)
- Has been tested locally
- Includes a clear description of the changes
- References any related issues

## Development Setup

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Environment variables configured (see `.env.example`)

### Installation

```bash
pnpm install
cp .env.example .env.local
# Edit .env.local with your database credentials
pnpm drizzle-kit generate:pg
pnpm drizzle-kit push:pg
pnpm dev
```

### Available Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint with auto-fix
- `pnpm typecheck` - Run TypeScript compiler check
- `pnpm test` - Run all tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage

## Code Style

- Follow the existing code style
- Use TypeScript for all new code
- Write tests for new features
- Keep functions small and focused
- Use meaningful variable and function names
- Add comments for complex logic

## Questions?

For questions about:
- **Licensing**: See the [LICENSE](LICENSE) file
- **Security**: See the [Security Policy](SECURITY.md)
- **Technical details**: Open an issue with the `question` tag
- **Getting started**: Check the [README](README.md)

---

**Thank you for contributing!** Your improvements help make this project better for everyone.
