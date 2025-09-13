import { useMemo } from "react";

interface Category {
  id: number;
  type: "income" | "expense" | "both";
}

interface UseCategoryFilteringProps {
  categories: Category[];
  transactionType: "income" | "expense" | "transfer";
}

interface UseCategoryFilteringReturn {
  filteredCategories: Category[];
}

export function useCategoryFiltering({
  categories,
  transactionType,
}: UseCategoryFilteringProps): UseCategoryFilteringReturn {
  // Memoized category filtering to prevent unnecessary recalculations
  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      if (category.type === "both") return true;
      return category.type === transactionType;
    });
  }, [categories, transactionType]);

  return {
    filteredCategories,
  };
}