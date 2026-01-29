import { Category } from "@/lib/schemas";

export const mockCategories: Category[] = [
  {
    id: 1,
    name: "Salário",
    type: "income",
    color: "#10b981",
    icon: "💰",
    isDefault: true,
    ownerId: 1,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Freelance",
    type: "income",
    color: "#059669",
    icon: "💼",
    isDefault: true,
    ownerId: 1,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "Investimentos",
    type: "both",
    color: "#0891b2",
    icon: "📊",
    isDefault: true,
    ownerId: 1,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 4,
    name: "Alimentação",
    type: "expense",
    color: "#f59e0b",
    icon: "🍽️",
    isDefault: true,
    ownerId: 1,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 5,
    name: "Transporte",
    type: "expense",
    color: "#3b82f6",
    icon: "🚗",
    isDefault: true,
    ownerId: 1,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 6,
    name: "Lazer",
    type: "expense",
    color: "#8b5cf6",
    icon: "🎮",
    isDefault: true,
    ownerId: 1,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 7,
    name: "Saúde",
    type: "expense",
    color: "#ef4444",
    icon: "🏥",
    isDefault: true,
    ownerId: 1,
    createdAt: "2024-01-01T00:00:00Z",
  },
];

// Fixed ID counter for createMockCategory
let mockCategoryIdCounter = 100;

export const createMockCategory = (
  overrides: Partial<Category> = {},
): Category => ({
  id: ++mockCategoryIdCounter, // Sequential ID, not random
  name: "Categoria Teste",
  type: "expense",
  color: "#64748b",
  icon: "📝",
  isDefault: false,
  ownerId: 1,
  createdAt: "2024-01-01T00:00:00Z", // Fixed date
  ...overrides,
});