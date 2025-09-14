import { useState } from "react";
import { toast } from "sonner";

import { CreditCard } from "@/lib/schemas";

import {
  useCreateCreditCard,
  useUpdateCreditCard,
  useDeleteCreditCard,
} from "../data";

/**
 * Hook for managing credit card actions and UI state
 * Orchestrates modal states and user interactions
 */
export function useCreditCardActions() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);

  const createCardMutation = useCreateCreditCard();
  const updateCardMutation = useUpdateCreditCard();
  const deleteCardMutation = useDeleteCreditCard();

  const handleCreate = async (data: {
    name: string;
    limit: string;
    currentBill: string;
  }) => {
    createCardMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Cartão criado com sucesso!");
        setCreateModalOpen(false);
      },
    });
  };

  const handleEdit = (card: CreditCard) => {
    setEditingCard(card);
    setEditModalOpen(true);
  };

  const handleUpdate = async (card: CreditCard) => {
    updateCardMutation.mutate(card, {
      onSuccess: () => {
        toast.success("Cartão atualizado com sucesso!");
        setEditModalOpen(false);
        setEditingCard(null);
      },
    });
  };

  const handleDelete = async (cardId: number) => {
    deleteCardMutation.mutate(cardId, {
      onSuccess: () => {
        toast.success("Cartão excluído com sucesso!");
      },
    });
  };

  const errors = {
    create: createCardMutation.error,
    update: updateCardMutation.error,
    delete: deleteCardMutation.error,
  };

  const isLoading = {
    create: createCardMutation.isPending,
    update: updateCardMutation.isPending,
    delete: deleteCardMutation.isPending,
  };

  return {
    handleCreate,
    handleEdit,
    handleUpdate,
    handleDelete,
    errors,
    isLoading,
    createModalOpen,
    setCreateModalOpen,
    editModalOpen,
    setEditModalOpen,
    editingCard,
  };
}
