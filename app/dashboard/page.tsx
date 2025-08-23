"use client";

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
import { BarChart3 } from "lucide-react";
import type { NextPage } from "next";
import { useCallback, useState } from "react";

const DashboardPage: NextPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { createTransaction, isCreating } = useTransactionActions();

  // Use centralized dashboard data hook
  const dashboardData = useDashboardData();

  const handleCreateTransaction = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleCreateTransactionSubmit = useCallback(
    async (data: {
      description: string;
      amount: string;
      type: "income" | "expense" | "transfer";
      date: string;
      categoryId: number;
      accountId?: number;
      creditCardId?: number;
    }) => {
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
        title="Dashboard"
        description="Visão geral das suas finanças e transações recentes"
        icon={BarChart3}
        iconColor="text-orange-500"
        action={
          <QuickCreateButton onClick={handleCreateTransaction}>
            Novo Lançamento
          </QuickCreateButton>
        }
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
          transactions={dashboardData.transactions}
          monthlyMetrics={dashboardData.monthlyMetrics}
        />
      </div>

      <CreateTransactionModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateTransactionSubmit}
        isLoading={isCreating}
      />
    </>
  );
};

export default DashboardPage;
