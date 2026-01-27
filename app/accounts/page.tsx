"use client";

import { Banknote } from "lucide-react";
import type { NextPage } from "next";

import {
  AccountsList,
  AccountsMetricsGrid,
  CreateAccountModal,
  EditAccountModal,
  ErrorAlerts,
} from "@/features/accounts/components";
import { useGetAccounts } from "@/features/accounts/hooks/data";
import { useAccountActions } from "@/features/accounts/hooks/ui";
import { useAuthGuard } from "@/features/auth/hooks";
import { PageHeader } from "@/features/shared/components";
import { Skeleton } from "@/features/shared/components/ui";

const AccountsPage: NextPage = () => {
  useAuthGuard();
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
          action={<Skeleton className="h-9 w-28" />}
          description="Gerencie suas contas bancárias e saldos"
          title="Minhas Contas Bancárias"
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
            isDeleting={false}
            isLoading={true}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        action={
          <CreateAccountModal
            isLoading={actionLoading.create}
            open={createModalOpen}
            onOpenChange={setCreateModalOpen}
            onSubmit={handleCreate}
          />
        }
        description="Gerencie suas contas bancárias e saldos"
        icon={Banknote}
        iconColor="text-green-500"
        title="Minhas Contas Bancárias"
      />

      <div className="space-y-8 px-4 lg:px-6 pb-8">
        <ErrorAlerts errors={{ ...errors, general: error }} />

        {/* Metrics Cards */}
        <AccountsMetricsGrid accounts={accounts} />

        <AccountsList
          accounts={accounts}
          isDeleting={actionLoading.delete}
          isLoading={false}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

        <EditAccountModal
          account={editingAccount}
          isLoading={actionLoading.update}
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          onSave={handleUpdate}
        />
      </div>
    </>
  );
};

export default AccountsPage;
