# GEMINI Project Context: Personal Finance App

## Project Overview

This is a full-stack personal finance web application designed for the Brazilian market, with the interface in Portuguese and currency handled in Brazilian Reais (R$).

The project is structured as a monorepo with two main directories:
-   `frontend`: A Next.js (React) single-page application.
-   `backend`: A Flask (Python) RESTful API.

**Core Features:**
-   **User Authentication:** Secure user registration and login using JWT (JSON Web Tokens).
-   **Bank Account Management:** Full CRUD (Create, Read, Update, Delete) operations for bank accounts.
-   **Credit Card Management:** Full CRUD operations for credit cards.
-   **Transaction Tracking:** Full CRUD operations for income and expense transactions, which can be linked to bank accounts or credit cards.
-   **Automated Balance Updates:** Bank account balances and credit card bills are automatically updated when transactions are created, updated, or deleted.
-   **Monthly Financial Overview:** An API endpoint provides a summary of total income, expenses, and balance for a given month and year.

### Technology Stack

-   **Backend:**
    -   Framework: **Flask**
    -   Database: **SQLite** (for development)
    -   ORM: **SQLAlchemy**
    -   Authentication: **Flask-JWT-Extended** for JWT handling, `passlib` for password hashing.
    -   Package Manager: **uv**
-   **Frontend:**
    -   Framework: **Next.js 15** with App Router
    -   Language: **TypeScript**
    -   Styling: **Tailwind CSS**
    -   Package Manager: **pnpm**

## Building and Running

### Backend (Flask API)

The backend server runs on `http://localhost:8000`.

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Set up the virtual environment and install dependencies:**
    The project uses `uv` for package and environment management.
    ```bash
    # Create the virtual environment (if it doesn't exist)
    uv venv

    # Install dependencies
    uv pip install -r requirements.txt
    ```

3.  **Run the development server:**
    ```bash
    # Activate the virtual environment
    source .venv/bin/activate

    # Run the Flask app
    python main.py
    ```

### Frontend (Next.js App)

The frontend development server runs on `http://localhost:3000`.

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    The project uses `pnpm` as the package manager.
    ```bash
    pnpm install
    ```

3.  **Run the development server:**
    ```bash
    pnpm dev
    ```

## Development Conventions

-   **API Communication:** The frontend communicates with the backend via RESTful API calls. A utility function `fetchWithAuth` in `frontend/src/utils/api.ts` is used to automatically attach the JWT `Authorization` header to authenticated requests.
-   **Database:** The application uses a single SQLite database file (`financas.db`) in the `backend` directory. The database schema is defined using SQLAlchemy models in `backend/main.py` and is created automatically when the server starts.
-   **Styling:** UI components are styled directly in the TSX files using Tailwind CSS utility classes. Global styles are defined in `frontend/src/app/globals.css`.
-   **State Management:** The frontend uses React hooks (`useState`, `useEffect`) for component-level state management.
-   **Authentication:** The JWT token is stored in the browser's `localStorage` upon successful login and is cleared on logout.
