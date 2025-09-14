import { AlertCircle, BarChart3, TrendingUp } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

import { useCurrentMonth } from "@/features/dashboard/hooks/ui";
import {
  MonthlyMetrics,
  formatDashboardCurrency,
  getBalanceBadgeVariant,
} from "@/features/dashboard/utils/dashboard-calculations";
import { IncomeVsExpenseChart } from "@/features/shared/components";
import { Button } from "@/features/shared/components/ui";
import { Transaction } from "@/lib/schemas";

import { DashboardAccordion } from "./DashboardAccordion";
import { FinancialInsights } from "./FinancialInsights";

/**
 * Props for ReportsAccordion component
 */
interface ReportsAccordionProps {
  transactions: Transaction[];
  monthlyMetrics: MonthlyMetrics;
}

/**
 * Reports accordion component for dashboard
 *
 * Features:
 * - Encapsulates financial insights and charts
 * - Uses reusable DashboardAccordionTrigger
 * - Dynamic badges based on monthly balance
 * - Integrated IncomeVsExpenseChart
 * - Action button for navigation
 * - Memoized for performance
 */
export const ReportsAccordion = memo<ReportsAccordionProps>(
  function ReportsAccordion({ transactions, monthlyMetrics }) {
    const { currentMonth, currentYear } = useCurrentMonth();

    const balanceIcon = monthlyMetrics.balance >= 0 ? TrendingUp : AlertCircle;

    const badges = [
      {
        label: formatDashboardCurrency(Math.abs(monthlyMetrics.balance)),
        variant: getBalanceBadgeVariant(monthlyMetrics.balance),
        icon: balanceIcon,
      },
      {
        label: `${monthlyMetrics.transactionCount} transações`,
        variant: "outline" as const,
        hideOnMobile: true,
      },
    ];

    const actionButton = (
      <Button asChild className="hidden md:flex" size="sm" variant="outline">
        <Link className="flex items-center gap-1 text-xs" href="/reports">
          Ver Completos
        </Link>
      </Button>
    );

    return (
      <DashboardAccordion
        actionButton={actionButton}
        badges={badges}
        defaultValue="reports"
        icon={BarChart3}
        iconColor="text-green-500"
        title="Relatórios"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
          <div>
            <FinancialInsights
              monthlyBalance={monthlyMetrics.balance}
              monthlyExpenses={monthlyMetrics.expenses}
              monthlyIncomes={monthlyMetrics.incomes}
              transactions={transactions}
            />
          </div>
          <div>
            <IncomeVsExpenseChart
              accountFilter={{
                selectedAccountId: null,
                selectedCreditCardId: null,
              }}
              dateFilter={{
                selectedMonth: currentMonth,
                selectedYear: currentYear,
              }}
              transactions={transactions}
            />
          </div>
        </div>
      </DashboardAccordion>
    );
  },
);
