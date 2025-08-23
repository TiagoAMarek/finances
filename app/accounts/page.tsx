"use client";

import {
  AccountsList,
  AccountsMetricsGrid,
  CreateAccountModal,
  EditAccountModal,
  ErrorAlerts,
} from "@/features/accounts/components";
import { useGetAccounts } from "@/features/accounts/hooks/data";
import { useAccountActions } from "@/features/accounts/hooks/ui";
import { PageHeader } from "@/features/shared/components";
import { Skeleton } from "@/features/shared/components/ui";
import { Banknote } from "lucide-react";
import type { NextPage } from "next";

const AccountsPage: NextPage = () => {
  const { data: accounts = [], isLoading, error } = useGetAccounts();
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
        <div className="space-y-8 px-4 lg:px-6 pb-8">
          {/* Metrics Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32">
                <Skeleton className="h-full w-full" />
              </div>
            ))}
          </div>

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
        icon={Banknote}
        iconColor="text-green-500"
        action={
          <CreateAccountModal
            open={createModalOpen}
            onOpenChange={setCreateModalOpen}
            onSubmit={handleCreate}
            isLoading={actionLoading.create}
          />
        }
      />

      <div className="space-y-8 px-4 lg:px-6 pb-8">
        <ErrorAlerts errors={{ ...errors, general: error }} />

        {/* Metrics Cards */}
        <AccountsMetricsGrid accounts={accounts} />

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
