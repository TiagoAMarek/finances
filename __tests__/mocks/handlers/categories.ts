import { http, HttpResponse } from "msw";

/**
 * MSW handlers for categories endpoints
 * Provides mock data for categories API routes during testing and development
 */

// Mock categories data
const mockCategories = [
  {
    id: 1,
    name: "Salário",
    type: "income",
    color: "#10b981",
    icon: "💰",
    isDefault: true,
    ownerId: 1,
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Alimentação",
    type: "expense", 
    color: "#f59e0b",
    icon: "🍽️",
    isDefault: true,
    ownerId: 1,
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    name: "Transporte",
    type: "expense",
    color: "#3b82f6", 
    icon: "🚗",
    isDefault: true,
    ownerId: 1,
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    name: "Lazer",
    type: "expense",
    color: "#8b5cf6",
    icon: "🎮",
    isDefault: true,
    ownerId: 1,
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 5,
    name: "Saúde",
    type: "expense",
    color: "#ef4444",
    icon: "🏥",
    isDefault: true,
    ownerId: 1,
    createdAt: "2024-01-01T00:00:00Z"
  }
];

export const categoryHandlers = [
  /**
   * GET /api/categories - List Categories
   */
  http.get("/api/categories", async ({ request }) => {
    // Check authorization
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json(
        { detail: "Authorization header required" }, 
        { status: 401 }
      );
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return HttpResponse.json(mockCategories, { status: 200 });
  }),

  /**
   * POST /api/categories - Create Category
   */
  http.post("/api/categories", async ({ request }) => {
    // Check authorization
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json(
        { detail: "Authorization header required" },
        { status: 401 }
      );
    }

    const requestBody = await request.json();
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 150));

    // Create new category
    const newCategory = {
      id: mockCategories.length + 1,
      ...requestBody,
      isDefault: false,
      ownerId: 1,
      createdAt: new Date().toISOString()
    };

    mockCategories.push(newCategory);

    return HttpResponse.json(newCategory, { status: 201 });
  }),

  /**
   * GET /api/categories/defaults - List Default Categories
   */
  http.get("/api/categories/defaults", async ({ request }) => {
    // Check authorization
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json(
        { detail: "Authorization header required" },
        { status: 401 }
      );
    }

    // Return default categories
    const defaultCategories = mockCategories.filter(cat => cat.isDefault);
    
    await new Promise(resolve => setTimeout(resolve, 100));

    return HttpResponse.json(defaultCategories, { status: 200 });
  }),

  /**
   * PUT /api/categories/[id] - Update Category  
   */
  http.put("/api/categories/:id", async ({ params, request }) => {
    // Check authorization
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json(
        { detail: "Authorization header required" },
        { status: 401 }
      );
    }

    const categoryId = parseInt(params.id as string);
    const requestBody = await request.json();
    
    await new Promise(resolve => setTimeout(resolve, 150));

    // Find and update category
    const categoryIndex = mockCategories.findIndex(cat => cat.id === categoryId);
    if (categoryIndex === -1) {
      return HttpResponse.json(
        { detail: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    mockCategories[categoryIndex] = {
      ...mockCategories[categoryIndex],
      ...requestBody
    };

    return HttpResponse.json(mockCategories[categoryIndex], { status: 200 });
  }),

  /**
   * DELETE /api/categories/[id] - Delete Category
   */
  http.delete("/api/categories/:id", async ({ params, request }) => {
    // Check authorization  
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json(
        { detail: "Authorization header required" },
        { status: 401 }
      );
    }

    const categoryId = parseInt(params.id as string);
    
    await new Promise(resolve => setTimeout(resolve, 150));

    // Find category
    const categoryIndex = mockCategories.findIndex(cat => cat.id === categoryId);
    if (categoryIndex === -1) {
      return HttpResponse.json(
        { detail: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    // Remove category
    mockCategories.splice(categoryIndex, 1);

    return HttpResponse.json(
      { message: "Categoria excluída com sucesso" },
      { status: 200 }
    );
  })
];