import { Category } from "@/lib/schemas";
import { CategoryWithStats } from "@/features/categories/hooks/data/useGetCategoriesWithStats";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MoreHorizontal,
  Edit2,
  Trash2,
  Shield,
  Wallet,
  ShoppingCart,
  TrendingUp,
  Folder,
} from "lucide-react";
import { useState } from "react";

interface CategoryItemProps {
  category: Category | CategoryWithStats;
  onEdit: (categoryId: number) => void;
  onDelete: (categoryId: number) => void;
  isDeleting: boolean;
}

export function CategoryItem({
  category,
  onEdit,
  onDelete,
  isDeleting,
}: CategoryItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getDefaultIcon = (type: string) => {
    switch (type) {
      case "income":
        return <TrendingUp className="h-5 w-5 text-white" />;
      case "expense":
        return <ShoppingCart className="h-5 w-5 text-white" />;
      case "both":
        return <Wallet className="h-5 w-5 text-white" />;
      default:
        return <Folder className="h-5 w-5 text-white" />;
    }
  };

  const renderIcon = () => {
    if (category.icon) {
      // Check if it's an emoji or text
      const isEmoji = /\p{Emoji}/u.test(category.icon);
      if (isEmoji) {
        return (
          <span className="drop-shadow-sm text-xl leading-none">
            {category.icon}
          </span>
        );
      } else {
        // Fallback to default icon for non-emoji strings
        return getDefaultIcon(category.type);
      }
    }
    return getDefaultIcon(category.type);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "income":
        return "Receita";
      case "expense":
        return "Despesa";
      case "both":
        return "Ambos";
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "income":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "expense":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "both":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const handleDelete = () => {
    onDelete(category.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div
        className={`group relative flex items-center gap-4 p-4 transition-all duration-200 hover:bg-muted/30 border-b border-border/50 last:border-b-0 ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
      >
        {isDeleting && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span className="text-sm text-muted-foreground">
                Processando...
              </span>
            </div>
          </div>
        )}

        {/* Category Icon */}
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0"
          style={{ backgroundColor: category.color || "#64748b" }}
        >
          {renderIcon()}
        </div>

        {/* Category Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground truncate">
                  {category.name}
                </h3>
                {category.isDefault && (
                  <Shield className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className={`text-xs font-medium ${getTypeColor(category.type)}`}
                >
                  {getTypeLabel(category.type)}
                </Badge>
                {"transactionCount" in category && (
                  <Badge variant="outline" className="text-xs font-medium">
                    {category.transactionCount}{" "}
                    {category.transactionCount === 1
                      ? "transação"
                      : "transações"}
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Single dropdown menu - appears on hover, consistent across all devices */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-muted/80 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Ações da categoria ${category.name}`}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onEdit(category.id)}
                    disabled={category.isDefault}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    disabled={category.isDefault || isDeleting}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a categoria &quot;{category.name}
              &quot;? Esta ação não pode ser desfeita. Você só pode excluir
              categorias que não possuem transações associadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
