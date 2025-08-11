"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccounts } from "@/hooks/useAccounts";
import { BankAccount } from "@/lib/schemas";
import { PageHeader } from "@/components/PageHeader";
import { CreateAccountModal } from "./_components/CreateAccountModal";
import { EditAccountCard } from "./_components/EditAccountCard";
import { AccountsList } from "./_components/AccountsList";
import { ErrorAlerts } from "./_components/ErrorAlerts";
import { useAccountActions } from "./_hooks/useAccountActions";

const AccountsPage: NextPage = () => {
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);

  const { data: accounts = [], isLoading, error } = useAccounts();
  const {
    handleCreate,
    handleUpdate,
    handleDelete,
    errors,
    isLoading: actionLoading,
    createModalOpen,
    setCreateModalOpen,
  } = useAccountActions();

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Minhas Contas Bancárias"
          description="Gerencie suas contas bancárias e saldos"
          action={<Skeleton className="h-9 w-28" />}
        />
        <div className="space-y-6 p-4 lg:p-6">
          <AccountsList
            accounts={[]}
            isLoading={true}
            onEdit={() => {}}
            onDelete={() => {}}
            isDeleting={false}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Minhas Contas Bancárias"
        description="Gerencie suas contas bancárias e saldos"
        action={
          <CreateAccountModal
            open={createModalOpen}
            onOpenChange={setCreateModalOpen}
            onSubmit={handleCreate}
            isLoading={actionLoading.create}
          />
        }
      />

      <div className="space-y-6 p-4 lg:p-6">
        <ErrorAlerts errors={{ ...errors, general: error }} />

        {editingAccount && (
          <EditAccountCard
            account={editingAccount}
            onSave={(account) => {
              handleUpdate(account);
              setEditingAccount(null);
            }}
            onCancel={() => setEditingAccount(null)}
            isLoading={actionLoading.update}
          />
        )}

        <AccountsList
          accounts={accounts}
          isLoading={false}
          onEdit={setEditingAccount}
          onDelete={handleDelete}
          isDeleting={actionLoading.delete}
        />
      </div>
    </>
  );
};

export default AccountsPage;