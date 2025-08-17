import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Transaction } from "@/lib/schemas";

interface ExpenseCategoriesChartProps {
  transactions: Transaction[];
  selectedMonth?: number;
  selectedYear?: number;
  selectedAccountId?: number | null;
  selectedCreditCardId?: number | null;
}

export function ExpenseCategoriesChart({
  transactions,
  selectedMonth,
  selectedYear,
  selectedAccountId,
  selectedCreditCardId,
}: ExpenseCategoriesChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Gerar dados das categorias do mês selecionado
  const generateCategoryData = () => {
    const targetMonth =
      selectedMonth !== undefined ? selectedMonth : new Date().getMonth();
    const targetYear =
      selectedYear !== undefined ? selectedYear : new Date().getFullYear();

    // Filtrar apenas despesas do mês selecionado
    let monthlyExpenses = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        t.type === "expense" &&
        transactionDate.getMonth() === targetMonth &&
        transactionDate.getFullYear() === targetYear
      );
    });

    // Aplicar filtros de conta/cartão
    if (selectedAccountId !== null && selectedAccountId !== undefined) {
      monthlyExpenses = monthlyExpenses.filter(
        (t) => t.accountId === selectedAccountId,
      );
    }
    if (selectedCreditCardId !== null && selectedCreditCardId !== undefined) {
      monthlyExpenses = monthlyExpenses.filter(
        (t) => t.creditCardId === selectedCreditCardId,
      );
    }

    // Agrupar por categoria
    const categoryTotals = monthlyExpenses.reduce(
      (acc, transaction) => {
        const category = transaction.category || "Outros";
        acc[category] = (acc[category] || 0) + parseFloat(transaction.amount);
        return acc;
      },
      {} as Record<string, number>,
    );

    // Converter para array e ordenar por valor
    const categoryData = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: 0, // Will be calculated after
      }))
      .sort((a, b) => b.amount - a.amount);

    // Calcular percentuais
    const total = categoryData.reduce((sum, item) => sum + item.amount, 0);
    categoryData.forEach((item) => {
      item.percentage = total > 0 ? (item.amount / total) * 100 : 0;
    });

    return { data: categoryData, total };
  };

  const { data: categoryData, total } = generateCategoryData();

  // Cores para o gráfico
  const COLORS = [
    "#ef4444", // red-500
    "#f97316", // orange-500
    "#eab308", // yellow-500
    "#22c55e", // green-500
    "#3b82f6", // blue-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
    "#6b7280", // gray-500
  ];

  // Tooltip customizado
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{
      payload: { category: string; amount: number; percentage: number };
    }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.category}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(data.amount)} ({data.percentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Mostrar apenas as top 5 categorias + "Outros" se houver mais
  const displayData = categoryData.slice(0, 5);
  if (categoryData.length > 5) {
    const othersTotal = categoryData
      .slice(5)
      .reduce((sum, item) => sum + item.amount, 0);
    const othersPercentage = total > 0 ? (othersTotal / total) * 100 : 0;
    displayData.push({
      category: "Outros",
      amount: othersTotal,
      percentage: othersPercentage,
    });
  }

  if (total === 0 || categoryData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Gastos por Categoria
          </CardTitle>
          <CardDescription>
            Distribuição das despesas do mês atual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            <div className="text-center">
              <p>Nenhuma despesa registrada</p>
              <p className="text-sm">neste mês</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Gastos por Categoria
        </CardTitle>
        <CardDescription>
          Distribuição das despesas do mês atual
        </CardDescription>
        <div className="text-sm font-medium">
          Total: {formatCurrency(total)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={displayData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="amount"
              >
                {displayData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => <span className="text-sm">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Lista das categorias */}
        <div className="space-y-2 mt-4">
          {displayData.map((item, index) => (
            <div
              key={item.category}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span>{item.category}</span>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatCurrency(item.amount)}</div>
                <div className="text-xs text-muted-foreground">
                  {item.percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
