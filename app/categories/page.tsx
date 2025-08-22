"use client";

import { PageHeader } from "@/components/PageHeader";
import { CreateCategoryModal } from "./_components/CreateCategoryModal";
import { EditCategoryModal } from "./_components/EditCategoryModal";
import { CategoriesList } from "./_components/CategoriesList";
import { useGetCategories, useCategoryActions } from "@/features/categories";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function CategoriesPage() {
  const { data: categories, isLoading, error } = useGetCategories();
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
    closeCreateModal,
    openEditModal,
    closeEditModal,
  } = useCategoryActions();

  const editingCategory =
    categories?.find((cat) => cat.id === editingCategoryId) || null;

  if (error) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <PageHeader
          title="Categorias"
          description="Gerencie suas categorias de transações"
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar categorias. Tente novamente mais tarde.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Categorias"
        description="Gerencie suas categorias de transações"
        action={
          <CreateCategoryModal
            open={isCreateModalOpen}
            onOpenChange={closeCreateModal}
            onSubmit={handleCreateCategory}
            isLoading={isCreating}
          />
        }
      />

      {isLoading ? (
        <div className="space-y-6">
          <div>
            <Skeleton className="h-6 w-48 mb-3" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="w-8 h-8" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <CategoriesList
          categories={categories || []}
          onEdit={openEditModal}
          onDelete={handleDeleteCategory}
          isDeleting={isDeleting}
        />
      )}

      <EditCategoryModal
        open={isEditModalOpen}
        onOpenChange={closeEditModal}
        category={editingCategory}
        onSubmit={(data) => {
          if (editingCategoryId) {
            handleUpdateCategory(editingCategoryId, data);
          }
        }}
        isLoading={isUpdating}
      />
    </div>
  );
}
