import { useState } from "react";
import { toast } from "sonner";

import { BankAccount } from "@/lib/schemas";

import { useCreateAccount, useUpdateAccount, useDeleteAccount } from "../data";

/**
 * Hook for managing account actions and UI state
 * Orchestrates modal states and user interactions
 */
export function useAccountActions() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(
    null,
  );

  const createAccountMutation = useCreateAccount();
  const updateAccountMutation = useUpdateAccount();
  const deleteAccountMutation = useDeleteAccount();

  const handleCreate = async (data: { name: string; balance: string }) => {
    createAccountMutation.mutate(
      {
        ...data,
        currency: "BRL",
      },
      {
        onSuccess: () => {
          toast.success("Conta criada com sucesso!");
          setCreateModalOpen(false);
        },
      },
    );
  };

  const handleEdit = (account: BankAccount) => {
    setEditingAccount(account);
    setEditModalOpen(true);
  };

  const handleUpdate = async (account: BankAccount) => {
    updateAccountMutation.mutate(account, {
      onSuccess: () => {
        toast.success("Conta atualizada com sucesso!");
        setEditModalOpen(false);
        setEditingAccount(null);
      },
    });
  };

  const handleDelete = async (accountId: number) => {
    deleteAccountMutation.mutate(accountId, {
      onSuccess: () => {
        toast.success("Conta excluída com sucesso!");
      },
    });
  };

  const errors = {
    create: createAccountMutation.error,
    update: updateAccountMutation.error,
    delete: deleteAccountMutation.error,
  };

  const isLoading = {
    create: createAccountMutation.isPending,
    update: updateAccountMutation.isPending,
    delete: deleteAccountMutation.isPending,
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
    editingAccount,
  };
}
