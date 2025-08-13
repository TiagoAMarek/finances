"use client";

import type { NextPage } from 'next';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useTransactions } from '@/hooks/useTransactions';
import { useAccounts } from '@/hooks/useAccounts';
import { useCreditCards } from '@/hooks/useCreditCards';
import { PageHeader } from '@/components/PageHeader';
import { QuickCreateButton } from '@/components/QuickCreateButton';
import { CreateTransactionModal } from './_components/CreateTransactionModal';
import { EditTransactionModal } from './_components/EditTransactionModal';
import { TransactionsList } from './_components/TransactionsList';
import { TransactionFiltersComponent } from './_components/TransactionFilters';
import { useTransactionActions } from './_hooks/useTransactionActions';
import { useTransactionFilters } from './_hooks/useTransactionFilters';

const TransactionsPage: NextPage = () => {
  const { data: transactions = [], isLoading: isLoadingTransactions, isError: isErrorTransactions, error: transactionsError } = useTransactions();
  const { isLoading: isLoadingAccounts, isError: isErrorAccounts, error: accountsError } = useAccounts();
  const { isLoading: isLoadingCreditCards, isError: isErrorCreditCards, error: creditCardsError } = useCreditCards();
  
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

  const isPageLoading = isLoadingTransactions || isLoadingAccounts || isLoadingCreditCards;
  const isPageError = isErrorTransactions || isErrorAccounts || isErrorCreditCards;
  const pageError = transactionsError || accountsError || creditCardsError;

  if (isPageLoading) {
    return (
      <>
        <PageHeader
          title="Lançamentos"
          description="Gerencie suas receitas, despesas e transferências"
          action={<Skeleton className="h-9 w-32" />}
        />
        <div className="p-4 lg:p-6">
          <TransactionsList
            transactions={[]}
            isLoading={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={false}
          />
        </div>
      </>
    );
  }

  if (isPageError) {
    return (
      <>
        <PageHeader
          title="Lançamentos"
          description="Gerencie suas receitas, despesas e transferências"
          action={
            <QuickCreateButton onClick={() => setCreateModalOpen(true)}>
              Novo Lançamento
            </QuickCreateButton>
          }
        />
        <div className="flex items-center justify-center min-h-screen p-4 lg:p-6">
          <Alert variant="destructive" className="max-w-md">
            <AlertDescription>Erro: {pageError?.message}</AlertDescription>
          </Alert>
        </div>
      </>
    );
  }


  return (
    <>
      <PageHeader
        title="Lançamentos"
        description="Gerencie suas receitas, despesas e transferências"
        action={
          <QuickCreateButton onClick={() => setCreateModalOpen(true)}>
            Novo Lançamento
          </QuickCreateButton>
        }
      />
      <div className="p-4 lg:p-6">
        {pageError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{pageError.message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          <TransactionFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            categories={categories}
          />

          <TransactionsList
            transactions={filteredTransactions}
            isLoading={isPageLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={isLoading.delete}
            isFiltered={hasActiveFilters}
            totalCount={transactions.length}
          />
        </div>

        <CreateTransactionModal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          onSubmit={handleCreate}
          isLoading={isLoading.create}
        />

        <EditTransactionModal
          transaction={editingTransaction}
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          onSave={handleUpdate}
          isLoading={isLoading.update}
        />
      </div>
    </>
  );
};

export default TransactionsPage;
