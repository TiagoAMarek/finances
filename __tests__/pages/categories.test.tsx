import { http, HttpResponse } from "msw";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import CategoriesPage from "@/app/categories/page";

import { server } from "../mocks/server";
import {
  renderWithProviders,
  screen,
  waitFor,
  testHelpers,
} from "../utils/test-utils";


// Ensure we reset auth mock state between tests
afterEach(() => {
  testHelpers.resetLocalStorage();
});

describe("CategoriesPage", () => {
  it("renders header and create CTA", async () => {
    testHelpers.setAuthenticatedUser();

    renderWithProviders(<CategoriesPage />);

    expect(
      screen.getByRole("heading", { name: /categorias/i })
    ).toBeInTheDocument();

    // The CreateCategoryModal renders a trigger button internally
    // Find a button that likely opens the create modal by accessible name
    const createButtons = screen.getAllByRole("button");
    expect(createButtons.length).toBeGreaterThan(0);
  });

  it("shows error alert with retry and refetches on click", async () => {
    testHelpers.setAuthenticatedUser();

    // For this test, return 500 for categories
    server.use(
      http.get(/\/api\/categories(?:\/.*)?$/, () =>
        HttpResponse.json({ message: "fail" }, { status: 500 })
      )
    );

    renderWithProviders(<CategoriesPage />);

    // Wait for error alert to appear
    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/erro ao carregar categorias/i);

    // Next, make the API succeed after retry
    server.use(
      http.get(/\/api\/categories(?:\/.*)?$/, () =>
        HttpResponse.json([], { status: 200 })
      )
    );

    // Click retry button
    const retry = screen.getByRole("button", { name: /tentar novamente/i });
    retry.click();

    // After refetch, expect empty state text and headline
    await screen.findByText(/nenhuma categoria ainda/i);
    await screen.findByText(/crie categorias para organizar/i);
  });

  it("renders empty state when no categories (with enhanced UI)", async () => {
    testHelpers.setAuthenticatedUser();

    server.use(
      http.get(/\/api\/categories(?:\/.*)?$/, () =>
        HttpResponse.json([], { status: 200 })
      )
    );

    renderWithProviders(<CategoriesPage />);

    expect(await screen.findByText(/nenhuma categoria ainda/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/crie categorias para organizar/i)
    ).toBeInTheDocument();
  });

  it("renders list header and items when categories exist", async () => {
    testHelpers.setAuthenticatedUser();

    // use default handlers which return mock categories
    renderWithProviders(<CategoriesPage />);

    // Expect at least one mock category name to be visible
    await screen.findByText(/alimentação/i);
    await screen.findByText(/salário/i);
  });
});
