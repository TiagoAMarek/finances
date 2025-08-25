import { describe, it, expect, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "@vitest/browser/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock only the problematic data hooks that cause hanging
vi.mock("@/features/accounts/hooks/data", () => ({
  useGetAccounts: () => ({
    data: [
      { id: 1, name: "Conta Corrente", balance: "1000.00" },
      { id: 2, name: "Poupança", balance: "2000.00" }
    ],
    isLoading: false,
    error: null
  })
}));

vi.mock("@/features/categories/hooks/data", () => ({
  useGetCategories: () => ({
    data: [
      { id: 1, name: "Alimentação", type: "expense", color: "#ef4444", icon: "🍕" },
      { id: 2, name: "Salário", type: "income", color: "#22c55e", icon: "💰" },
      { id: 3, name: "Transporte", type: "both", color: "#3b82f6", icon: "🚗" }
    ],
    isLoading: false,
    error: null
  })
}));

vi.mock("@/features/credit-cards/hooks/data", () => ({
  useGetCreditCards: () => ({
    data: [
      { id: 1, name: "Nubank", limit: "5000.00" },
      { id: 2, name: "Inter", limit: "3000.00" }
    ],
    isLoading: false,
    error: null
  })
}));

// Import the component after mocking dependencies
const { CreateTransactionModal } = await import("@/features/transactions/components/CreateTransactionModal");

describe("CreateTransactionModal Browser Tests", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  // Component wrapper with required providers
  const TestComponent = ({ open = true, onOpenChange = () => {}, onSubmit = () => {}, isLoading = false }) => (
    <QueryClientProvider client={queryClient}>
      <CreateTransactionModal 
        open={open} 
        onOpenChange={onOpenChange} 
        onSubmit={onSubmit} 
        isLoading={isLoading}
      />
    </QueryClientProvider>
  );

  it("renders modal when open", async () => {
    await render(<TestComponent open={true} />);
    
    // Wait for modal to render and look for dialog role or modal content
    await expect.element(page.getByText('Novo Lançamento')).toBeVisible();
    
    // Check for form elements
    await expect.element(page.getByPlaceholder('Ex: Compra no supermercado')).toBeVisible();
  });

  it("does not render when closed", async () => {
    await render(<TestComponent open={false} />);
    
    // Modal should not be present in DOM when closed - check that modal content is not visible
    const modalElements = page.getByText('Novo Lançamento');
    await expect.element(modalElements).not.toBeInTheDocument();
  });

  it("handles form input interactions", async () => {
    await render(<TestComponent open={true} />);
    
    // Wait for form to be ready
    await expect.element(page.getByPlaceholder('Ex: Compra no supermercado')).toBeVisible();
    
    // Get the description input
    const descriptionInput = page.getByPlaceholder('Ex: Compra no supermercado');
    
    // Type in the input
    await descriptionInput.click();
    await descriptionInput.fill('Test transaction');
    
    // Verify the input value
    await expect.element(descriptionInput).toHaveValue('Test transaction');
  });

  it("shows account and credit card options", async () => {
    await render(<TestComponent open={true} />);
    
    // Wait for form to load
    await expect.element(page.getByText('Novo Lançamento')).toBeVisible();
    
    // Check that account/credit card options are available
    await expect.element(page.getByText('🏦 Conta Bancária')).toBeVisible();
    await expect.element(page.getByText('💳 Cartão de Crédito')).toBeVisible();
  });

  it("shows submit button", async () => {
    await render(<TestComponent open={true} />);
    
    // Check for submit button
    await expect.element(page.getByRole('button', { name: 'Criar Lançamento' })).toBeVisible();
  });
});