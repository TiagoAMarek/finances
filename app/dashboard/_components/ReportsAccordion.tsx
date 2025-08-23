import { IncomeVsExpenseChart } from "@/components/IncomeVsExpenseChart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useCurrentMonth } from "@/features/dashboard/hooks/ui";
import {
  MonthlyMetrics,
  formatDashboardCurrency,
  getBalanceBadgeVariant,
} from "@/features/dashboard/utils/dashboard-calculations";
import { Transaction } from "@/lib/schemas";
import { AlertCircle, BarChart3, TrendingUp } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import { DashboardAccordionTrigger } from "./DashboardAccordionTrigger";
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
      <Button asChild variant="outline" size="sm" className="hidden md:flex">
        <Link href="/reports" className="flex items-center gap-1 text-xs">
          Ver Completos
        </Link>
      </Button>
    );

    return (
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="reports"
      >
        <AccordionItem value="reports">
          <DashboardAccordionTrigger
            title="Relatórios"
            icon={BarChart3}
            iconColor="text-green-500"
            badges={badges}
            actionButton={actionButton}
          />
          <AccordionContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
              <div>
                <FinancialInsights
                  transactions={transactions}
                  monthlyIncomes={monthlyMetrics.incomes}
                  monthlyExpenses={monthlyMetrics.expenses}
                  monthlyBalance={monthlyMetrics.balance}
                />
              </div>
              <div>
                <IncomeVsExpenseChart
                  transactions={transactions}
                  dateFilter={{
                    selectedMonth: currentMonth,
                    selectedYear: currentYear,
                  }}
                  accountFilter={{
                    selectedAccountId: null,
                    selectedCreditCardId: null,
                  }}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  },
);
