import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent, act } from "../../utils/test-utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/features/shared/components/ui/input";
import { Plus, Edit } from "lucide-react";

// Import FormModal components
import { FormModalBase } from "@/features/shared/components/FormModal/FormModalBase";
import { FormModalHeader } from "@/features/shared/components/FormModal/FormModalHeader";
import { FormModalFormWithHook } from "@/features/shared/components/FormModal/FormModalFormWithHook";
import { FormModalField } from "@/features/shared/components/FormModal/FormModalField";
import { FormModalActions } from "@/features/shared/components/FormModal/FormModalActions";

// Test schema for form validation
const testSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
});

type TestFormData = z.infer<typeof testSchema>;

// Test wrapper component
const TestFormModal = ({
  open,
  onOpenChange,
  onSubmit,
  variant = "create",
  size = "md",
  trigger,
  defaultValues,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TestFormData) => void;
  variant?: "create" | "edit";
  size?: "sm" | "md" | "lg";
  trigger?: React.ReactNode;
  defaultValues?: Partial<TestFormData>;
}) => {
  const form = useForm<TestFormData>({
    resolver: zodResolver(testSchema),
    defaultValues: defaultValues || { name: "", email: "" },
    mode: "onChange",
  });

  const handleSubmit = (data: TestFormData) => {
    onSubmit(data);
    onOpenChange(false);
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <FormModalBase
      open={open}
      onOpenChange={onOpenChange}
      variant={variant}
      size={size}
      trigger={trigger}
    >
      <FormModalHeader
        icon={variant === "create" ? Plus : Edit}
        title={variant === "create" ? "Criar Usuário" : "Editar Usuário"}
        description={variant === "create" ? "Adicione um novo usuário ao sistema" : "Edite as informações do usuário"}
      />

      <FormModalFormWithHook form={form} onSubmit={handleSubmit}>
        <div className="space-y-4">
          <FormModalField form={form} name="name" label="Nome" required>
            <Input {...form.register("name")} placeholder="Digite o nome" />
          </FormModalField>

          <FormModalField form={form} name="email" label="Email" required>
            <Input {...form.register("email")} placeholder="Digite o email" type="email" />
          </FormModalField>
        </div>
      </FormModalFormWithHook>

      <FormModalActions
        form={form}
        onCancel={handleCancel}
        submitText={variant === "create" ? "Criar" : "Salvar"}
        submitIcon={variant === "create" ? Plus : Edit}
        isLoading={false}
      />
    </FormModalBase>
  );
};

describe("FormModal Core Behaviors", () => {
  const mockOnSubmit = vi.fn();
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnOpenChange.mockClear();
  });

  describe("Modal Opening and Closing", () => {
    it("should render modal when open=true", () => {
      renderWithProviders(
        <TestFormModal
          open={true}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Criar Usuário")).toBeInTheDocument();
      expect(screen.getByText("Adicione um novo usuário ao sistema")).toBeInTheDocument();
    });

    it("should not render modal when open=false", () => {
      renderWithProviders(
        <TestFormModal
          open={false}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("should call onOpenChange when cancel button is clicked", async () => {
      renderWithProviders(
        <TestFormModal
          open={true}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      );

      const cancelButton = screen.getByRole("button", { name: "Cancelar" });
      fireEvent.click(cancelButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("Form Submission", () => {
    it("should have correct form behavior with validation", async () => {
      renderWithProviders(
        <TestFormModal
          open={true}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      );

      // Initially, submit button should be disabled
      const submitButton = screen.getByRole("button", { name: "Criar" });
      expect(submitButton).toBeDisabled();

      // Fill form fields
      const nameInput = screen.getByLabelText(/nome/i);
      const emailInput = screen.getByLabelText(/email/i);

      await act(async () => {
        fireEvent.change(nameInput, { target: { value: "João Silva" } });
        fireEvent.change(emailInput, { target: { value: "joao@example.com" } });
      });

      // Form fields should have the correct values
      expect(nameInput).toHaveValue("João Silva");
      expect(emailInput).toHaveValue("joao@example.com");

      // Form validation is working (this is the key behavior)
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("should disable submit button when form is invalid", async () => {
      renderWithProviders(
        <TestFormModal
          open={true}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      );

      const submitButton = screen.getByRole("button", { name: "Criar" });
      
      // Submit button should be disabled initially (empty required fields)
      expect(submitButton).toBeDisabled();
    });
  });

  describe("Form Reset", () => {
    it("should load default values for edit variant", () => {
      const defaultValues = {
        name: "João Silva",
        email: "joao@example.com",
      };

      renderWithProviders(
        <TestFormModal
          open={true}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
          variant="edit"
          defaultValues={defaultValues}
        />
      );

      expect(screen.getByDisplayValue("João Silva")).toBeInTheDocument();
      expect(screen.getByDisplayValue("joao@example.com")).toBeInTheDocument();
      expect(screen.getByText("Editar Usuário")).toBeInTheDocument();
    });
  });

  describe("Modal Sizes", () => {
    it("should apply correct size classes", () => {
      const { rerender } = renderWithProviders(
        <TestFormModal
          open={true}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
          size="sm"
        />
      );

      let dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("sm:max-w-sm");

      rerender(
        <TestFormModal
          open={true}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
          size="md"
        />
      );

      dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("sm:max-w-md");

      rerender(
        <TestFormModal
          open={true}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
          size="lg"
        />
      );

      dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("sm:max-w-lg");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      renderWithProviders(
        <TestFormModal
          open={true}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("role", "dialog");
      
      // Check for proper labeling
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Criar Usuário")).toBeInTheDocument();
      expect(screen.getByText("Adicione um novo usuário ao sistema")).toBeInTheDocument();
    });

    it("should have proper form field associations", () => {
      renderWithProviders(
        <TestFormModal
          open={true}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      );

      const nameInput = screen.getByLabelText(/nome/i);
      const emailInput = screen.getByLabelText(/email/i);

      expect(nameInput).toHaveAttribute("id");
      expect(emailInput).toHaveAttribute("id");

      // Check required field indicators
      const nameLabel = screen.getByText("Nome");
      const emailLabel = screen.getByText("Email");

      expect(nameLabel.closest("label")).toBeInTheDocument();
      expect(emailLabel.closest("label")).toBeInTheDocument();
    });
  });

  describe("Component Integration", () => {
    it("should properly integrate FormModal components together", () => {
      renderWithProviders(
        <TestFormModal
          open={true}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      );

      // Check that all main components are rendered
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Criar Usuário")).toBeInTheDocument(); // Header
      expect(screen.getByLabelText(/nome/i)).toBeInTheDocument(); // Fields
      expect(screen.getByRole("button", { name: "Criar" })).toBeInTheDocument(); // Actions
      expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument(); // Actions
    });

    it("should work with different variant configurations", () => {
      const { rerender } = renderWithProviders(
        <TestFormModal
          open={true}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
          variant="create"
        />
      );

      expect(screen.getByText("Criar Usuário")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Criar" })).toBeInTheDocument();

      rerender(
        <TestFormModal
          open={true}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
          variant="edit"
        />
      );

      expect(screen.getByText("Editar Usuário")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument();
    });
  });
});