# Agent Guidelines for this Repository

This document outlines the conventions and commands for agents operating within this repository.

## 1. Build, Lint, and Test Commands

### Frontend (Next.js/TypeScript)

- **Install Dependencies:** `pnpm install`
- **Build:** `pnpm run build`
- **Lint:** `pnpm run lint`
- **Run Development Server:** `pnpm run dev` (The frontend development server runs on `http://localhost:3000`).
- **Test:** `pnpm test` (standard, verify if tests exist). For single test: `pnpm test <path/to/test_file.test.ts>`

### Backend (Flask/Python)

- **Install Dependencies:** `pip install -r backend/requirements.txt`
- **Run Development Server:** `python backend/main.py`
- **Test:** No explicit test framework configured. If tests are added, `pytest` is a common choice.
- **Lint:** No explicit linter configured. `flake8` or `black` are common Python linters.

## 2. Code Style Guidelines

### Frontend (TypeScript/React)

- **Formatting:** Adhere to ESLint rules defined in `eslint.config.mjs`.
- **Naming:** `camelCase` for variables and functions, `PascalCase` for components and types.
- **Types:** Use explicit TypeScript types where appropriate.
- **Imports:** Absolute imports for modules, relative for local files.

### Backend (Python)

- **Formatting:** Adhere to PEP 8 guidelines (e.g., `snake_case` for variables/functions, `PascalCase` for classes).
- **Imports:** Group standard library, third-party, and local imports.
- **Error Handling:** Use `try-except` blocks for anticipated errors.

## Development Conventions

- **API Communication:** The frontend communicates with the backend via RESTful API calls. A utility function `fetchWithAuth` in `frontend/src/utils/api.ts` is used to automatically attach the JWT `Authorization` header to authenticated requests.
- **Database:** The application uses a single SQLite database file (`financas.db`) in the `backend` directory. The database schema is defined using SQLAlchemy models in `backend/main.py` and is created automatically when the server starts.
- **Styling:** UI components are styled directly in the TSX files using Tailwind CSS utility classes. Global styles are defined in `frontend/src/app/globals.css`.
- **State Management:** The frontend uses React hooks (`useState`, `useEffect`) for component-level state management.
- **Authentication:** The JWT token is stored in the browser's `localStorage` upon successful login and is cleared on logout.

