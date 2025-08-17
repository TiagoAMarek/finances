import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Transaction } from "@/lib/schemas";

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      period: string;
      receitas: number;
      despesas: number;
      saldo: number;
      transactions: number;
    };
  }>;
  label?: string;
}

interface WeeklyIncomeVsExpenseChartProps {
  transactions: Transaction[];
  selectedMonth?: number;
  selectedYear?: number;
}

export function WeeklyIncomeVsExpenseChart({
  transactions,
  selectedMonth,
  selectedYear,
}: WeeklyIncomeVsExpenseChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Gerar dados semanais do mês selecionado
  const generateWeeklyData = () => {
    const targetMonth =
      selectedMonth !== undefined ? selectedMonth : new Date().getMonth();
    const targetYear =
      selectedYear !== undefined ? selectedYear : new Date().getFullYear();

    // Filtrar transações do mês selecionado
    const monthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === targetMonth &&
        transactionDate.getFullYear() === targetYear
      );
    });

    // Usar a mesma lógica robusta do AdvancedExpenseAnalysis
    const startOfMonth = new Date(targetYear, targetMonth, 1);
    const endOfMonth = new Date(targetYear, targetMonth + 1, 0);

    const weeklyData = [];
    let currentWeekStart = new Date(startOfMonth);
    let weekNumber = 1;

    while (currentWeekStart <= endOfMonth) {
      const currentWeekEnd = new Date(currentWeekStart);
      currentWeekEnd.setDate(currentWeekStart.getDate() + 6);

      // Não passar do fim do mês
      if (currentWeekEnd > endOfMonth) {
        currentWeekEnd.setTime(endOfMonth.getTime());
      }

      // Filtrar transações da semana
      const weekTransactions = monthTransactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return (
          transactionDate >= currentWeekStart &&
          transactionDate <= currentWeekEnd
        );
      });

      const income = weekTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const expense = weekTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      weeklyData.push({
        week: `Sem ${weekNumber}`,
        period: `${currentWeekStart.getDate()}/${currentWeekStart.getMonth() + 1} - ${currentWeekEnd.getDate()}/${currentWeekEnd.getMonth() + 1}`,
        receitas: income,
        despesas: expense,
        saldo: income - expense,
        transactions: weekTransactions.length,
      });

      // Próxima semana
      currentWeekStart = new Date(currentWeekEnd);
      currentWeekStart.setDate(currentWeekEnd.getDate() + 1);
      weekNumber++;
    }

    return weeklyData;
  };

  const data = generateWeeklyData();
  const monthName =
    selectedMonth !== undefined && selectedYear !== undefined
      ? new Date(selectedYear, selectedMonth).toLocaleDateString("pt-BR", {
          month: "long",
          year: "numeric",
        })
      : new Date().toLocaleDateString("pt-BR", {
          month: "long",
          year: "numeric",
        });

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-4 shadow-lg border-green-200">
          <div className="space-y-2">
            <p className="font-medium text-foreground">{`${label} (${data.period})`}</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Receitas: {formatCurrency(data.receitas)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  Despesas: {formatCurrency(data.despesas)}
                </p>
              </div>
              <p
                className={`text-sm font-bold ${
                  data.saldo >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                💰 Saldo: {formatCurrency(data.saldo)}
              </p>
              {data.transactions && (
                <p className="text-xs text-muted-foreground">
                  📊 {data.transactions} transação
                  {data.transactions !== 1 ? "s" : ""}
                </p>
              )}
              {data.transactions > 0 && (
                <p className="text-xs text-muted-foreground">
                  💳 Ticket médio:{" "}
                  {formatCurrency(
                    (data.receitas + data.despesas) / data.transactions,
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Receitas vs Despesas por Semana
        </CardTitle>
        <CardDescription>Evolução semanal de {monthName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#374151" }}
              />
              <YAxis
                tickFormatter={formatCurrency}
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#374151" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="receitas"
                name="Receitas"
                fill="#10b981"
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
