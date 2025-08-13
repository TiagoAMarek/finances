import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Transaction } from "@/lib/schemas";
import { TrendingUp, TrendingDown, Calendar, Target, AlertCircle, DollarSign, Zap, ArrowUp, ArrowDown, Trophy, Medal, Award } from "lucide-react";

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
  periodFilter = "currentMonth",
  isLoading = false
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

  // Filtrar transações de despesas
  let filteredTransactions = transactions.filter((t) => t.type === "expense");

  // Aplicar filtros de conta/cartão
  if (selectedAccountId !== null && selectedAccountId !== undefined) {
    filteredTransactions = filteredTransactions.filter(t => t.accountId === selectedAccountId);
  }
  if (selectedCreditCardId !== null && selectedCreditCardId !== undefined) {
    filteredTransactions = filteredTransactions.filter(t => t.creditCardId === selectedCreditCardId);
  }

  // Despesas do período atual
  const currentMonthExpenses = getFilteredTransactionsByPeriod();

  const currentTotal = currentMonthExpenses.reduce((sum, t) => sum + parseFloat(t.amount), 0);

  // Despesas do período anterior para comparação
  const getPreviousPeriodExpenses = () => {
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
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(now.getDate() - 14);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        return expenseTransactions.filter((t) => {
          const transactionDate = new Date(t.date);
          return transactionDate >= fourteenDaysAgo && transactionDate < sevenDaysAgo;
        });

      case "3months":
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 6);
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        return expenseTransactions.filter((t) => {
          const transactionDate = new Date(t.date);
          return transactionDate >= sixMonthsAgo && transactionDate < threeMonthsAgo;
        });

      case "currentMonth":
      default:
        const previousMonth = targetMonth === 0 ? 11 : targetMonth - 1;
        const previousYear = targetMonth === 0 ? targetYear - 1 : targetYear;
        return expenseTransactions.filter((t) => {
          const transactionDate = new Date(t.date);
          return (
            transactionDate.getMonth() === previousMonth &&
            transactionDate.getFullYear() === previousYear
          );
        });
    }
  };

  const previousPeriodExpenses = getPreviousPeriodExpenses();
  const previousTotal = previousPeriodExpenses.reduce((sum, t) => sum + parseFloat(t.amount), 0);

  // Cálculo da variação
  const changePercentage = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;
  const isIncreasing = changePercentage > 0;

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

  // Análise por categoria com mais detalhes
  const generateCategoryAnalysis = () => {
    const categoryTotals = currentMonthExpenses.reduce((acc, transaction) => {
      const category = transaction.category || 'Outros';
      if (!acc[category]) {
        acc[category] = {
          total: 0,
          count: 0,
          transactions: []
        };
      }
      acc[category].total += parseFloat(transaction.amount);
      acc[category].count += 1;
      acc[category].transactions.push(transaction);
      return acc;
    }, {} as Record<string, { total: number; count: number; transactions: Transaction[] }>);

    // Calcular dados do período anterior para comparação
    const previousCategoryTotals = previousPeriodExpenses.reduce((acc, transaction) => {
      const category = transaction.category || 'Outros';
      acc[category] = (acc[category] || 0) + parseFloat(transaction.amount);
      return acc;
    }, {} as Record<string, number>);

    const categoryData = Object.entries(categoryTotals)
      .map(([category, data]) => {
        const previousAmount = previousCategoryTotals[category] || 0;
        const change = previousAmount > 0 ? ((data.total - previousAmount) / previousAmount) * 100 : 0;
        const average = data.total / data.count;
        const percentage = currentTotal > 0 ? (data.total / currentTotal) * 100 : 0;
        
        return {
          category,
          total: data.total,
          count: data.count,
          average,
          percentage,
          change,
          previousAmount,
          maxTransaction: Math.max(...data.transactions.map(t => parseFloat(t.amount)))
        };
      })
      .sort((a, b) => b.total - a.total);

    return categoryData;
  };

  // Métricas avançadas
  const generateAdvancedMetrics = () => {
    if (currentMonthExpenses.length === 0) {
      return {
        dailyAverage: 0,
        dailyMedian: 0,
        maxDailySpending: 0,
        daysWithSpending: 0,
        avgTransactionSize: 0,
        maxTransaction: 0,
        weekdayAvg: 0,
        weekendAvg: 0,
        weekdayTotal: 0,
        weekendTotal: 0
      };
    }

    // Gastos por dia
    const dailySpending = currentMonthExpenses.reduce((acc, transaction) => {
      const day = new Date(transaction.date).toDateString();
      acc[day] = (acc[day] || 0) + parseFloat(transaction.amount);
      return acc;
    }, {} as Record<string, number>);

    const dailyAmounts = Object.values(dailySpending);
    const dailyAverage = dailyAmounts.length > 0 
      ? dailyAmounts.reduce((sum, amount) => sum + amount, 0) / dailyAmounts.length 
      : 0;
    
    const sortedDailyAmounts = dailyAmounts.sort((a, b) => a - b);
    const dailyMedian = sortedDailyAmounts.length > 0 
      ? (sortedDailyAmounts.length % 2 === 0 
          ? (sortedDailyAmounts[sortedDailyAmounts.length / 2 - 1] + sortedDailyAmounts[sortedDailyAmounts.length / 2]) / 2
          : sortedDailyAmounts[Math.floor(sortedDailyAmounts.length / 2)])
      : 0;

    const maxDailySpending = dailyAmounts.length > 0 ? Math.max(...dailyAmounts) : 0;
    const daysWithSpending = Object.keys(dailySpending).length;

    // Tamanho médio das transações
    const avgTransactionSize = currentMonthExpenses.length > 0 ? currentTotal / currentMonthExpenses.length : 0;
    const maxTransaction = currentMonthExpenses.length > 0 ? Math.max(...currentMonthExpenses.map(t => parseFloat(t.amount))) : 0;

    // Comparação fim de semana vs dias úteis
    const weekdayTransactions = currentMonthExpenses.filter(t => {
      const dayOfWeek = new Date(t.date).getDay();
      return dayOfWeek >= 1 && dayOfWeek <= 5; // Segunda a Sexta
    });

    const weekendTransactions = currentMonthExpenses.filter(t => {
      const dayOfWeek = new Date(t.date).getDay();
      return dayOfWeek === 0 || dayOfWeek === 6; // Sábado e Domingo
    });

    const weekdayTotal = weekdayTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const weekendTotal = weekendTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const weekdayAvg = weekdayTransactions.length > 0 ? weekdayTotal / weekdayTransactions.length : 0;
    const weekendAvg = weekendTransactions.length > 0 ? weekendTotal / weekendTransactions.length : 0;

    return {
      dailyAverage,
      dailyMedian,
      maxDailySpending,
      daysWithSpending,
      avgTransactionSize,
      maxTransaction,
      weekdayAvg,
      weekendAvg,
      weekdayTotal,
      weekendTotal
    };
  };

  const monthlyTrend = generateMonthlyTrend();
  const categoryAnalysis = generateCategoryAnalysis();
  const metrics = generateAdvancedMetrics();

  // Top 5 maiores transações
  const topTransactions = currentMonthExpenses
    .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
    .slice(0, 5);

  const CustomTooltip = ({ active, payload, label }: any) => {
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
          <CardTitle className="text-base font-medium">Análise Avançada de Gastos</CardTitle>
          <CardDescription>Insights detalhados sobre seus padrões de consumo</CardDescription>
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
    <div className="space-y-6">
      {/* Header com métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total do {periodFilter === "7days" ? "Período" : 
                       periodFilter === "3months" ? "Período" : "Mês"}
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
              <DollarSign className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(currentTotal)}
            </div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <div className={`flex items-center gap-1 ${
                isIncreasing ? 'text-red-500' : 'text-green-500'
              }`}>
                {isIncreasing ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{Math.abs(changePercentage).toFixed(1)}%</span>
              </div>
              <span className="ml-1">vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {periodFilter === "7days" ? "Gasto Médio/Dia (7d)" :
               periodFilter === "3months" ? "Gasto Médio/Dia (3m)" :
               "Gasto Médio/Dia"}
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
              <Calendar className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(metrics.dailyAverage)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.daysWithSpending} dias com gastos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Maior Gasto
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
              <Target className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {formatCurrency(metrics.maxTransaction)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Ticket médio: {formatCurrency(metrics.avgTransactionSize)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs com diferentes análises */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Análise Detalhada</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="trend" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
              <TabsTrigger value="trend" className="text-xs sm:text-sm py-2">
                {periodFilter === "7days" ? "7 Períodos" :
                 periodFilter === "3months" ? "3 Meses" :
                 "Semanas"}
              </TabsTrigger>
              <TabsTrigger value="categories" className="text-xs sm:text-sm py-2">
                Categorias
              </TabsTrigger>
              <TabsTrigger value="patterns" className="text-xs sm:text-sm py-2">
                Padrões
              </TabsTrigger>
              <TabsTrigger value="top" className="text-xs sm:text-sm py-2">
                Top Gastos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trend" className="space-y-4">
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
            </TabsContent>

            <TabsContent value="categories" className="space-y-4">
              <div className="space-y-3">
                {categoryAnalysis.slice(0, 8).map((item, index) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full`} style={{
                          backgroundColor: `hsl(${index * 45}, 70%, 50%)`
                        }} />
                        <span className="font-medium">{item.category}</span>
                        <Badge variant="secondary" className="text-xs">
                          {item.count} transações
                        </Badge>
                        {Math.abs(item.change) > 10 && (
                          <Badge variant={item.change > 0 ? "destructive" : "default"} className="text-xs">
                            {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(item.total)}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.percentage.toFixed(1)}% do total
                        </div>
                      </div>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Média: {formatCurrency(item.average)}</span>
                      <span>Maior: {formatCurrency(item.maxTransaction)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="patterns" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Estatísticas Gerais</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Dias com gastos</span>
                      <span className="font-medium">{metrics.daysWithSpending}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Gasto mediano/dia</span>
                      <span className="font-medium">{formatCurrency(metrics.dailyMedian)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Maior gasto/dia</span>
                      <span className="font-medium">{formatCurrency(metrics.maxDailySpending)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Ticket médio</span>
                      <span className="font-medium">{formatCurrency(metrics.avgTransactionSize)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Semana vs Fim de Semana</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Dias úteis</span>
                        <span className="font-medium">{formatCurrency(metrics.weekdayTotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Média por transação</span>
                        <span className="font-medium">{formatCurrency(metrics.weekdayAvg)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Fins de semana</span>
                        <span className="font-medium">{formatCurrency(metrics.weekendTotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Média por transação</span>
                        <span className="font-medium">{formatCurrency(metrics.weekendAvg)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Insights automáticos simplificados */}
              {(metrics.dailyAverage > metrics.dailyMedian * 1.5 || 
                metrics.weekendTotal > metrics.weekdayTotal * 1.2 || 
                changePercentage > 20) && (
                <div className="space-y-2 pt-4 border-t">
                  <h4 className="font-medium text-sm">Insights</h4>
                  <div className="space-y-2">
                    {metrics.dailyAverage > metrics.dailyMedian * 1.5 && (
                      <div className="text-sm text-muted-foreground">
                        • Gastos concentrados em poucos dias
                      </div>
                    )}
                    {metrics.weekendTotal > metrics.weekdayTotal * 1.2 && (
                      <div className="text-sm text-muted-foreground">
                        • Gastos {((metrics.weekendTotal / metrics.weekdayTotal - 1) * 100).toFixed(0)}% maiores nos fins de semana
                      </div>
                    )}
                    {changePercentage > 20 && (
                      <div className="text-sm text-muted-foreground">
                        • Aumento de {changePercentage.toFixed(0)}% comparado ao período anterior
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="top" className="space-y-4">
              <div className="space-y-3">
                {topTransactions.map((transaction, index) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 text-red-500 font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{transaction.category || 'Outros'}</span>
                          <span>•</span>
                          <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600 dark:text-red-400">
                        {formatCurrency(parseFloat(transaction.amount))}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {((parseFloat(transaction.amount) / currentTotal) * 100).toFixed(1)}% do total
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}