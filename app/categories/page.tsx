"use client";

import {
  useCategoryActions,
  useGetCategoriesWithStats,
} from "@/features/categories";
import {
  CategoriesList,
  CreateCategoryModal,
  EditCategoryModal,
  EmptyState,
  ListHeader,
} from "@/features/categories/components";
import { PageHeader } from "@/features/shared/components";
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  ToggleGroup,
  ToggleGroupItem,
} from "@/features/shared/components/ui";
import { AlertCircle, Filter, Tag } from "lucide-react";
import { useMemo, useState } from "react";

export default function CategoriesPage() {
  const {
    data: categories,
    isLoading,
    error,
    refetch,
  } = useGetCategoriesWithStats();
  const {
    isCreateModalOpen,
    isEditModalOpen,
    editingCategoryId,
    isCreating,
    isUpdating,
    isDeleting,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
  } = useCategoryActions();

  const editingCategory =
    categories?.find((cat) => cat.id === editingCategoryId) || null;

  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  const filtered = useMemo(() => {
    if (!categories) return [];
    if (filter === "all") return categories;
    return categories.filter((c) => c.type === filter);
  }, [categories, filter]);

  const getFilterCount = (type: typeof filter) => {
    if (!categories) return 0;
    if (type === "all") return categories.length;
    return categories.filter((c) => c.type === type).length;
  };

  const filterControl = (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtrar Categorias
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ToggleGroup
          type="single"
          value={filter}
          onValueChange={(v) => v && setFilter(v as typeof filter)}
          aria-label="Filtrar categorias por tipo"
          className="h-11 sm:h-9 w-full grid grid-cols-3 gap-0 border border-border rounded-md overflow-hidden"
        >
          <ToggleGroupItem
            value="all"
            aria-label={`Mostrar todas as categorias (${getFilterCount("all")})`}
            className="min-w-0 text-xs sm:text-sm font-medium border-r border-border last:border-r-0 px-2 sm:px-3 h-full flex items-center justify-center"
          >
            <span className="truncate">
              <span className="sm:hidden">Todas</span>
              <span className="hidden sm:inline">
                Todas ({getFilterCount("all")})
              </span>
            </span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="income"
            aria-label={`Mostrar apenas receitas (${getFilterCount("income")})`}
            className="min-w-0 text-xs sm:text-sm font-medium border-r border-border last:border-r-0 px-2 sm:px-3 h-full flex items-center justify-center"
          >
            <span className="truncate">
              <span className="sm:hidden">Receitas</span>
              <span className="hidden sm:inline">
                Receitas ({getFilterCount("income")})
              </span>
            </span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="expense"
            aria-label={`Mostrar apenas despesas (${getFilterCount("expense")})`}
            className="min-w-0 text-xs sm:text-sm font-medium border-r border-border last:border-r-0 px-2 sm:px-3 h-full flex items-center justify-center"
          >
            <span className="truncate">
              <span className="sm:hidden">Despesas</span>
              <span className="hidden sm:inline">
                Despesas ({getFilterCount("expense")})
              </span>
            </span>
          </ToggleGroupItem>
        </ToggleGroup>
      </CardContent>
    </Card>
  );

  return (
    <>
      <PageHeader
        title="Categorias"
        description="Gerencie suas categorias de transações"
        icon={Tag}
        iconColor="text-blue-500"
        action={
          <CreateCategoryModal
            open={isCreateModalOpen}
            onOpenChange={(open) =>
              open ? openCreateModal() : closeCreateModal()
            }
            onSubmit={handleCreateCategory}
            isLoading={isCreating}
          />
        }
      />

      <div className="space-y-8 px-4 lg:px-6 pb-8">
        {/* Filter Controls */}
        <div className="grid grid-cols-1 gap-6">{filterControl}</div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between gap-4">
              <span>
                Erro ao carregar categorias. Tente novamente mais tarde.
              </span>
              {refetch && (
                <Button size="sm" variant="secondary" onClick={() => refetch()}>
                  Tentar novamente
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="space-y-6">
            {/* Categories skeleton - list format */}
            <div>
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="border border-border rounded-lg overflow-hidden">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-4 p-4 border-b border-border/50 ${i === 5 ? "border-b-0" : ""}`}
                  >
                    <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <Skeleton className="h-4 w-32 mb-2" />
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-24 rounded-full" />
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Skeleton className="h-8 w-8 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Nenhuma categoria ainda"
            description="Crie categorias para organizar suas receitas e despesas."
          >
            <CreateCategoryModal
              open={isCreateModalOpen}
              onOpenChange={(open) =>
                open ? openCreateModal() : closeCreateModal()
              }
              onSubmit={handleCreateCategory}
              isLoading={isCreating}
            />
          </EmptyState>
        ) : (
          <>
            <ListHeader
              title="Todas as categorias"
              count={filtered.length}
              right={null}
            />
            <CategoriesList
              categories={filtered || []}
              onEdit={openEditModal}
              onDelete={handleDeleteCategory}
              isDeleting={isDeleting}
            />
          </>
        )}

        <EditCategoryModal
          open={isEditModalOpen}
          onOpenChange={closeEditModal}
          category={editingCategory}
          onSubmit={(data) => {
            if (editingCategoryId && editingCategory) {
              handleUpdateCategory(editingCategoryId, data);
            }
          }}
          isLoading={isUpdating}
        />
      </div>
    </>
  );
}
