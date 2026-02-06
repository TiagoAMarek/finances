import { useState } from "react";
import { toast } from "sonner";

import { TransactionCreateInput, TransactionFormInput, TransactionCreateSchema } from "@/lib/schemas";
import { Transaction } from "@/lib/schemas";

import {
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from "../data";

/**
 * Hook for managing transaction actions and UI state
 * Orchestrates modal states and user interactions
 */
export function useTransactionActions() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const createTransactionMutation = useCreateTransaction();
  const updateTransactionMutation = useUpdateTransaction();
  const deleteTransactionMutation = useDeleteTransaction();

  const createTransaction = async (data: TransactionFormInput) => {
    // Remove UI-only fields before API validation
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { sourceType: _, ...apiData } = data;

    // Validate against the create schema before submitting
    const parseResult = TransactionCreateSchema.safeParse(apiData);

    if (!parseResult.success) {
      // If validation fails, show the first error and reject
      const firstError = parseResult.error.issues[0];
      toast.error(firstError.message);
      return Promise.reject(new Error(firstError.message));
    }

    const createInput: TransactionCreateInput = parseResult.data;
    
    return new Promise<void>((resolve, reject) => {
      createTransactionMutation.mutate(createInput, {
        onSuccess: () => {
          toast.success("Transação criada com sucesso!");
          setCreateModalOpen(false);
          resolve();
        },
        onError: (error) => {
          toast.error(error.message);
          reject(error);
        },
      });
    });
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditModalOpen(true);
  };

  const handleUpdate = async (transaction: Transaction) => {
    updateTransactionMutation.mutate(transaction, {
      onSuccess: () => {
        toast.success("Transação atualizada com sucesso!");
        setEditModalOpen(false);
        setEditingTransaction(null);
      },
    });
  };

  const handleDelete = async (transactionId: number) => {
    deleteTransactionMutation.mutate(transactionId, {
      onSuccess: () => {
        toast.success("Transação excluída com sucesso!");
      },
    });
  };

  const errors = {
    create: createTransactionMutation.error,
    update: updateTransactionMutation.error,
    delete: deleteTransactionMutation.error,
  };

  const isLoading = {
    create: createTransactionMutation.isPending,
    update: updateTransactionMutation.isPending,
    delete: deleteTransactionMutation.isPending,
  };

  const isCreating = createTransactionMutation.isPending;

  return {
    createTransaction,
    handleCreate: createTransaction, // Alias for backward compatibility
    handleEdit,
    handleUpdate,
    handleDelete,
    errors,
    isLoading,
    isCreating,
    createModalOpen,
    setCreateModalOpen,
    editModalOpen,
    setEditModalOpen,
    editingTransaction,
  };
}
