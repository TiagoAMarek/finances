"use client";

import { CreditCard, Upload } from "lucide-react";
import type { NextPage } from "next";

import {
  CreateCardModal,
  CreditCardsList,
  EditCardModal,
  ErrorAlerts,
  ImportStatementModal,
  StatementsList,
  StatementDetailsModal,
} from "@/features/credit-cards/components";
import { useGetCreditCards, useGetStatements } from "@/features/credit-cards/hooks/data";
import { useCreditCardActions, useStatementActions } from "@/features/credit-cards/hooks/ui";
import { PageHeader } from "@/features/shared/components";
import { Skeleton, Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@/features/shared/components/ui";

const CreditCardsPage: NextPage = () => {
  const { data: creditCards = [], isLoading, error } = useGetCreditCards();
  const { data: statementsData, isLoading: isLoadingStatements } = useGetStatements();
  
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

  const {
    isImportModalOpen,
    isDetailsModalOpen,
    selectedStatementId,
    isUploading,
    isImporting,
    handleUpload,
    handleImport,
    openImportModal,
    closeImportModal,
    openDetailsModal,
    closeDetailsModal,
  } = useStatementActions();

  const statements = statementsData?.data || [];

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
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={openImportModal}
            >
              <Upload className="h-4 w-4 mr-2" />
              Importar Fatura
            </Button>
            <CreateCardModal
              isLoading={actionLoading.create}
              open={createModalOpen}
              onOpenChange={setCreateModalOpen}
              onSubmit={handleCreate}
            />
          </div>
        }
        description="Gerencie seus cartões de crédito e faturas"
        icon={CreditCard}
        iconColor="text-indigo-500"
        title="Meus Cartões de Crédito"
      />

      <div className="space-y-8 px-4 lg:px-6 pb-8">
        <ErrorAlerts errors={{ ...errors, general: error }} />

        <Tabs defaultValue="cards" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="cards">Cartões</TabsTrigger>
            <TabsTrigger value="statements">Faturas</TabsTrigger>
          </TabsList>

          <TabsContent value="cards" className="mt-6">
            <CreditCardsList
              cards={creditCards}
              isDeleting={actionLoading.delete}
              isLoading={false}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </TabsContent>

          <TabsContent value="statements" className="mt-6">
            <StatementsList
              statements={statements}
              isLoading={isLoadingStatements}
              onViewStatement={openDetailsModal}
            />
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <EditCardModal
          card={editingCard}
          isLoading={actionLoading.update}
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          onSave={handleUpdate}
        />

        <ImportStatementModal
          isOpen={isImportModalOpen}
          onClose={closeImportModal}
          onSubmit={handleUpload}
          isLoading={isUploading}
        />

        <StatementDetailsModal
          statementId={selectedStatementId}
          isOpen={isDetailsModalOpen}
          onClose={closeDetailsModal}
          onImport={handleImport}
          isImporting={isImporting}
        />
      </div>
    </>
  );
};

export default CreditCardsPage;
