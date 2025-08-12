import { useState } from "react";
import { toast } from "sonner";
import { useCreateTransaction, useUpdateTransaction, useDeleteTransaction } from "@/hooks/useTransactions";
import { Transaction } from "@/lib/schemas";

interface CreateTransactionData {
  description: string;
  amount: string;
  type: 'income' | 'expense' | 'transfer';
  date: string;
  category: string;
  accountId?: number;
  creditCardId?: number;
}

export function useTransactionActions() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const createTransactionMutation = useCreateTransaction();
  const updateTransactionMutation = useUpdateTransaction();
  const deleteTransactionMutation = useDeleteTransaction();

  const handleCreate = async (data: CreateTransactionData) => {
    try {
      await createTransactionMutation.mutateAsync(data);
      toast.success("Lançamento criado com sucesso!");
      setCreateModalOpen(false);
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Erro ao criar lançamento.');
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditModalOpen(true);
  };

  const handleUpdate = async (transaction: Transaction) => {
    try {
      await updateTransactionMutation.mutateAsync(transaction);
      toast.success("Lançamento atualizado com sucesso!");
      setEditModalOpen(false);
      setEditingTransaction(null);
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Erro ao atualizar lançamento.');
    }
  };

  const handleDelete = async (transactionId: number) => {
    try {
      await deleteTransactionMutation.mutateAsync(transactionId);
      toast.success("Lançamento excluído com sucesso!");
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Erro ao excluir lançamento.');
    }
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
    editingTransaction,
  };
}