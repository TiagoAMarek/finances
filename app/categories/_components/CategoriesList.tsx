import { Category } from "@/lib/schemas";
import { CategoryWithStats } from "@/features/categories/hooks/data/useGetCategoriesWithStats";
import { CategoryItem } from "./CategoryItem";
import { RowList } from "@/components/ui/row-list";
import { TagIcon } from "lucide-react";

interface CategoriesListProps {
  categories: (Category | CategoryWithStats)[];
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
      <div className="py-12 text-center border border-dashed rounded-lg">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <TagIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium">
          Nenhuma categoria encontrada
        </h3>
        <p className="mt-2 text-muted-foreground">
          Comece criando sua primeira categoria para organizar suas transações.
        </p>
      </div>
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
          <h3 className="text-sm font-medium mb-2 text-muted-foreground">
            Categorias de Despesa ({expenseCategories.length})
          </h3>
          <RowList>
            {expenseCategories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onEdit={onEdit}
                onDelete={onDelete}
                isDeleting={isDeleting}
              />
            ))}
          </RowList>
        </div>
      )}

      {incomeCategories.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2 text-muted-foreground">
            Categorias de Receita ({incomeCategories.length})
          </h3>
          <RowList>
            {incomeCategories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onEdit={onEdit}
                onDelete={onDelete}
                isDeleting={isDeleting}
              />
            ))}
          </RowList>
        </div>
      )}

      {bothCategories.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2 text-muted-foreground">
            Categorias Gerais ({bothCategories.length})
          </h3>
          <RowList>
            {bothCategories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onEdit={onEdit}
                onDelete={onDelete}
                isDeleting={isDeleting}
              />
            ))}
          </RowList>
        </div>
      )}
    </div>
  );
}
