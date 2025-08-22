# MSW Authentication Mocking Guide

This guide explains how to use the MSW (Mock Service Worker) authentication mocking system implemented in this project for comprehensive login and authentication testing.

## Overview

The authentication mocking system provides:
- **Realistic JWT tokens** and user credentials
- **Complete API endpoint mocking** for login/register/logout flows
- **Comprehensive test utilities** for common authentication scenarios
- **Error simulation** for network issues, server errors, and validation failures
- **State management helpers** for managing authentication in tests

## Quick Start

### Basic Login Test

```tsx
import { authTestHelpers } from "../utils/auth-helpers";
import { renderWithProviders } from "../utils/test-utils";

it("should login successfully with valid credentials", async () => {
  // Arrange: Get mock credentials
  const credentials = authTestHelpers.getValidCredentials();
  
  // Act: Perform login
  const result = await authTestHelpers.performLoginFlow(
    fetchWithAuth, 
    credentials
  );
  
  // Assert: Check success
  expect(result.status).toBe(200);
  authTestHelpers.expectSuccessfulLoginResponse(result.data);
});
```

### Component Testing with Authentication

```tsx
it("should render protected content for authenticated users", () => {
  // Arrange: Set up authenticated user
  authTestHelpers.loginUser("test@example.com");
  
  // Act: Render component
  render(<ProtectedComponent />, {
    wrapper: ({ children }) => renderWithProviders(children)
  });
  
  // Assert: Check protected content is visible
  expect(screen.getByText("Welcome, authenticated user!")).toBeInTheDocument();
});
```

## File Structure

```
__tests__/mocks/
├── data/
│   └── auth.ts              # Mock user data and credentials
├── handlers/
│   └── auth.ts              # MSW request handlers for auth endpoints
└── utils/
    └── auth-helpers.ts      # Test utilities and helper functions
```

## Mock Data (`data/auth.ts`)

### Available Users

| Email | Password | Role | Token Type |
|-------|----------|------|------------|
| `test@example.com` | `123456` | user | Valid token |
| `admin@example.com` | `admin123` | admin | Admin token |
| `expired@example.com` | `expired123` | user | Expired token |

### Pre-defined Scenarios

```tsx
// Valid login
const credentials = authTestHelpers.getValidCredentials();
// { email: "test@example.com", password: "123456" }

// Invalid credentials
const invalid = authTestHelpers.getInvalidCredentials();
// { email: "test@example.com", password: "wrongpassword" }

// Admin login
const admin = authTestHelpers.getAdminCredentials();
// { email: "admin@example.com", password: "admin123" }
```

## API Handlers (`handlers/auth.ts`)

The following endpoints are automatically mocked:

### `POST /api/auth/login`
- ✅ Validates credentials against mock user database
- ✅ Returns JWT tokens for successful authentication
- ✅ Handles validation errors (invalid email format, empty password)
- ✅ Returns 401 for invalid credentials

### `POST /api/auth/register`
- ✅ Validates registration data with Zod schemas
- ✅ Checks for existing email addresses
- ✅ Returns user data on successful registration
- ✅ Handles validation and conflict errors

### `GET /api/auth/me`
- ✅ Validates Bearer tokens in Authorization header
- ✅ Returns user profile data for valid tokens
- ✅ Handles expired and invalid tokens
- ✅ Returns 401 for missing authorization

### `POST /api/auth/logout`
- ✅ Simulates server-side logout process
- ✅ Validates authentication before logout
- ✅ Returns success confirmation

## Test Utilities (`utils/auth-helpers.ts`)

### Authentication State Management

```tsx
// Login as default user
const user = authTestHelpers.loginUser();

// Login as specific user
const admin = authTestHelpers.loginUser("admin@example.com");

// Login as admin (shortcut)
const admin = authTestHelpers.loginAdmin();

// Logout current user
authTestHelpers.logoutUser();

// Set expired token
authTestHelpers.loginExpiredUser();
```

### API Flow Testing

```tsx
// Complete login flow
const result = await authTestHelpers.performLoginFlow(
  fetchWithAuth,
  { email: "test@example.com", password: "123456" }
);

// Registration flow
const regResult = await authTestHelpers.performRegistrationFlow(
  fetchWithAuth,
  { email: "new@example.com", password: "newpass123" }
);

// Authenticated request
const authResult = await authTestHelpers.performAuthenticatedRequest(
  fetchWithAuth,
  "/api/protected-endpoint"
);
```

### Response Validation

```tsx
// Validate login response structure
authTestHelpers.expectSuccessfulLoginResponse(response);

// Validate registration response
authTestHelpers.expectSuccessfulRegistrationResponse(response);

// Validate error response
authTestHelpers.expectErrorResponse(response, "Expected error message");

// Validate JWT token format
authTestHelpers.validateTokenStructure(token);
```

### Form Testing Helpers

```tsx
// Fill login form automatically
const { emailInput, passwordInput, submitButton } = 
  authTestHelpers.fillLoginForm(screen.getByLabelText, screen.getByRole);

// Fill registration form
const formElements = authTestHelpers.fillRegistrationForm(
  screen.getByLabelText, 
  screen.getByRole
);
```

## Error Simulation

### Network Issues

```tsx
// Simulate network failure
authTestHelpers.simulateNetworkError();

// Simulate slow network
authTestHelpers.simulateSlowNetwork();

// Reset to default handlers
authTestHelpers.resetAuthHandlers();
```

### Server Errors

```tsx
// Simulate 500 server error
authTestHelpers.simulateServerError();

// Simulate rate limiting (429)
authTestHelpers.simulateRateLimiting();
```

## Advanced Usage

### Testing Protected Routes

```tsx
describe("Protected Routes", () => {
  it("should allow access with valid token", async () => {
    // Set up authentication
    authTestHelpers.loginUser();
    
    // Test protected endpoint
    const response = await fetchWithAuth("/api/protected-resource");
    expect(response.status).toBe(200);
  });

  it("should reject expired tokens", async () => {
    // Set up expired token
    authTestHelpers.loginExpiredUser();
    
    // Test should fail
    const response = await fetchWithAuth("/api/protected-resource");
    expect(response.status).toBe(401);
  });
});
```

### Custom Authentication Scenarios

```tsx
// Override handlers for specific test cases
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";

it("should handle custom auth scenario", async () => {
  // Override login handler for this test
  server.use(
    http.post("/api/auth/login", () => {
      return HttpResponse.json(
        { detail: "Maintenance mode" },
        { status: 503 }
      );
    })
  );

  // Test maintenance scenario
  const result = await authTestHelpers.performLoginFlow(fetchWithAuth);
  expect(result.status).toBe(503);
});
```

### Integration with React Query

```tsx
import { useLogin } from "@/features/auth/hooks/data/useLogin";

const TestComponent = () => {
  const loginMutation = useLogin();
  
  const handleLogin = () => {
    loginMutation.mutate({
      email: "test@example.com",
      password: "123456"
    });
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      {loginMutation.data && <div>Success!</div>}
      {loginMutation.error && <div>Error: {loginMutation.error.message}</div>}
    </div>
  );
};

it("should handle login mutation", async () => {
  render(<TestComponent />);
  
  fireEvent.click(screen.getByRole("button", { name: /login/i }));
  
  await waitFor(() => {
    expect(screen.getByText("Success!")).toBeInTheDocument();
  });
});
```

## Best Practices

### 1. Reset State Between Tests

```tsx
beforeEach(() => {
  // Clear authentication state
  testHelpers.resetLocalStorage();
  authTestHelpers.resetAuthHandlers();
});
```

### 2. Use Realistic Data

```tsx
// Good: Use provided mock credentials
const credentials = authTestHelpers.getValidCredentials();

// Avoid: Hardcoded test data
const credentials = { email: "test", password: "test" };
```

### 3. Test Error Scenarios

```tsx
it("should handle network failures gracefully", async () => {
  authTestHelpers.simulateNetworkError();
  
  const result = await authTestHelpers.performLoginFlow(fetchWithAuth);
  
  // Verify error handling
  expect(result.response.ok).toBe(false);
});
```

### 4. Validate Response Structure

```tsx
// Always validate response structure
authTestHelpers.expectSuccessfulLoginResponse(loginData);
authTestHelpers.validateTokenStructure(token);
```

## Troubleshooting

### Common Issues

1. **MSW not intercepting requests**
   - Ensure MSW is properly set up in test-utils.ts
   - Check that server.listen() is called before tests

2. **localStorage mocking not working**
   - Verify localStorageMock is imported and configured
   - Use testHelpers.resetLocalStorage() between tests

3. **Token validation failing**
   - Check token format matches expected JWT structure
   - Ensure mock tokens in auth data are properly formatted

4. **Handler not found errors**
   - Verify auth handlers are imported in server.ts and browser.ts
   - Check endpoint URLs match exactly (including leading slash)

### Debugging Tips

```tsx
// Debug MSW requests
beforeAll(() => {
  server.listen({ 
    onUnhandledRequest: 'warn'  // Shows unhandled requests
  });
});

// Debug authentication state
console.log('Current auth state:', authTestHelpers.loginUser());

// Debug API responses
const result = await authTestHelpers.performLoginFlow(fetchWithAuth);
console.log('API Response:', result);
```

## Examples

See comprehensive examples in:
- `__tests__/examples/login-mocking-examples.test.tsx`

This file contains real-world scenarios demonstrating:
- Basic login/registration flows
- Protected route testing
- Error handling scenarios
- Form validation testing
- State management examples
- Integration testing patterns