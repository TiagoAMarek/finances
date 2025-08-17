import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  Activity,
  Zap,
} from "lucide-react";
import { Transaction } from "@/lib/schemas";

interface ComparativePerformanceCardsProps {
  transactions: Transaction[];
  selectedMonth?: number;
  selectedYear?: number;
}

export function ComparativePerformanceCards({
  transactions,
  selectedMonth,
  selectedYear,
}: ComparativePerformanceCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  const targetMonth =
    selectedMonth !== undefined ? selectedMonth : new Date().getMonth();
  const targetYear =
    selectedYear !== undefined ? selectedYear : new Date().getFullYear();

  // Calcular dados do mês atual selecionado
  const currentMonthTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getMonth() === targetMonth &&
      transactionDate.getFullYear() === targetYear
    );
  });

  const currentMonthExpenses = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const currentMonthIncomes = currentMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  // Calcular dados do mês anterior
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

  const previousMonthIncomes = previousMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  // Calcular variações
  const expenseChange =
    previousMonthExpenses > 0
      ? ((currentMonthExpenses - previousMonthExpenses) /
          previousMonthExpenses) *
        100
      : 0;

  const incomeChange =
    previousMonthIncomes > 0
      ? ((currentMonthIncomes - previousMonthIncomes) / previousMonthIncomes) *
        100
      : 0;

  // Calcular gasto diário médio dos últimos 30 dias reais
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const last30DaysTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      transactionDate >= thirtyDaysAgo &&
      transactionDate <= now &&
      t.type === "expense"
    );
  });

  const last30DaysExpenses = last30DaysTransactions.reduce(
    (sum, t) => sum + parseFloat(t.amount),
    0,
  );
  const dailyAverageExpense = last30DaysExpenses / 30;

  // Calcular média dos últimos 3 meses para comparação de tendência
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(now.getMonth() - 3);

  const lastThreeMonthsTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      transactionDate >= threeMonthsAgo &&
      transactionDate <= now &&
      t.type === "expense"
    );
  });

  const threeMonthsAverage =
    lastThreeMonthsTransactions.length > 0
      ? lastThreeMonthsTransactions.reduce(
          (sum, t) => sum + parseFloat(t.amount),
          0,
        ) / 3
      : 0;

  const trendVsAverage =
    threeMonthsAverage > 0
      ? ((currentMonthExpenses - threeMonthsAverage) / threeMonthsAverage) * 100
      : 0;

  // Calcular velocidade de gastos (projeção para final do mês)
  const currentDate = new Date();
  const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
  const dayOfMonth =
    targetMonth === currentDate.getMonth() &&
    targetYear === currentDate.getFullYear()
      ? currentDate.getDate()
      : daysInMonth;

  const projectedMonthExpenses =
    dayOfMonth > 0
      ? (currentMonthExpenses / dayOfMonth) * daysInMonth
      : currentMonthExpenses;
  const spendingVelocity =
    previousMonthExpenses > 0
      ? ((projectedMonthExpenses - previousMonthExpenses) /
          previousMonthExpenses) *
        100
      : 0;

  const comparativeCards = [
    {
      title: "Variação de Gastos",
      value: formatPercentage(expenseChange),
      description: "vs mês anterior",
      icon: expenseChange >= 0 ? TrendingUp : TrendingDown,
      color: expenseChange >= 0 ? "text-red-500" : "text-green-500",
      bgColor: expenseChange >= 0 ? "bg-red-500/10" : "bg-green-500/10",
    },
    {
      title: "Gasto Diário Médio",
      value: formatCurrency(dailyAverageExpense),
      description: "últimos 30 dias reais",
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Variação de Receitas",
      value: formatPercentage(incomeChange),
      description: "vs mês anterior",
      icon: incomeChange >= 0 ? TrendingUp : TrendingDown,
      color: incomeChange >= 0 ? "text-green-500" : "text-red-500",
      bgColor: incomeChange >= 0 ? "bg-green-500/10" : "bg-red-500/10",
    },
    {
      title: "Tendência (3 meses)",
      value: formatPercentage(trendVsAverage),
      description: "vs média trimestral",
      icon: trendVsAverage >= 0 ? TrendingUp : TrendingDown,
      color: trendVsAverage >= 0 ? "text-red-500" : "text-green-500",
      bgColor: trendVsAverage >= 0 ? "bg-red-500/10" : "bg-green-500/10",
    },
    {
      title: "Velocidade de Gastos",
      value: formatPercentage(spendingVelocity),
      description: "projeção vs anterior",
      icon: spendingVelocity >= 0 ? Zap : Activity,
      color:
        spendingVelocity >= 10
          ? "text-red-500"
          : spendingVelocity >= 0
            ? "text-yellow-500"
            : "text-green-500",
      bgColor:
        spendingVelocity >= 10
          ? "bg-red-500/10"
          : spendingVelocity >= 0
            ? "bg-yellow-500/10"
            : "bg-green-500/10",
    },
    {
      title: "Padrão Mensal",
      value: formatCurrency(threeMonthsAverage),
      description: "média últimos 3 meses",
      icon: BarChart3,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {comparativeCards.map((card, index) => {
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
