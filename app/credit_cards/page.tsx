"use client";

import type { NextPage } from "next";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCreditCards } from "@/features/credit-cards/hooks/data";
import { PageHeader } from "@/components/PageHeader";
import { useCreditCardActions } from "@/features/credit-cards/hooks/ui";
import { CreateCardModal } from "./_components/CreateCardModal";
import { EditCardModal } from "./_components/EditCardModal";
import { CreditCardsList } from "./_components/CreditCardsList";
import { CreditCard } from "lucide-react";

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
        <div className="space-y-6 px-4 lg:px-6 pb-4 lg:pb-6">
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

      <div className="space-y-6 px-4 lg:px-6 pb-4 lg:pb-6">
        {/* Error Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        {errors.create && (
          <Alert variant="destructive">
            <AlertDescription>{errors.create.message}</AlertDescription>
          </Alert>
        )}
        {errors.update && (
          <Alert variant="destructive">
            <AlertDescription>{errors.update.message}</AlertDescription>
          </Alert>
        )}
        {errors.delete && (
          <Alert variant="destructive">
            <AlertDescription>{errors.delete.message}</AlertDescription>
          </Alert>
        )}

        {/* Edit Modal */}
        <EditCardModal
          card={editingCard}
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          onSave={handleUpdate}
          isLoading={actionLoading.update}
        />

        {/* Cards List */}
        <CreditCardsList
          cards={creditCards}
          isLoading={false}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={actionLoading.delete}
        />
      </div>
    </>
  );
};

export default CreditCardsPage;
