import { CategoryWithStats } from "@/features/categories/hooks/data";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  RowListItem,
} from "@/features/shared/components/ui";
import { Category } from "@/lib/schemas";
import {
  Edit2,
  Folder,
  MoreHorizontal,
  Shield,
  ShoppingCart,
  Trash2,
  TrendingUp,
  Wallet,
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

  const icon = (
    <div
      className="flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0"
      style={{ backgroundColor: category.color || "#64748b" }}
    >
      {renderIcon()}
    </div>
  );

  const subtitle = (
    <div className="flex items-center gap-2">
      <Badge
        variant="secondary"
        className={`text-xs font-medium ${getTypeColor(category.type)}`}
      >
        {getTypeLabel(category.type)}
      </Badge>
      {"transactionCount" in category && (
        <Badge variant="outline" className="text-xs font-medium">
          {category.transactionCount}{" "}
          {category.transactionCount === 1 ? "transação" : "transações"}
        </Badge>
      )}
      {category.isDefault && (
        <div className="flex items-center gap-1">
          <Shield className="h-3 w-3 text-muted-foreground" />
          <Badge variant="outline" className="text-xs text-muted-foreground">
            Padrão
          </Badge>
        </div>
      )}
    </div>
  );

  const actions = (
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
  );

  return (
    <>
      <RowListItem
        icon={icon}
        title={category.name}
        subtitle={subtitle}
        actions={actions}
        isLoading={isDeleting}
        loadingText="Processando..."
      />

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
