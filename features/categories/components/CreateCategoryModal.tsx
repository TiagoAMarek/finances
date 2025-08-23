import { FormModal, QuickCreateButton } from "@/features/shared/components";
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui";
import { PlusIcon, TagIcon } from "lucide-react";
import { useState } from "react";

interface CreateCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function CreateCategoryModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: CreateCategoryModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"income" | "expense" | "both">("expense");
  const [color, setColor] = useState(CATEGORY_COLORS[0]);
  const [icon, setIcon] = useState(CATEGORY_ICONS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      type,
      color,
      icon,
    });
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setType("expense");
    setColor(CATEGORY_COLORS[0]);
    setIcon(CATEGORY_ICONS[0]);
  };

  const handleClose = () => {
    resetForm();
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
      <FormModal.Header
        icon={TagIcon}
        iconColor="text-primary"
        iconBgColor="bg-primary/10"
        title="Nova Categoria"
        description="Crie uma nova categoria para organizar suas transações"
      />

      <FormModal.Form onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label
            htmlFor="categoryName"
            className="text-sm font-medium flex items-center gap-2"
          >
            <TagIcon className="h-4 w-4" />
            Nome da Categoria
          </Label>
          <Input
            type="text"
            id="categoryName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Alimentação"
            className="h-11"
            autoFocus
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Tipo</Label>
          <Select
            value={type}
            onValueChange={(value: "income" | "expense" | "both") =>
              setType(value)
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
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Cor</Label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_COLORS.map((colorOption) => (
              <button
                key={colorOption}
                type="button"
                className={`w-8 h-8 rounded-full border-2 ${color === colorOption
                    ? "border-primary"
                    : "border-transparent"
                  }`}
                style={{ backgroundColor: colorOption }}
                onClick={() => setColor(colorOption)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Ícone</Label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_ICONS.map((iconOption) => (
              <button
                key={iconOption}
                type="button"
                className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg ${icon === iconOption
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                  }`}
                onClick={() => setIcon(iconOption)}
              >
                {iconOption}
              </button>
            ))}
          </div>
        </div>

        <FormModal.Actions
          onCancel={handleClose}
          submitText="Criar Categoria"
          submitIcon={PlusIcon}
          isLoading={isLoading}
          isDisabled={!name.trim()}
        />
      </FormModal.Form>
    </FormModal>
  );
}
