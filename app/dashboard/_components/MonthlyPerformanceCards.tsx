import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/lib/schemas";
import {
  AlertCircle,
  Award,
  Calendar,
  PiggyBank,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

interface MonthlyPerformanceCardsProps {
  transactions: Transaction[];
  monthlyIncomes: number;
  monthlyExpenses: number;
  monthlyBalance: number;
  selectedMonth?: number;
  selectedYear?: number;
  selectedAccountId?: number | null;
  selectedCreditCardId?: number | null;
}

export function MonthlyPerformanceCards({
  transactions,
  monthlyIncomes,
  monthlyExpenses,
  monthlyBalance,
  selectedMonth,
  selectedYear,
  selectedAccountId,
  selectedCreditCardId,
}: MonthlyPerformanceCardsProps) {
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

  // Calcular métricas do mês selecionado
  const savingsRate =
    monthlyIncomes > 0 ? (monthlyBalance / monthlyIncomes) * 100 : 0;

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

  // Calcular dados do mês anterior para insights
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

  // Calcular dias do mês para análise de ritmo
  const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
  const dailyAverageExpense = monthlyExpenses / daysInMonth;

  const monthlyCards = [
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
          ? "bg-green-500/10"
          : savingsRate >= 10
            ? "bg-yellow-500/10"
            : "bg-red-500/10",
    },
    {
      title: "Maior Receita",
      value: formatCurrency(highestIncome),
      description: "do mês selecionado",
      icon: Award,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Maior Despesa",
      value: formatCurrency(highestExpense),
      description: "do mês selecionado",
      icon: TrendingDown,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
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
          ? "bg-green-500/10"
          : "bg-yellow-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {monthlyCards.map((card, index) => {
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

      {/* Insights do Mês */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Insights do Mês Selecionado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Verificar se há dados suficientes para insights */}
          {monthlyTransactions.length === 0 ? (
            <div className="flex items-center justify-center py-4 text-muted-foreground">
              <div className="text-center">
                <AlertCircle className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  Nenhum insight disponível para este período
                </p>
                <p className="text-xs mt-1">
                  Adicione transações para ver análises detalhadas
                </p>
              </div>
            </div>
          ) : (
            <>
              {savingsRate >= 30 && (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <PiggyBank className="h-4 w-4" />
                  <span>
                    Excelente taxa de economia ({savingsRate.toFixed(1)}%)
                  </span>
                </div>
              )}

              {savingsRate < 0 && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <span>Gastos superiores às receitas neste mês</span>
                </div>
              )}

              {expenseChange > 20 && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                  <TrendingUp className="h-4 w-4" />
                  <span>
                    Gastos aumentaram {Math.abs(expenseChange).toFixed(1)}% vs
                    mês anterior
                  </span>
                </div>
              )}

              {expenseChange < -15 && (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <TrendingDown className="h-4 w-4" />
                  <span>
                    Redução significativa de gastos (
                    {Math.abs(expenseChange).toFixed(1)}%)
                  </span>
                </div>
              )}

              {highestExpense > monthlyExpenses * 0.3 && (
                <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
                  <TrendingDown className="h-4 w-4" />
                  <span>
                    Maior despesa representa{" "}
                    {((highestExpense / monthlyExpenses) * 100).toFixed(1)}% do
                    total
                  </span>
                </div>
              )}

              {monthlyIncomes > 0 && monthlyExpenses / monthlyIncomes > 0.9 && (
                <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
                  <Target className="h-4 w-4" />
                  <span>
                    Usando{" "}
                    {((monthlyExpenses / monthlyIncomes) * 100).toFixed(1)}% do
                    orçamento
                  </span>
                </div>
              )}

              {dailyAverageExpense > 100 && (
                <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Média diária de {formatCurrency(dailyAverageExpense)} neste
                    mês
                  </span>
                </div>
              )}

              {/* Mostrar mensagem quando nenhum insight é gerado */}
              {!(savingsRate >= 30) &&
                !(savingsRate < 0) &&
                !(expenseChange > 20) &&
                !(expenseChange < -15) &&
                !(highestExpense > monthlyExpenses * 0.3) &&
                !(
                  monthlyIncomes > 0 && monthlyExpenses / monthlyIncomes > 0.9
                ) &&
                !(dailyAverageExpense > 100) && (
                  <div className="flex items-center justify-center py-2 text-muted-foreground">
                    <div className="text-center">
                      <div className="text-sm">
                        ✅ Comportamento financeiro estável
                      </div>
                      <div className="text-xs mt-1">
                        Nenhuma anomalia detectada neste período
                      </div>
                    </div>
                  </div>
                )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
