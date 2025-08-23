import {
  Alert,
  AlertDescription,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui";
import { Transaction } from "@/lib/schemas";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  Lightbulb,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

interface FinancialInsightsProps {
  transactions: Transaction[];
  monthlyIncomes: number;
  monthlyExpenses: number;
  monthlyBalance: number;
}

export function FinancialInsights({
  transactions,
  monthlyIncomes,
  monthlyExpenses,
  monthlyBalance,
}: FinancialInsightsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const generateInsights = () => {
    const insights = [];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Dados do mês anterior
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

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

    // Insight 1: Comparação de gastos
    if (previousMonthExpenses > 0) {
      const expenseChange =
        ((monthlyExpenses - previousMonthExpenses) / previousMonthExpenses) *
        100;
      if (Math.abs(expenseChange) > 5) {
        insights.push({
          type: expenseChange > 0 ? "warning" : "success",
          title: expenseChange > 0 ? "Gastos aumentaram" : "Gastos diminuíram",
          message: `Você ${expenseChange > 0 ? "gastou" : "economizou"} ${Math.abs(expenseChange).toFixed(1)}% ${expenseChange > 0 ? "a mais" : "a menos"} este mês (${formatCurrency(Math.abs(monthlyExpenses - previousMonthExpenses))})`,
          icon: expenseChange > 0 ? TrendingUp : TrendingDown,
        });
      }
    }

    // Insight 2: Taxa de economia
    const savingsRate =
      monthlyIncomes > 0 ? (monthlyBalance / monthlyIncomes) * 100 : 0;
    if (monthlyIncomes > 0) {
      if (savingsRate >= 20) {
        insights.push({
          type: "success",
          title: "Excelente economia!",
          message: `Você está economizando ${savingsRate.toFixed(1)}% da sua renda. Continue assim!`,
          icon: CheckCircle,
        });
      } else if (savingsRate >= 10) {
        insights.push({
          type: "info",
          title: "Boa economia",
          message: `Taxa de economia de ${savingsRate.toFixed(1)}%. Tente chegar aos 20% para uma reserva mais robusta.`,
          icon: Info,
        });
      } else if (savingsRate < 0) {
        insights.push({
          type: "destructive",
          title: "Atenção aos gastos",
          message: `Você gastou ${formatCurrency(Math.abs(monthlyBalance))} a mais do que ganhou este mês.`,
          icon: AlertTriangle,
        });
      } else {
        insights.push({
          type: "warning",
          title: "Economia baixa",
          message: `Taxa de economia de apenas ${savingsRate.toFixed(1)}%. Considere revisar seus gastos.`,
          icon: AlertTriangle,
        });
      }
    }

    // Insight 3: Análise de categorias
    const monthlyTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        t.type === "expense" &&
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });

    const categoryTotals = monthlyTransactions.reduce(
      (acc, transaction) => {
        const category = transaction.category || "Outros";
        acc[category] = (acc[category] || 0) + parseFloat(transaction.amount);
        return acc;
      },
      {} as Record<string, number>,
    );

    const topCategory = Object.entries(categoryTotals).sort(
      ([, a], [, b]) => b - a,
    )[0];

    if (topCategory && monthlyExpenses > 0) {
      const percentage = (topCategory[1] / monthlyExpenses) * 100;
      if (percentage > 30) {
        insights.push({
          type: "info",
          title: "Categoria dominante",
          message: `${topCategory[0]} representa ${percentage.toFixed(1)}% dos seus gastos (${formatCurrency(topCategory[1])})`,
          icon: Info,
        });
      }
    }

    // Insight 4: Comparação de receitas
    if (previousMonthIncomes > 0) {
      const incomeChange =
        ((monthlyIncomes - previousMonthIncomes) / previousMonthIncomes) * 100;
      if (Math.abs(incomeChange) > 10) {
        insights.push({
          type: incomeChange > 0 ? "success" : "warning",
          title:
            incomeChange > 0 ? "Receitas aumentaram" : "Receitas diminuíram",
          message: `Suas receitas ${incomeChange > 0 ? "aumentaram" : "diminuíram"} ${Math.abs(incomeChange).toFixed(1)}% este mês`,
          icon: incomeChange > 0 ? TrendingUp : TrendingDown,
        });
      }
    }

    // Insight 5: Dia mais caro do mês
    if (monthlyTransactions.length > 0) {
      const dailyTotals = monthlyTransactions.reduce(
        (acc, transaction) => {
          const day = new Date(transaction.date).toLocaleDateString("pt-BR");
          acc[day] = (acc[day] || 0) + parseFloat(transaction.amount);
          return acc;
        },
        {} as Record<string, number>,
      );

      const expensiveDay = Object.entries(dailyTotals).sort(
        ([, a], [, b]) => b - a,
      )[0];

      if (expensiveDay && expensiveDay[1] > monthlyExpenses * 0.1) {
        insights.push({
          type: "info",
          title: "Dia de maior gasto",
          message: `${expensiveDay[0]} foi seu dia mais caro com ${formatCurrency(expensiveDay[1])} em gastos`,
          icon: Info,
        });
      }
    }

    return insights.slice(0, 4); // Limitar a 4 insights para não sobrecarregar
  };

  const insights = generateInsights();

  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Insights Financeiros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Adicione mais transações para ver insights personalizados</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Lightbulb className="h-4 w-4" />
          Insights Financeiros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <Alert
              key={index}
              variant={insight.type as "default" | "destructive"}
            >
              <Icon className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium mb-1">{insight.title}</div>
                <div className="text-sm">{insight.message}</div>
              </AlertDescription>
            </Alert>
          );
        })}
      </CardContent>
    </Card>
  );
}
