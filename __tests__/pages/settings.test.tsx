import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import React from "react";
import { afterEach, describe, expect, it } from "vitest";

import SettingsPage from "@/app/settings/page";

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

describe("SettingsPage", () => {
  const mockUserProfile = {
    id: 1,
    name: "Test User",
    email: "test@example.com",
  };

  it("renders settings page with profile form", async () => {
    testHelpers.setAuthenticatedUser();

    server.use(
      http.get("/api/users/profile", () =>
        HttpResponse.json(mockUserProfile, { status: 200 }),
      ),
    );

    renderWithProviders(<SettingsPage />);

    expect(
      screen.getByRole("heading", { name: /configurações/i }),
    ).toBeInTheDocument();

    // Wait for profile data to load
    await waitFor(() => {
      expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
      expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
    });
  });

  it("shows loading state while fetching profile", () => {
    testHelpers.setAuthenticatedUser();

    renderWithProviders(<SettingsPage />);

    // Should show skeleton loaders
    expect(screen.getAllByTestId(/skeleton/i).length).toBeGreaterThan(0);
  });

  it("shows error alert when profile fetch fails", async () => {
    testHelpers.setAuthenticatedUser();

    server.use(
      http.get("/api/users/profile", () =>
        HttpResponse.json({ detail: "Error fetching profile" }, { status: 500 }),
      ),
    );

    renderWithProviders(<SettingsPage />);

    // Wait for error alert to appear
    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/erro ao carregar configurações/i);
  });

  it("renders both profile and password forms", async () => {
    testHelpers.setAuthenticatedUser();

    server.use(
      http.get("/api/users/profile", () =>
        HttpResponse.json(mockUserProfile, { status: 200 }),
      ),
    );

    renderWithProviders(<SettingsPage />);

    // Wait for forms to render
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /informações do perfil/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /alterar senha/i }),
      ).toBeInTheDocument();
    });
  });

  it("disables submit button when profile form is not dirty", async () => {
    testHelpers.setAuthenticatedUser();

    server.use(
      http.get("/api/users/profile", () =>
        HttpResponse.json(mockUserProfile, { status: 200 }),
      ),
    );

    renderWithProviders(<SettingsPage />);

    // Wait for profile data to load
    await waitFor(() => {
      expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    });

    // Find the "Salvar Alterações" button - should be disabled initially
    const saveButton = screen.getByRole("button", {
      name: /salvar alterações/i,
    });
    expect(saveButton).toBeDisabled();
  });

  it("enables submit button when profile form is modified", async () => {
    testHelpers.setAuthenticatedUser();
    const user = userEvent.setup();

    server.use(
      http.get("/api/users/profile", () =>
        HttpResponse.json(mockUserProfile, { status: 200 }),
      ),
    );

    renderWithProviders(<SettingsPage />);

    // Wait for profile data to load
    await waitFor(() => {
      expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    });

    // Modify the name field
    const nameInput = screen.getByDisplayValue("Test User");
    await user.clear(nameInput);
    await user.type(nameInput, "Updated Name");

    // Find the "Salvar Alterações" button - should be enabled now
    await waitFor(() => {
      const saveButton = screen.getByRole("button", {
        name: /salvar alterações/i,
      });
      expect(saveButton).not.toBeDisabled();
    });
  });

  it("shows password form fields", async () => {
    testHelpers.setAuthenticatedUser();

    server.use(
      http.get("/api/users/profile", () =>
        HttpResponse.json(mockUserProfile, { status: 200 }),
      ),
    );

    renderWithProviders(<SettingsPage />);

    // Wait for forms to render
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/digite sua senha atual/i),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/digite sua nova senha/i),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/confirme sua nova senha/i),
      ).toBeInTheDocument();
    });
  });
});
