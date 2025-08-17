import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Target,
  PiggyBank,
  Calendar,
  Award,
} from "lucide-react";
import { Transaction } from "@/lib/schemas";

interface FinancialPerformanceCardsProps {
  transactions: Transaction[];
  monthlyIncomes: number;
  monthlyExpenses: number;
  monthlyBalance: number;
  selectedMonth?: number;
  selectedYear?: number;
  selectedAccountId?: number | null;
  selectedCreditCardId?: number | null;
}

export function FinancialPerformanceCards({
  transactions,
  monthlyIncomes,
  monthlyExpenses,
  monthlyBalance,
  selectedMonth,
  selectedYear,
  selectedAccountId,
  selectedCreditCardId,
}: FinancialPerformanceCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Calcular métricas
  const savingsRate =
    monthlyIncomes > 0 ? (monthlyBalance / monthlyIncomes) * 100 : 0;

  // Maior receita e despesa do mês selecionado
  const targetMonth =
    selectedMonth !== undefined ? selectedMonth : new Date().getMonth();
  const targetYear =
    selectedYear !== undefined ? selectedYear : new Date().getFullYear();

  let monthlyTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getMonth() === targetMonth &&
      transactionDate.getFullYear() === targetYear
    );
  });

  // Aplicar filtros de conta/cartão
  if (selectedAccountId !== null && selectedAccountId !== undefined) {
    monthlyTransactions = monthlyTransactions.filter(
      (t) => t.accountId === selectedAccountId,
    );
  }
  if (selectedCreditCardId !== null && selectedCreditCardId !== undefined) {
    monthlyTransactions = monthlyTransactions.filter(
      (t) => t.creditCardId === selectedCreditCardId,
    );
  }

  const highestIncome = monthlyTransactions
    .filter((t) => t.type === "income")
    .reduce((max, t) => Math.max(max, parseFloat(t.amount)), 0);

  const highestExpense = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((max, t) => Math.max(max, parseFloat(t.amount)), 0);

  // Calcular média diária de gastos
  const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
  const dailyAverageExpense = monthlyExpenses / daysInMonth;

  // Calcular dados do mês anterior para comparação
  const previousMonth = targetMonth === 0 ? 11 : targetMonth - 1;
  const previousYear = targetMonth === 0 ? targetYear - 1 : targetYear;

  const previousMonthTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getMonth() === previousMonth &&
      transactionDate.getFullYear() === previousYear
    );
  });

  const previousMonthExpenses = previousMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const expenseChange =
    previousMonthExpenses > 0
      ? ((monthlyExpenses - previousMonthExpenses) / previousMonthExpenses) *
        100
      : 0;

  const performanceCards = [
    {
      title: "Taxa de Economia",
      value: formatPercentage(savingsRate),
      description: "do que você ganhou",
      icon: PiggyBank,
      color:
        savingsRate >= 20
          ? "text-green-500"
          : savingsRate >= 10
            ? "text-yellow-500"
            : "text-red-500",
      bgColor:
        savingsRate >= 20
          ? "bg-green-50 dark:bg-green-950"
          : savingsRate >= 10
            ? "bg-yellow-50 dark:bg-yellow-950"
            : "bg-red-50 dark:bg-red-950",
    },
    {
      title: "Maior Receita",
      value: formatCurrency(highestIncome),
      description: "do mês atual",
      icon: Award,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Maior Despesa",
      value: formatCurrency(highestExpense),
      description: "do mês atual",
      icon: TrendingDown,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950",
    },
    {
      title: "Gasto Diário Médio",
      value: formatCurrency(dailyAverageExpense),
      description: "nos últimos 30 dias",
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Variação de Gastos",
      value: `${expenseChange >= 0 ? "+" : ""}${formatPercentage(expenseChange)}`,
      description: "vs mês anterior",
      icon: expenseChange >= 0 ? TrendingUp : TrendingDown,
      color: expenseChange >= 0 ? "text-red-500" : "text-green-500",
      bgColor:
        expenseChange >= 0
          ? "bg-red-50 dark:bg-red-950"
          : "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Relação Gastos/Receitas",
      value: formatPercentage(
        monthlyIncomes > 0 ? (monthlyExpenses / monthlyIncomes) * 100 : 0,
      ),
      description: "do orçamento usado",
      icon: Target,
      color:
        monthlyIncomes > 0 && monthlyExpenses / monthlyIncomes <= 0.8
          ? "text-green-500"
          : "text-yellow-500",
      bgColor:
        monthlyIncomes > 0 && monthlyExpenses / monthlyIncomes <= 0.8
          ? "bg-green-50 dark:bg-green-950"
          : "bg-yellow-50 dark:bg-yellow-950",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {performanceCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.bgColor}`}
              >
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color}`}>
                {card.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
