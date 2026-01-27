"use client";

import { ArrowLeftRight } from "lucide-react";
import type { NextPage } from "next";

import { useGetAccounts } from "@/features/accounts/hooks/data/useGetAccounts";
import { useAuthGuard } from "@/features/auth/hooks";
import { useGetCreditCards } from "@/features/credit-cards/hooks/data/useGetCreditCards";
import { PageHeader, QuickCreateButton } from "@/features/shared/components";
import {
  Alert,
  AlertDescription,
  Skeleton,
} from "@/features/shared/components/ui";
import {
  CreateTransactionModal,
  EditTransactionModal,
  TransactionFiltersComponent,
  TransactionsList,
} from "@/features/transactions/components";
import { useGetTransactions } from "@/features/transactions/hooks/data/useGetTransactions";
import {
  useTransactionActions,
  useTransactionFilters,
} from "@/features/transactions/hooks/ui";

const TransactionsPage: NextPage = () => {
  useAuthGuard();
  const {
    data: transactions = [],
    isLoading: isLoadingTransactions,
    isError: isErrorTransactions,
    error: transactionsError,
  } = useGetTransactions();
  const {
    isLoading: isLoadingAccounts,
    isError: isErrorAccounts,
    error: accountsError,
  } = useGetAccounts();
  const {
    isLoading: isLoadingCreditCards,
    isError: isErrorCreditCards,
    error: creditCardsError,
  } = useGetCreditCards();

  const {
    handleCreate,
    handleEdit,
    handleUpdate,
    handleDelete,
    isLoading,
    createModalOpen,
    setCreateModalOpen,
    editModalOpen,
    setEditModalOpen,
    editingTransaction,
  } = useTransactionActions();

  const {
    filters,
    setFilters,
    categories,
    filteredTransactions,
    hasActiveFilters,
  } = useTransactionFilters(transactions);

  const isPageLoading =
    isLoadingTransactions || isLoadingAccounts || isLoadingCreditCards;
  const isPageError =
    isErrorTransactions || isErrorAccounts || isErrorCreditCards;
  const pageError = transactionsError || accountsError || creditCardsError;

  if (isPageLoading) {
    return (
      <>
        <PageHeader
          action={<Skeleton className="h-9 w-32" />}
          description="Gerencie suas receitas, despesas e transferências"
          title="Lançamentos"
        />
        <div className="space-y-8 px-4 lg:px-6 pb-8">
          <TransactionsList
            isDeleting={false}
            isLoading={true}
            transactions={[]}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>
      </>
    );
  }

  if (isPageError) {
    return (
      <>
        <PageHeader
          action={
            <QuickCreateButton onClick={() => setCreateModalOpen(true)}>
              Novo Lançamento
            </QuickCreateButton>
          }
          description="Gerencie suas receitas, despesas e transferências"
          title="Lançamentos"
        />
        <div className="flex items-center justify-center min-h-screen p-4 lg:p-6">
          <Alert className="max-w-md" variant="destructive">
            <AlertDescription>Erro: {pageError?.message}</AlertDescription>
          </Alert>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        action={
          <QuickCreateButton
            data-testid="open-create-transaction"
            onClick={() => setCreateModalOpen(true)}
          >
            Novo Lançamento
          </QuickCreateButton>
        }
        description="Gerencie suas receitas, despesas e transferências"
        icon={ArrowLeftRight}
        iconColor="text-purple-500"
        title="Lançamentos"
      />
      <div className="space-y-8 px-4 lg:px-6 pb-8">
        {pageError && (
          <Alert className="mb-6" variant="destructive">
            <AlertDescription>{pageError.message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-8">
          <TransactionFiltersComponent
            categories={categories}
            filters={filters}
            onFiltersChange={setFilters}
          />

          <TransactionsList
            isDeleting={isLoading.delete}
            isFiltered={hasActiveFilters}
            isLoading={isPageLoading}
            totalCount={transactions.length}
            transactions={filteredTransactions}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>

        <CreateTransactionModal
          isLoading={isLoading.create}
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          onSubmit={handleCreate}
        />

        <EditTransactionModal
          isLoading={isLoading.update}
          open={editModalOpen}
          transaction={editingTransaction}
          onOpenChange={setEditModalOpen}
          onSave={handleUpdate}
        />
      </div>
    </>
  );
};

export default TransactionsPage;
