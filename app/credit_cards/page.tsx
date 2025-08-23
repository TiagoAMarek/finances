"use client";

import { PageHeader } from "@/components/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCreditCards } from "@/features/credit-cards/hooks/data";
import { useCreditCardActions } from "@/features/credit-cards/hooks/ui";
import { CreditCard } from "lucide-react";
import type { NextPage } from "next";
import { CreateCardModal } from "./_components/CreateCardModal";
import { CreditCardsList } from "./_components/CreditCardsList";
import { EditCardModal } from "./_components/EditCardModal";
import { ErrorAlerts } from "./_components/ErrorAlerts";

const CreditCardsPage: NextPage = () => {
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
          title="Meus Cartões de Crédito"
          description="Gerencie seus cartões de crédito e limites"
          action={<Skeleton className="h-9 w-28" />}
        />
        <div className="space-y-8 px-4 lg:px-6 pb-8">
          <CreditCardsList
            cards={[]}
            isLoading={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={actionLoading.delete}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Meus Cartões de Crédito"
        description="Gerencie seus cartões de crédito e limites"
        icon={CreditCard}
        iconColor="text-indigo-500"
        action={
          <CreateCardModal
            open={createModalOpen}
            onOpenChange={setCreateModalOpen}
            onSubmit={handleCreate}
            isLoading={actionLoading.create}
          />
        }
      />

      <div className="space-y-8 px-4 lg:px-6 pb-8">
        <ErrorAlerts errors={{ ...errors, general: error }} />

        <CreditCardsList
          cards={creditCards}
          isLoading={false}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={actionLoading.delete}
        />

        <EditCardModal
          card={editingCard}
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          onSave={handleUpdate}
          isLoading={actionLoading.update}
        />
      </div>
    </>
  );
};

export default CreditCardsPage;
