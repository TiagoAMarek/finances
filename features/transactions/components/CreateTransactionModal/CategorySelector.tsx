import { useMemo, useEffect } from "react";
import { UseFormReturn, Controller, useWatch } from "react-hook-form";

import { FormModalField } from "@/features/shared/components/FormModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shared/components/ui";
import { TransactionFormInput } from "@/lib/schemas";

interface Category {
  id: number;
  name: string;
  type: "income" | "expense" | "both";
  color?: string | null;
  icon?: string | null;
}

interface CategorySelectorProps {
  form: UseFormReturn<TransactionFormInput>;
  categories: Category[];
}

export function CategorySelector({ form, categories }: CategorySelectorProps) {
  const { setValue } = form;
  
  const watchedType = useWatch({
    control: form.control,
    name: "type",
  });

  const watchedCategoryId = useWatch({
    control: form.control,
    name: "categoryId",
  });

  // Memoized category filtering to prevent unnecessary recalculations
  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      if (category.type === "both") return true;
      return category.type === watchedType;
    });
  }, [categories, watchedType]);

  // Reset category when type changes and current category is not valid
  useEffect(() => {
    if (watchedCategoryId) {
      const currentCategory = categories.find(
        (cat) => cat.id === watchedCategoryId,
      );
      if (
        currentCategory &&
        currentCategory.type !== "both" &&
        currentCategory.type !== watchedType
      ) {
        setValue("categoryId", undefined);
      }
    }
  }, [watchedType, categories, watchedCategoryId, setValue]);

  return (
    <FormModalField
      form={form}
      label="Categoria"
      name="categoryId"
      required
    >
      <div>
        <Controller
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <Select
              value={field.value?.toString() || ""}
              onValueChange={(value) =>
                field.onChange(value ? parseInt(value) : undefined)
              }
            >
              <SelectTrigger className="h-11 w-full min-w-0 text-left">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: category.color || "#64748b",
                        }}
                      />
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {filteredCategories.length === 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            Nenhuma categoria disponível para este tipo de transação.
          </p>
        )}
      </div>
    </FormModalField>
  );
}
