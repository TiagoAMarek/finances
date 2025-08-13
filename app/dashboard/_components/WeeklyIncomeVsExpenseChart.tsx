import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { Transaction } from "@/lib/schemas";

interface WeeklyIncomeVsExpenseChartProps {
  transactions: Transaction[];
  selectedMonth?: number;
  selectedYear?: number;
}

export function WeeklyIncomeVsExpenseChart({ 
  transactions, 
  selectedMonth, 
  selectedYear
}: WeeklyIncomeVsExpenseChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Gerar dados semanais do mês selecionado
  const generateWeeklyData = () => {
    const targetMonth = selectedMonth !== undefined ? selectedMonth : new Date().getMonth();
    const targetYear = selectedYear !== undefined ? selectedYear : new Date().getFullYear();
    
    // Filtrar transações do mês selecionado
    const monthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === targetMonth &&
        transactionDate.getFullYear() === targetYear
      );
    });

    // Obter primeiro e último dia do mês
    const firstDay = new Date(targetYear, targetMonth, 1);
    const lastDay = new Date(targetYear, targetMonth + 1, 0);
    
    const weeklyData = [];
    let weekStart = new Date(firstDay);
    let weekNumber = 1;

    while (weekStart <= lastDay) {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      // Não passar do último dia do mês
      if (weekEnd > lastDay) {
        weekEnd.setTime(lastDay.getTime());
      }

      // Filtrar transações da semana
      const weekTransactions = monthTransactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return transactionDate >= weekStart && transactionDate <= weekEnd;
      });

      const income = weekTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const expense = weekTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      weeklyData.push({
        week: `Sem ${weekNumber}`,
        period: `${weekStart.getDate()}/${weekStart.getMonth() + 1} - ${weekEnd.getDate()}/${weekEnd.getMonth() + 1}`,
        receitas: income,
        despesas: expense,
        saldo: income - expense
      });

      // Próxima semana
      weekStart = new Date(weekEnd);
      weekStart.setDate(weekEnd.getDate() + 1);
      weekNumber++;
    }

    return weeklyData;
  };

  const data = generateWeeklyData();
  const monthName = selectedMonth !== undefined && selectedYear !== undefined 
    ? new Date(selectedYear, selectedMonth).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`${label} (${data.period})`}</p>
          <p className="text-green-600">
            {`Receitas: ${formatCurrency(data.receitas)}`}
          </p>
          <p className="text-red-600">
            {`Despesas: ${formatCurrency(data.despesas)}`}
          </p>
          <p className={`font-medium ${data.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {`Saldo: ${formatCurrency(data.saldo)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Receitas vs Despesas por Semana</CardTitle>
        <CardDescription>
          Evolução semanal de {monthName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="week" 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#374151' }}
              />
              <YAxis 
                tickFormatter={formatCurrency}
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#374151' }}
              />
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