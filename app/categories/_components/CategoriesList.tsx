import { Category } from "@/lib/schemas";
import { CategoryItem } from "./CategoryItem";
import { Card, CardContent } from "@/components/ui/card";
import { TagIcon } from "lucide-react";

interface CategoriesListProps {
  categories: Category[];
  onEdit: (categoryId: number) => void;
  onDelete: (categoryId: number) => void;
  isDeleting: boolean;
}

export function CategoriesList({
  categories,
  onEdit,
  onDelete,
  isDeleting,
}: CategoriesListProps) {
  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <TagIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium">
            Nenhuma categoria encontrada
          </h3>
          <p className="mt-2 text-muted-foreground">
            Comece criando sua primeira categoria para organizar suas
            transações.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group categories by type
  const incomeCategories = categories.filter((cat) => cat.type === "income");
  const expenseCategories = categories.filter((cat) => cat.type === "expense");
  const bothCategories = categories.filter((cat) => cat.type === "both");

  return (
    <div className="space-y-6">
      {expenseCategories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-red-700 dark:text-red-300">
            Categorias de Despesa ({expenseCategories.length})
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {expenseCategories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onEdit={onEdit}
                onDelete={onDelete}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        </div>
      )}

      {incomeCategories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-green-700 dark:text-green-300">
            Categorias de Receita ({incomeCategories.length})
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {incomeCategories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onEdit={onEdit}
                onDelete={onDelete}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        </div>
      )}

      {bothCategories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-300">
            Categorias Gerais ({bothCategories.length})
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {bothCategories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onEdit={onEdit}
                onDelete={onDelete}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
