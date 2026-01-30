# Security Policy

## Supported Versions

Currently, this project is in active development. We recommend always using the latest version from the `main` branch.

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < Latest| :x:                |

## Reporting a Vulnerability

We take the security of this personal finance application seriously. If you discover a security vulnerability, please follow these steps:

### How to Report

1. **DO NOT** open a public issue for security vulnerabilities
2. Send a detailed report to the repository maintainer via GitHub's private security advisory feature
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact
   - Suggested fix (if you have one)

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Updates**: We will provide regular updates on our progress
- **Resolution**: We aim to resolve critical vulnerabilities within 7 days
- **Credit**: We will credit you in the security advisory (unless you prefer to remain anonymous)

## Security Best Practices for Contributors

### Environment Variables

- **NEVER** commit `.env` files to the repository
- Use `.env.example` as a template with placeholder values only
- Store all secrets in environment variables
- Use strong, unique values for `JWT_SECRET` and `SECRET_KEY`

### Authentication

- Always use bcrypt for password hashing
- Implement proper JWT token validation
- Use HTTPS in production
- Set appropriate token expiration times

### Database Security

- Use parameterized queries (Drizzle ORM handles this)
- Enable SSL for database connections in production
- Follow principle of least privilege for database users
- Regularly backup your database

### Dependencies

- Keep dependencies up to date
- Review security advisories for all packages
- Use `pnpm audit` to check for known vulnerabilities

### API Security

- Validate all user input using Zod schemas
- Implement rate limiting for public endpoints
- Use CSRF protection for forms
- Sanitize error messages to avoid information leakage

## Known Security Considerations

### Sensitive Data Storage

This application stores financial data. Please ensure:

1. **Encryption at Rest**: Use encrypted database storage in production
2. **Encryption in Transit**: Always use HTTPS/SSL for all connections
3. **Access Control**: Implement proper user authentication and authorization
4. **Data Backup**: Maintain regular encrypted backups
5. **Audit Logging**: Consider implementing audit logs for sensitive operations

### Environment Setup

Required security-related environment variables:

```bash
# Strong random strings - generate unique values for production
JWT_SECRET=<strong-random-string>
SECRET_KEY=<strong-random-string>

# Database with SSL enabled
DATABASE_URL=postgresql://user:pass@host:port/db?sslmode=require
```

### Production Deployment

When deploying to production:

1. ✅ Use strong, randomly generated secrets
2. ✅ Enable database SSL connections
3. ✅ Set up HTTPS/TLS certificates
4. ✅ Configure CORS appropriately
5. ✅ Implement rate limiting
6. ✅ Enable security headers
7. ✅ Set up monitoring and alerting
8. ✅ Regular security updates

## Security Features Implemented

- ✅ **Authentication**: JWT-based authentication with secure tokens
- ✅ **Password Security**: Bcrypt password hashing with salt
- ✅ **Input Validation**: Zod schemas for all user input
- ✅ **SQL Injection Protection**: Drizzle ORM with parameterized queries
- ✅ **Environment Variables**: Secrets stored in environment variables
- ✅ **Type Safety**: TypeScript for type-safe code
- ✅ **Error Handling**: Portuguese error messages without sensitive details

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Documentation](https://nextjs.org/docs/app/building-your-application/authentication)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

## Responsible Disclosure

We believe in responsible disclosure. If you discover a vulnerability:

1. Give us reasonable time to fix the issue before public disclosure
2. Make a good faith effort to avoid privacy violations and data destruction
3. Do not exploit the vulnerability beyond what is necessary to demonstrate it

Thank you for helping keep this project and its users safe!
