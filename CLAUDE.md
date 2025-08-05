# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend (Flask API)
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Run development server
python main.py
# Server runs on http://localhost:8000
```

### Frontend (Next.js)
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
pnpm install

# Run development server
pnpm dev
# Development server runs on http://localhost:3000

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

## Architecture Overview

This is a financial management application with a Flask backend and Next.js frontend.

### Backend Architecture
- **Framework**: Flask with SQLAlchemy ORM
- **Database**: SQLite (`financas.db`)
- **Authentication**: JWT tokens with Flask-JWT-Extended
- **Password Hashing**: bcrypt via passlib
- **CORS**: Enabled for frontend on localhost:3000

#### Core Models
- **User**: Email/password authentication, owns accounts, cards, and transactions
- **BankAccount**: Has balance, currency (default BRL), linked to transactions
- **CreditCard**: Has limit and current bill, linked to transactions
- **Transaction**: Income/expense with amount, date, category, linked to either account or credit card

#### Key Backend Patterns
- All protected routes use `@jwt_required()` decorator
- Database sessions use context manager pattern with `get_db()`
- Transaction operations automatically update account balances and credit card bills
- User identity retrieved via `get_jwt_identity()` for data isolation

### Frontend Architecture
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4 with PostCSS
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: Custom components with Radix UI primitives
- **Charts**: Chart.js with react-chartjs-2

#### Key Frontend Patterns
- All API calls use `fetchWithAuth()` utility that handles JWT tokens and 401 redirects
- React Query hooks in `useTransactions.ts` provide CRUD operations with automatic cache invalidation
- Layout includes global Navbar with navigation and logout
- Authentication token stored in localStorage, removed on 401 or logout
- TypeScript interfaces match backend models for type safety

#### API Integration
- Base URL: `http://localhost:8000`
- Authorization: Bearer token in headers
- Automatic cache invalidation on mutations (transactions invalidate accounts/cards)
- Error handling with Portuguese messages

## File Structure Notes

### Backend Key Files
- `main.py`: Main Flask application with all routes and models
- `database.py`: Database configuration (minimal, mainly duplicated in main.py)
- `requirements.txt`: Python dependencies

### Frontend Key Files
- `app/layout.tsx`: Root layout with QueryProvider and Navbar
- `hooks/useTransactions.ts`: React Query hooks for all API operations
- `utils/api.ts`: Authentication wrapper for fetch requests
- `components/Navbar.tsx`: Navigation with logout functionality
- `lib/query-provider.tsx`: TanStack Query setup

### Pages Structure
All pages are in `app/` directory using Next.js App Router:
- `dashboard/`: Main dashboard view
- `accounts/`: Bank account management
- `credit_cards/`: Credit card management  
- `transactions/`: Transaction management
- `monthly_overview/`: Monthly financial summary
- `login/` and `register/`: Authentication pages

## Development Notes

- Backend serves API on port 8000, frontend on port 3000
- JWT secret key is hardcoded (change for production)
- Database auto-creates tables on startup via SQLAlchemy
- Frontend uses Portuguese language for user-facing content
- All routes except login/register require authentication
- Transaction updates automatically sync account/card balances