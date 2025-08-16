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
  periodType?: "current-month" | "7-days" | "3-months" | "custom";
}

export function IncomeVsExpenseChart({
  transactions,
  selectedMonth,
  selectedYear,
  selectedAccountId,
  selectedCreditCardId,
  dateFilter,
  periodType,
}: IncomeVsExpenseChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Função auxiliar para aplicar filtros de conta/cartão
  const applyAccountCardFilters = (filteredTransactions: Transaction[]) => {
    let filtered = filteredTransactions;

    if (selectedAccountId !== null && selectedAccountId !== undefined) {
      filtered = filtered.filter((t) => t.accountId === selectedAccountId);
    }
    if (selectedCreditCardId !== null && selectedCreditCardId !== undefined) {
      filtered = filtered.filter(
        (t) => t.creditCardId === selectedCreditCardId,
      );
    }

    return filtered;
  };

  // Gerar dados semanais para o mês atual
  const generateWeeklyData = (year: number, month: number) => {
    const data = [];
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);

    // Calcular número de semanas no mês
    const firstDay = startOfMonth.getDay(); // 0 = domingo
    const daysInMonth = endOfMonth.getDate();
    const totalDays = firstDay + daysInMonth;
    const weeks = Math.ceil(totalDays / 7);

    for (let week = 1; week <= weeks; week++) {
      // Calcular primeiro e último dia da semana
      const weekStart = new Date(year, month, 1 + (week - 1) * 7 - firstDay);
      const weekEnd = new Date(year, month, week * 7 - firstDay);

      // Ajustar para não ultrapassar o mês
      if (weekStart < startOfMonth) weekStart.setTime(startOfMonth.getTime());
      if (weekEnd > endOfMonth) weekEnd.setTime(endOfMonth.getTime());

      // Filtrar transações da semana
      let weekTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return transactionDate >= weekStart && transactionDate <= weekEnd;
      });

      weekTransactions = applyAccountCardFilters(weekTransactions);

      const incomes = weekTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const expenses = weekTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      data.push({
        month: `Sem ${week}`,
        receitas: incomes,
        despesas: expenses,
        saldo: incomes - expenses,
      });
    }

    return data;
  };

  // Gerar dados diários para os últimos 7 dias
  const generateDailyData = () => {
    const data = [];
    const today = new Date();
    const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const dayName = dayNames[date.getDay()];
      const dayStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );
      const dayEnd = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1,
      );

      // Filtrar transações do dia
      let dayTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return transactionDate >= dayStart && transactionDate < dayEnd;
      });

      dayTransactions = applyAccountCardFilters(dayTransactions);

      const incomes = dayTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const expenses = dayTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      data.push({
        month: dayName,
        receitas: incomes,
        despesas: expenses,
        saldo: incomes - expenses,
      });
    }

    return data;
  };

  // Gerar dados mensais para os últimos 3 meses
  const generateThreeMonthsData = () => {
    const data = [];
    const today = new Date();

    for (let i = 2; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
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

      monthTransactions = applyAccountCardFilters(monthTransactions);

      const incomes = monthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const expenses = monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      data.push({
        month: `${month} ${year}`,
        receitas: incomes,
        despesas: expenses,
        saldo: incomes - expenses,
      });
    }

    return data;
  };

  // Gerar dados baseado no período selecionado
  const generateChartData = () => {
    // Priorizar dateFilter sobre props individuais para consistência
    const effectiveMonth = dateFilter?.selectedMonth ?? selectedMonth;
    const effectiveYear = dateFilter?.selectedYear ?? selectedYear;

    // Detectar tipo de período automaticamente
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Lógica de decisão para granularidade
    if (periodType === "7-days") {
      // Período de 7 dias → Gráfico diário
      return generateDailyData();
    } else if (periodType === "3-months") {
      // Período de 3 meses → Gráfico mensal
      return generateThreeMonthsData();
    } else if (
      periodType === "current-month" ||
      (effectiveMonth === currentMonth && effectiveYear === currentYear)
    ) {
      // Mês atual → Gráfico semanal
      return generateWeeklyData(
        effectiveYear || currentYear,
        effectiveMonth ?? currentMonth,
      );
    } else if (effectiveMonth !== undefined && effectiveYear !== undefined) {
      // Mês específico (não atual) → Gráfico mensal de 1 mês
      const date = new Date(effectiveYear, effectiveMonth, 1);
      const month = date.toLocaleDateString("pt-BR", { month: "short" });
      const year = date.getFullYear();
      const monthIndex = date.getMonth();

      // Filtrar transações do mês selecionado
      let monthTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return (
          transactionDate.getMonth() === monthIndex &&
          transactionDate.getFullYear() === year
        );
      });

      monthTransactions = applyAccountCardFilters(monthTransactions);

      const incomes = monthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const expenses = monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      return [
        {
          month,
          receitas: incomes,
          despesas: expenses,
          saldo: incomes - expenses,
        },
      ];
    } else {
      // Sem período específico → Últimos 6 meses (comportamento padrão)
      const data = [];
      const baseDate = new Date();

      for (let i = 5; i >= 0; i--) {
        const date = new Date(
          baseDate.getFullYear(),
          baseDate.getMonth() - i,
          1,
        );
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

        monthTransactions = applyAccountCardFilters(monthTransactions);

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
    }
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

  // Gerar descrição dinâmica baseada no período
  const getDescription = () => {
    const effectiveMonth = dateFilter?.selectedMonth ?? selectedMonth;
    const effectiveYear = dateFilter?.selectedYear ?? selectedYear;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    if (periodType === "7-days") {
      return "Últimos 7 dias - visão diária";
    } else if (periodType === "3-months") {
      return "Últimos 3 meses - visão mensal";
    } else if (
      periodType === "current-month" ||
      (effectiveMonth === currentMonth && effectiveYear === currentYear)
    ) {
      const date = new Date(
        effectiveYear || currentYear,
        effectiveMonth ?? currentMonth,
        1,
      );
      const monthName = date.toLocaleDateString("pt-BR", { month: "long" });
      const year = date.getFullYear();
      return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year} - visão semanal`;
    } else if (effectiveMonth !== undefined && effectiveYear !== undefined) {
      const date = new Date(effectiveYear, effectiveMonth, 1);
      const monthName = date.toLocaleDateString("pt-BR", { month: "long" });
      const year = date.getFullYear();
      return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
    }

    return "Comparativo mensal dos últimos 6 meses";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Receitas vs Despesas
        </CardTitle>
        <CardDescription>{getDescription()}</CardDescription>
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
