import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../data";
import { CategoryCreateInput, CategoryUpdateInput } from "@/lib/schemas";

/**
 * Hook for handling category actions with UI feedback
 */
export const useCategoryActions = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const handleCreateCategory = async (data: CategoryCreateInput) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Categoria criada com sucesso!");
      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao criar categoria");
    }
  };

  const handleUpdateCategory = async (id: number, data: CategoryUpdateInput) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      toast.success("Categoria atualizada com sucesso!");
      setIsEditModalOpen(false);
      setEditingCategoryId(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar categoria");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Categoria excluída com sucesso!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao excluir categoria");
    }
  };

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const openEditModal = (categoryId: number) => {
    setEditingCategoryId(categoryId);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingCategoryId(null);
  };

  return {
    // State
    isCreateModalOpen,
    isEditModalOpen,
    editingCategoryId,
    
    // Loading states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Actions
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    
    // Modal controls
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
  };
};