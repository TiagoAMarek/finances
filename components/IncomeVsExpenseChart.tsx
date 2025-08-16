import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Transaction } from "@/lib/schemas";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface IncomeVsExpenseChartProps {
  transactions: Transaction[];
  selectedMonth?: number;
  selectedYear?: number;
  selectedAccountId?: number | null;
  selectedCreditCardId?: number | null;
  dateFilter?: {
    selectedMonth: number;
    selectedYear: number;
  };
}

export function IncomeVsExpenseChart({
  transactions,
  selectedMonth,
  selectedYear,
  selectedAccountId,
  selectedCreditCardId,
  dateFilter,
}: IncomeVsExpenseChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Gerar dados dos últimos 6 meses ou do período selecionado
  const generateChartData = () => {
    const data = [];
    // Priorizar dateFilter sobre props individuais para consistência
    const effectiveMonth = dateFilter?.selectedMonth ?? selectedMonth;
    const effectiveYear = dateFilter?.selectedYear ?? selectedYear;
    
    const baseDate =
      effectiveMonth !== undefined && effectiveYear !== undefined
        ? new Date(effectiveYear, effectiveMonth, 1)
        : new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1);
      const month = date.toLocaleDateString("pt-BR", { month: "short" });
      const year = date.getFullYear();
      const monthIndex = date.getMonth();

      // Filtrar transações do mês
      let monthTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return (
          transactionDate.getMonth() === monthIndex &&
          transactionDate.getFullYear() === year
        );
      });

      // Aplicar filtros de conta/cartão
      if (selectedAccountId !== null && selectedAccountId !== undefined) {
        monthTransactions = monthTransactions.filter(
          (t) => t.accountId === selectedAccountId,
        );
      }
      if (selectedCreditCardId !== null && selectedCreditCardId !== undefined) {
        monthTransactions = monthTransactions.filter(
          (t) => t.creditCardId === selectedCreditCardId,
        );
      }

      const incomes = monthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const expenses = monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      data.push({
        month,
        receitas: incomes,
        despesas: expenses,
        saldo: incomes - expenses,
      });
    }

    return data;
  };

  const chartData = generateChartData();

  // Calcular totais para o período
  const totalIncomes = chartData.reduce(
    (sum, month) => sum + month.receitas,
    0,
  );
  const totalExpenses = chartData.reduce(
    (sum, month) => sum + month.despesas,
    0,
  );
  const netBalance = totalIncomes - totalExpenses;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Receitas vs Despesas
        </CardTitle>
        <CardDescription>
          Comparativo mensal dos últimos 6 meses
        </CardDescription>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Total: {formatCurrency(totalIncomes)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Total: {formatCurrency(totalExpenses)}</span>
          </div>
          <div
            className={`font-medium ${netBalance >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
              }`}
          >
            Saldo: {formatCurrency(netBalance)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                className="fill-muted-foreground"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                className="fill-muted-foreground"
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Legend />
              <Bar
                dataKey="receitas"
                name="Receitas"
                fill="#22c55e"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="despesas"
                name="Despesas"
                fill="#ef4444"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
