import { useState } from "react";
import { toast } from "sonner";
import { useCreateAccount, useUpdateAccount, useDeleteAccount } from "@/hooks/useAccounts";
import { BankAccount } from "@/lib/schemas";

export function useAccountActions() {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const createAccountMutation = useCreateAccount();
  const updateAccountMutation = useUpdateAccount();
  const deleteAccountMutation = useDeleteAccount();

  const handleCreate = async (data: { name: string; balance: string; currency: string }) => {
    createAccountMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Conta criada com sucesso!");
        setCreateModalOpen(false);
      },
    });
  };

  const handleUpdate = async (account: BankAccount) => {
    updateAccountMutation.mutate(account, {
      onSuccess: () => {
        toast.success("Conta atualizada com sucesso!");
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
    handleUpdate,
    handleDelete,
    errors,
    isLoading,
    createModalOpen,
    setCreateModalOpen,
  };
}