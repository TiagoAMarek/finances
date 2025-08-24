import { 
  FormModal,
  FormModalHeader,
  FormModalField,
  FormModalActions,
  FormModalFormWithHook,
  QuickCreateButton
} from "@/features/shared/components";
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui";
import { CategoryCreateInput, CategoryCreateSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, TagIcon } from "lucide-react";
import { useForm } from "react-hook-form";

interface CreateCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CategoryCreateInput) => void;
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

export function CreateCategoryModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: CreateCategoryModalProps) {
  const form = useForm<CategoryCreateInput>({
    resolver: zodResolver(CategoryCreateSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      type: "expense",
      color: CATEGORY_COLORS[0],
      icon: CATEGORY_ICONS[0],
    },
  });

  const handleSubmit = (data: CategoryCreateInput) => {
    onSubmit(data);
    handleClose();
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      variant="create"
      size="md"
      trigger={
        <QuickCreateButton onClick={() => onOpenChange(true)}>
          Nova Categoria
        </QuickCreateButton>
      }
    >
      <FormModalHeader
        icon={TagIcon}
        iconColor="text-primary"
        iconBgColor="bg-primary/10"
        title="Nova Categoria"
        description="Crie uma nova categoria para organizar suas transações"
      />

      <FormModalFormWithHook form={form} onSubmit={handleSubmit}>
        <FormModalField
          form={form}
          name="name"
          label="Nome da Categoria"
          required
        >
          <Input
            type="text"
            placeholder="Ex: Alimentação"
            className="h-11"
            autoFocus
            {...form.register("name")}
          />
        </FormModalField>

        <FormModalField form={form} name="type" label="Tipo" required>
          <Select
            value={form.watch("type")}
            onValueChange={(value) =>
              form.setValue("type", value as "income" | "expense" | "both")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Receita</SelectItem>
              <SelectItem value="expense">Despesa</SelectItem>
              <SelectItem value="both">Ambos</SelectItem>
            </SelectContent>
          </Select>
        </FormModalField>

        <FormModalField form={form} name="color" label="Cor">
          <div className="flex flex-wrap gap-2">
            {CATEGORY_COLORS.map((colorOption) => (
              <button
                key={colorOption}
                type="button"
                className={`w-8 h-8 rounded-full border-2 ${
                  form.watch("color") === colorOption
                    ? "border-primary"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: colorOption }}
                onClick={() => form.setValue("color", colorOption)}
              />
            ))}
          </div>
        </FormModalField>

        <FormModalField form={form} name="icon" label="Ícone">
          <div className="flex flex-wrap gap-2">
            {CATEGORY_ICONS.map((iconOption) => (
              <button
                key={iconOption}
                type="button"
                className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg ${
                  form.watch("icon") === iconOption
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => form.setValue("icon", iconOption)}
              >
                {iconOption}
              </button>
            ))}
          </div>
        </FormModalField>

        <FormModalActions
          form={form}
          onCancel={handleClose}
          submitText="Criar Categoria"
          submitIcon={PlusIcon}
          isLoading={isLoading}
        />
      </FormModalFormWithHook>
    </FormModal>
  );
}
