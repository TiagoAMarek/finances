import {
  AdvancedExpenseAnalysis,
  IncomeVsExpenseChart,
} from "@/features/shared/components";
import { Transaction } from "@/lib/schemas";

interface ExpenseAnalysisContentProps {
  transactions: Transaction[];
  periodFilter: "3months" | "6months" | "12months";
  isLoading?: boolean;
}

export function ExpenseAnalysisContent({
  transactions,
  periodFilter,
  isLoading = false,
}: ExpenseAnalysisContentProps) {
  // Mapear periodFilter para periodType do IncomeVsExpenseChart
  const getPeriodType = (filter: "3months" | "6months" | "12months") => {
    switch (filter) {
      case "3months":
        return "3-months" as const;
      case "6months":
        return "6-months" as const;
      case "12months":
        return "12-months" as const;
      default:
        return undefined;
    }
  };

  return (
    <div className="space-y-8">
      {/* Visão Geral */}
      <div className="space-y-4">
        <IncomeVsExpenseChart
          transactions={transactions}
          periodType={getPeriodType(periodFilter)}
        />
      </div>

      {/* Análise Detalhada */}
      <div className="space-y-4">
        <AdvancedExpenseAnalysis
          transactions={transactions}
          selectedAccountId={null}
          selectedCreditCardId={null}
          periodFilter={periodFilter}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
