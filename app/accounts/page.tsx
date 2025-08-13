"use client";

import type { NextPage } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccounts } from "@/hooks/useAccounts";
import { PageHeader } from "@/components/PageHeader";
import { CreateAccountModal } from "./_components/CreateAccountModal";
import { EditAccountModal } from "./_components/EditAccountModal";
import { AccountsList } from "./_components/AccountsList";
import { ErrorAlerts } from "./_components/ErrorAlerts";
import { useAccountActions } from "./_hooks/useAccountActions";

const AccountsPage: NextPage = () => {
  const { data: accounts = [], isLoading, error } = useAccounts();
  const {
    handleCreate,
    handleEdit,
    handleUpdate,
    handleDelete,
    errors,
    isLoading: actionLoading,
    createModalOpen,
    setCreateModalOpen,
    editModalOpen,
    setEditModalOpen,
    editingAccount,
  } = useAccountActions();

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Minhas Contas Bancárias"
          description="Gerencie suas contas bancárias e saldos"
          action={<Skeleton className="h-9 w-28" />}
        />
        <div className="space-y-6 px-4 lg:px-6 pb-4 lg:pb-6">
          <AccountsList
            accounts={[]}
            isLoading={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
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

      <div className="space-y-6 px-4 lg:px-6 pb-4 lg:pb-6">
        <ErrorAlerts errors={{ ...errors, general: error }} />

        <AccountsList
          accounts={accounts}
          isLoading={false}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={actionLoading.delete}
        />

        <EditAccountModal
          account={editingAccount}
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          onSave={handleUpdate}
          isLoading={actionLoading.update}
        />
      </div>
    </>
  );
};

export default AccountsPage;