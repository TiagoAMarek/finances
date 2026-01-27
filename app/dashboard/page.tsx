"use client";

import { BarChart3 } from "lucide-react";
import type { NextPage } from "next";
import { useCallback, useState } from "react";

import {
  DashboardMetricsGrid,
  DashboardSkeletonLoader,
  ReportsAccordion,
  ResourcesAccordion,
} from "@/features/dashboard/components";
import { useDashboardData } from "@/features/dashboard/hooks/ui/useDashboardData";
import { PageHeader, QuickCreateButton } from "@/features/shared/components";
import { CreateTransactionModal } from "@/features/transactions/components";
import { useTransactionActions } from "@/features/transactions/hooks/ui/useTransactionActions";
import { TransactionCreateInput } from "@/lib/schemas";

const DashboardPage: NextPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { createTransaction, isCreating } = useTransactionActions();

  // Use centralized dashboard data hook
  const dashboardData = useDashboardData();

  const handleCreateTransaction = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleCreateTransactionSubmit = useCallback(
    async (data: TransactionCreateInput) => {
      await createTransaction(data);
      setIsCreateModalOpen(false);
    },
    [createTransaction],
  );

  if (dashboardData.isLoading) {
    return <DashboardSkeletonLoader />;
  }

  return (
    <>
      <PageHeader
        action={
          <QuickCreateButton onClick={handleCreateTransaction}>
            Novo Lançamento
          </QuickCreateButton>
        }
        description="Visão geral das suas finanças e transações recentes"
        icon={BarChart3}
        iconColor="text-orange-500"
        title="Dashboard"
      />

      <div className="space-y-8 px-4 lg:px-6 pb-8">
        {/* Metrics Cards */}
        <DashboardMetricsGrid
          monthlyMetrics={dashboardData.monthlyMetrics}
          totalBalance={dashboardData.totalBalance}
        />

        {/* Resources Section */}
        <ResourcesAccordion
          accounts={dashboardData.accounts}
          creditCards={dashboardData.creditCards}
          totalBalance={dashboardData.totalBalance}
        />

        {/* Reports Section */}
        <ReportsAccordion
          monthlyMetrics={dashboardData.monthlyMetrics}
          transactions={dashboardData.transactions}
        />
      </div>

      <CreateTransactionModal
        isLoading={isCreating}
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateTransactionSubmit}
      />
    </>
  );
};

export default DashboardPage;
