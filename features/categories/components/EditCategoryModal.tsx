import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon, TagIcon } from "lucide-react";
import { useMemo } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { 
  FormModal,
  FormModalHeader,
  FormModalField,
  FormModalActions,
  FormModalFormWithHook,
  FormModalPreview
} from "@/features/shared/components";
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui";
import { Category, CategoryCreateInput, CategoryCreateSchema } from "@/lib/schemas";

interface EditCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onSubmit: (data: {
    name: string;
    type: "income" | "expense" | "both";
    color?: string;
    icon?: string;
  }) => void;
  isLoading: boolean;
}

const CATEGORY_COLORS = [
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#06b6d4",
  "#f59e0b",
  "#ef4444",
  "#84cc16",
  "#ec4899",
  "#6366f1",
  "#f97316",
  "#a855f7",
  "#0ea5e9",
  "#64748b",
  "#6b7280",
];

const CATEGORY_ICONS = [
  "💰",
  "💻",
  "📈",
  "💸",
  "🍽️",
  "🚗",
  "🏠",
  "🏥",
  "📚",
  "🎬",
  "👔",
  "💳",
  "🔄",
  "🛒",
  "⚡",
  "📱",
];

export function EditCategoryModal({
  open,
  onOpenChange,
  category,
  onSubmit,
  isLoading,
}: EditCategoryModalProps) {
  // Memoize resolver to prevent recreation on every render
  const resolver = useMemo(() => zodResolver(CategoryCreateSchema), []);
  
  // Memoize default values to prevent recreation on every render
  const defaultValues = useMemo(() => ({
    name: "",
    type: "expense" as const,
    color: CATEGORY_COLORS[0],
    icon: CATEGORY_ICONS[0],
  }), []);

  const form = useForm<CategoryCreateInput>({
    resolver,
    mode: "onTouched", // Less aggressive validation for better performance
    defaultValues,
  });

  // Update form values when category changes
  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        type: category.type,
        color: category.color || CATEGORY_COLORS[0],
        icon: category.icon || CATEGORY_ICONS[0],
      });
    }
  }, [category, form]);

  const handleSubmit = (data: CategoryCreateInput) => {
    onSubmit({
      name: data.name,
      type: data.type,
      color: data.color,
      icon: data.icon,
    });
    handleClose();
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  if (!category) return null;

  return (
    <FormModal
      open={open}
      size="md"
      variant="edit"
      onOpenChange={onOpenChange}
    >
      <FormModalHeader
        description="Atualize as informações da categoria"
        icon={TagIcon}
        iconBgColor="bg-primary/10"
        iconColor="text-primary"
        title="Editar Categoria"
      />

      <FormModalPreview>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: category.color || CATEGORY_COLORS[0] }}>
            <span className="text-lg">{category.icon || CATEGORY_ICONS[0]}</span>
          </div>
          <div>
            <p className="font-medium text-foreground">{category.name}</p>
            <p className="text-sm text-muted-foreground">
              Tipo: {category.type === "income" ? "Receita" : category.type === "expense" ? "Despesa" : "Ambos"}
              {category.isDefault && " • Categoria padrão"}
            </p>
          </div>
        </div>
      </FormModalPreview>

      <FormModalFormWithHook form={form} onSubmit={handleSubmit}>
        <FormModalField
          description={category.isDefault ? "Categorias padrão não podem ser editadas" : "Escolha um nome descritivo para a categoria"}
          form={form}
          label="Nome da Categoria"
          name="name"
          required
        >
          <Input
            autoFocus
            className="h-11"
            disabled={category.isDefault}
            placeholder="Ex: Alimentação"
            type="text"
            {...form.register("name")}
          />
        </FormModalField>

        <FormModalField
          description="Defina se a categoria é para receitas, despesas ou ambos"
          form={form}
          label="Tipo"
          name="type"
          required
        >
          <Select
            disabled={category.isDefault}
            value={form.watch("type")}
            onValueChange={(value: "income" | "expense" | "both") =>
              form.setValue("type", value)
            }
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Receita</SelectItem>
              <SelectItem value="expense">Despesa</SelectItem>
              <SelectItem value="both">Ambos</SelectItem>
            </SelectContent>
          </Select>
        </FormModalField>

        <div className="space-y-2">
          <label className="text-sm font-medium">Cor</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_COLORS.map((colorOption) => (
              <button
                key={colorOption}
                className={`w-8 h-8 rounded-full border-2 ${
                  form.watch("color") === colorOption
                    ? "border-primary"
                    : "border-transparent"
                }`}
                disabled={category.isDefault}
                style={{ backgroundColor: colorOption }}
                type="button"
                onClick={() => form.setValue("color", colorOption)}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Selecione uma cor para identificar visualmente a categoria
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Ícone</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_ICONS.map((iconOption) => (
              <button
                key={iconOption}
                className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg ${
                  form.watch("icon") === iconOption
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
                disabled={category.isDefault}
                type="button"
                onClick={() => form.setValue("icon", iconOption)}
              >
                {iconOption}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Escolha um ícone para representar a categoria
          </p>
        </div>

        <FormModalActions
          isDisabled={!form.watch("name")?.trim() || category.isDefault}
          isLoading={isLoading}
          submitIcon={SaveIcon}
          submitText="Salvar Alterações"
          onCancel={handleClose}
        />
      </FormModalFormWithHook>
    </FormModal>
  );
}
