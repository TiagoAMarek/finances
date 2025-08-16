import { Transaction } from "@/lib/schemas";
import { AdvancedExpenseAnalysis } from "../../../dashboard/_components/AdvancedExpenseAnalysis";
import { IncomeVsExpenseChart } from "@/components/IncomeVsExpenseChart";

interface ExpenseAnalysisContentProps {
  transactions: Transaction[];
  periodFilter: "7days" | "currentMonth" | "3months";
  isLoading?: boolean;
}

export function ExpenseAnalysisContent({
  transactions,
  periodFilter,
  isLoading = false
}: ExpenseAnalysisContentProps) {
  // Mapear periodFilter para periodType do IncomeVsExpenseChart
  const getPeriodType = (filter: "7days" | "currentMonth" | "3months") => {
    switch (filter) {
      case "7days":
        return "7-days" as const;
      case "currentMonth":
        return "current-month" as const;
      case "3months":
        return "3-months" as const;
      default:
        return undefined;
    }
  };

  return (
    <div className="space-y-8">
      {/* Visão Geral */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Visão Geral</h3>
        <IncomeVsExpenseChart
          transactions={transactions}
          periodType={getPeriodType(periodFilter)}
          selectedAccountId={null}
          selectedCreditCardId={null}
        />
      </div>

      {/* Análise Detalhada */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Análise Detalhada</h3>
        <AdvancedExpenseAnalysis
          transactions={transactions}
          selectedMonth={new Date().getMonth()}
          selectedYear={new Date().getFullYear()}
          selectedAccountId={null}
          selectedCreditCardId={null}
          periodFilter={periodFilter}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
