import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuickCreateButton } from "@/components/QuickCreateButton";
import { PlusIcon, TagIcon, Loader2Icon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <QuickCreateButton onClick={() => onOpenChange(true)}>
          Nova Categoria
        </QuickCreateButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-3 pb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <TagIcon className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-xl">Nova Categoria</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Crie uma nova categoria para organizar suas transações
            </DialogDescription>
          </div>
        </DialogHeader>

        <Card className="border-dashed">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                      className={`w-8 h-8 rounded-full border-2 ${
                        color === colorOption
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
                      className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg ${
                        icon === iconOption
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

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !name.trim()}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-4 w-4" />
                      Criar Categoria
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
