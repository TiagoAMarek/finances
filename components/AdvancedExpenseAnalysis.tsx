import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Transaction } from "@/lib/schemas";
import { AlertCircle } from "lucide-react";

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      month: string;
      total: number;
      transactions: number;
    };
    value: number;
  }>;
  label?: string;
}

interface AdvancedExpenseAnalysisProps {
  transactions: Transaction[];
  selectedMonth?: number;
  selectedYear?: number;
  selectedAccountId?: number | null;
  selectedCreditCardId?: number | null;
  periodFilter?: "7days" | "currentMonth" | "3months";
  isLoading?: boolean;
}

export function AdvancedExpenseAnalysis({ 
  transactions, 
  selectedMonth, 
  selectedYear, 
  selectedAccountId, 
  selectedCreditCardId,
  periodFilter = "currentMonth"
}: AdvancedExpenseAnalysisProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const targetMonth = selectedMonth !== undefined ? selectedMonth : new Date().getMonth();
  const targetYear = selectedYear !== undefined ? selectedYear : new Date().getFullYear();

  // Filtrar transações por período
  const getFilteredTransactionsByPeriod = () => {
    let expenseTransactions = transactions.filter((t) => t.type === "expense");

    // Aplicar filtros de conta/cartão
    if (selectedAccountId !== null && selectedAccountId !== undefined) {
      expenseTransactions = expenseTransactions.filter(t => t.accountId === selectedAccountId);
    }
    if (selectedCreditCardId !== null && selectedCreditCardId !== undefined) {
      expenseTransactions = expenseTransactions.filter(t => t.creditCardId === selectedCreditCardId);
    }

    const now = new Date();
    
    switch (periodFilter) {
      case "7days":
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        return expenseTransactions.filter((t) => {
          const transactionDate = new Date(t.date);
          return transactionDate >= sevenDaysAgo && transactionDate <= now;
        });

      case "3months":
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        return expenseTransactions.filter((t) => {
          const transactionDate = new Date(t.date);
          return transactionDate >= threeMonthsAgo && transactionDate <= now;
        });

      case "currentMonth":
      default:
        return expenseTransactions.filter((t) => {
          const transactionDate = new Date(t.date);
          return (
            transactionDate.getMonth() === targetMonth &&
            transactionDate.getFullYear() === targetYear
          );
        });
    }
  };


  // Despesas do período atual
  const currentMonthExpenses = getFilteredTransactionsByPeriod();


  // Gerar dados para gráfico de tendência
  const generateMonthlyTrend = () => {
    let expenseTransactions = transactions.filter((t) => t.type === "expense");

    // Aplicar filtros de conta/cartão
    if (selectedAccountId !== null && selectedAccountId !== undefined) {
      expenseTransactions = expenseTransactions.filter(t => t.accountId === selectedAccountId);
    }
    if (selectedCreditCardId !== null && selectedCreditCardId !== undefined) {
      expenseTransactions = expenseTransactions.filter(t => t.creditCardId === selectedCreditCardId);
    }

    const monthlyData = [];
    
    switch (periodFilter) {
      case "7days":
        // Últimos 7 períodos de 7 dias
        for (let i = 6; i >= 0; i--) {
          const endDate = new Date();
          endDate.setDate(endDate.getDate() - (i * 7));
          const startDate = new Date(endDate);
          startDate.setDate(startDate.getDate() - 6);
          
          const periodExpenses = expenseTransactions.filter((t) => {
            const transactionDate = new Date(t.date);
            return transactionDate >= startDate && transactionDate <= endDate;
          });

          const total = periodExpenses.reduce((sum, t) => sum + parseFloat(t.amount), 0);
          
          monthlyData.push({
            month: `${startDate.getDate()}/${startDate.getMonth() + 1} - ${endDate.getDate()}/${endDate.getMonth() + 1}`,
            total,
            transactions: periodExpenses.length
          });
        }
        break;

      case "3months":
        // Últimos 3 meses
        for (let i = 2; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          const month = date.getMonth();
          const year = date.getFullYear();
          
          const monthExpenses = expenseTransactions.filter((t) => {
            const transactionDate = new Date(t.date);
            return (
              transactionDate.getMonth() === month &&
              transactionDate.getFullYear() === year
            );
          });

          const total = monthExpenses.reduce((sum, t) => sum + parseFloat(t.amount), 0);
          
          monthlyData.push({
            month: date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
            total,
            transactions: monthExpenses.length
          });
        }
        break;

      case "currentMonth":
      default:
        // Apenas o mês atual selecionado - quebrado por semanas
        const startOfMonth = new Date(targetYear, targetMonth, 1);
        const endOfMonth = new Date(targetYear, targetMonth + 1, 0);
        
        // Dividir o mês em semanas
        let currentWeekStart = new Date(startOfMonth);
        let weekNumber = 1;
        
        while (currentWeekStart <= endOfMonth) {
          const currentWeekEnd = new Date(currentWeekStart);
          currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
          
          // Não passar do fim do mês
          if (currentWeekEnd > endOfMonth) {
            currentWeekEnd.setTime(endOfMonth.getTime());
          }
          
          const weekExpenses = expenseTransactions.filter((t) => {
            const transactionDate = new Date(t.date);
            return transactionDate >= currentWeekStart && transactionDate <= currentWeekEnd;
          });

          const total = weekExpenses.reduce((sum, t) => sum + parseFloat(t.amount), 0);
          
          monthlyData.push({
            month: `Sem ${weekNumber}`,
            total,
            transactions: weekExpenses.length
          });
          
          // Próxima semana
          currentWeekStart = new Date(currentWeekEnd);
          currentWeekStart.setDate(currentWeekEnd.getDate() + 1);
          weekNumber++;
        }
        break;
    }
    
    return monthlyData;
  };


  const monthlyTrend = generateMonthlyTrend();

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-4 shadow-lg border-red-200">
          <div className="space-y-2">
            <p className="font-medium text-foreground">{label}</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <p className="text-sm font-medium text-red-600">
                {formatCurrency(payload[0].value)}
              </p>
            </div>
            {data.transactions && (
              <p className="text-xs text-muted-foreground">
                📊 {data.transactions} transação{data.transactions !== 1 ? 's' : ''}
              </p>
            )}
            {payload[0].value > 0 && (
              <p className="text-xs text-muted-foreground">
                💳 Média por transação: {formatCurrency(payload[0].value / (data.transactions || 1))}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  if (currentMonthExpenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Tendência de Gastos</CardTitle>
          <CardDescription>Evolução dos gastos ao longo do período</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nenhuma despesa registrada</p>
              <p className="text-sm">
                {periodFilter === "7days" ? "nos últimos 7 dias" :
                 periodFilter === "3months" ? "nos últimos 3 meses" :
                 "neste mês"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Card de Tendências de Gastos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Tendência de Gastos</CardTitle>
          <CardDescription>Evolução dos gastos ao longo do período</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-[350px] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: '#374151' }}
                />
                <YAxis 
                  tickFormatter={formatCurrency} 
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: '#374151' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ 
                    fill: '#ef4444', 
                    strokeWidth: 2, 
                    r: 6,
                    className: 'transition-all duration-200 hover:r-8'
                  }}
                  activeDot={{ 
                    r: 8, 
                    fill: '#dc2626',
                    stroke: '#ffffff',
                    strokeWidth: 2
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {monthlyTrend.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 px-2">
              <div className="text-center p-2 bg-red-500/10 rounded-lg border">
                <p className="text-xs text-muted-foreground">Maior</p>
                <p className="font-semibold text-red-600 dark:text-red-400">
                  {formatCurrency(Math.max(...monthlyTrend.map(d => d.total)))}
                </p>
              </div>
              <div className="text-center p-2 bg-green-500/10 rounded-lg border">
                <p className="text-xs text-muted-foreground">Menor</p>
                <p className="font-semibold text-green-600 dark:text-green-400">
                  {formatCurrency(Math.min(...monthlyTrend.map(d => d.total)))}
                </p>
              </div>
              <div className="text-center p-2 bg-blue-500/10 rounded-lg border">
                <p className="text-xs text-muted-foreground">Média</p>
                <p className="font-semibold text-blue-600 dark:text-blue-400">
                  {formatCurrency(monthlyTrend.reduce((sum, d) => sum + d.total, 0) / monthlyTrend.length)}
                </p>
              </div>
              <div className="text-center p-2 bg-orange-500/10 rounded-lg border">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-semibold text-orange-600 dark:text-orange-400">
                  {formatCurrency(monthlyTrend.reduce((sum, d) => sum + d.total, 0))}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}