# About This Repository

Thank you for your interest in this personal finance management application!

## Proprietary Notice

This is a proprietary project by Tiago A Marek. The source code is publicly viewable for educational, reference, and portfolio evaluation purposes only.

## Copyright and License

Copyright (c) 2026 Tiago A Marek. All rights reserved.

This project is **NOT open source**. All rights are reserved by the copyright holder. See the [LICENSE](LICENSE) file for complete terms and conditions.

### What You Can Do

- ✅ View the source code for learning and reference
- ✅ Study the architecture and implementation patterns
- ✅ Evaluate the code for portfolio or hiring purposes

### What You Cannot Do

- ❌ Use the code in your own projects
- ❌ Modify or create derivative works
- ❌ Distribute, copy, or share the code
- ❌ Use the code for commercial purposes
- ❌ Fork the repository for use (forks for contributions only, see below)

## Reporting Issues

If you find a bug or security vulnerability:

1. **Security Issues**: Please follow the [Security Policy](SECURITY.md)
2. **Bug Reports**: You may open an issue for informational purposes
3. **Feature Suggestions**: You may suggest features via issues

## Contributing

This project is not accepting external contributions at this time, as it is a personal portfolio project with proprietary licensing.

### For Potential Employers/Collaborators

If you're interested in discussing potential collaboration or have questions about the project:

- Open an issue with the tag `discussion`
- Contact the author through their GitHub profile

## Development Setup (For Reference)

If you want to understand how the project is set up for reference purposes:

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Environment variables configured (see `.env.example`)

### Installation (For Review Only)

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
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript compiler check
- `pnpm test` - Run all tests

## Questions?

For questions about:
- **Licensing**: See the [LICENSE](LICENSE) file
- **Security**: See the [Security Policy](SECURITY.md)
- **Technical details**: Open an issue with the `question` tag

---

**Note**: This project is maintained as a personal portfolio piece. While the code is public for viewing, it remains proprietary intellectual property.
