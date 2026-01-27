"use client";

import { CreditCard } from "lucide-react";
import type { NextPage } from "next";

import { useAuthGuard } from "@/features/auth/hooks";
import {
  CreateCardModal,
  CreditCardsList,
  EditCardModal,
  ErrorAlerts,
} from "@/features/credit-cards/components";
import { useGetCreditCards } from "@/features/credit-cards/hooks/data";
import { useCreditCardActions } from "@/features/credit-cards/hooks/ui";
import { PageHeader } from "@/features/shared/components";
import { Skeleton } from "@/features/shared/components/ui";

const CreditCardsPage: NextPage = () => {
  useAuthGuard();
  const { data: creditCards = [], isLoading, error } = useGetCreditCards();
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
    editingCard,
  } = useCreditCardActions();

  if (isLoading) {
    return (
      <>
        <PageHeader
          action={<Skeleton className="h-9 w-28" />}
          description="Gerencie seus cartões de crédito e limites"
          title="Meus Cartões de Crédito"
        />
        <div className="space-y-8 px-4 lg:px-6 pb-8">
          <CreditCardsList
            cards={[]}
            isDeleting={actionLoading.delete}
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
          <CreateCardModal
            isLoading={actionLoading.create}
            open={createModalOpen}
            onOpenChange={setCreateModalOpen}
            onSubmit={handleCreate}
          />
        }
        description="Gerencie seus cartões de crédito e limites"
        icon={CreditCard}
        iconColor="text-indigo-500"
        title="Meus Cartões de Crédito"
      />

      <div className="space-y-8 px-4 lg:px-6 pb-8">
        <ErrorAlerts errors={{ ...errors, general: error }} />

        <CreditCardsList
          cards={creditCards}
          isDeleting={actionLoading.delete}
          isLoading={false}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

        <EditCardModal
          card={editingCard}
          isLoading={actionLoading.update}
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          onSave={handleUpdate}
        />
      </div>
    </>
  );
};

export default CreditCardsPage;
