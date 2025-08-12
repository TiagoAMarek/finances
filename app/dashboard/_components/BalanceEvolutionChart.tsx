import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUpIcon } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts";

interface BalanceEvolutionChartProps {
  totalBalance: number;
}

export function BalanceEvolutionChart({ totalBalance }: BalanceEvolutionChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Gerar dados simulados dos últimos 6 meses
  const generateChartData = () => {
    const data = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const month = date.toLocaleDateString('pt-BR', { month: 'short' });
      
      // Simular evolução com base no saldo atual e variações
      const baseVariation = (Math.random() - 0.5) * (totalBalance * 0.2); // ±20% do saldo atual
      const monthlyBalance = totalBalance + baseVariation - (i * (totalBalance * 0.05)); // Crescimento gradual
      
      data.push({
        month,
        balance: Math.max(0, monthlyBalance),
        displayBalance: formatCurrency(Math.max(0, monthlyBalance))
      });
    }
    
    // Garantir que o último mês seja o saldo atual
    data[data.length - 1].balance = totalBalance;
    data[data.length - 1].displayBalance = formatCurrency(totalBalance);
    
    return data;
  };

  const chartData = generateChartData();
  const previousBalance = chartData[chartData.length - 2]?.balance || 0;
  const currentBalance = totalBalance;
  const growth = previousBalance > 0 ? ((currentBalance - previousBalance) / previousBalance) * 100 : 0;
  const isPositiveGrowth = growth >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">
            Evolução do Saldo
          </CardTitle>
          <CardDescription>
            Saldo total das contas nos últimos 6 meses
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 text-xs ${
            isPositiveGrowth ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            <TrendingUpIcon className={`h-3 w-3 ${
              isPositiveGrowth ? '' : 'rotate-180'
            }`} />
            <span>{Math.abs(growth).toFixed(1)}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline space-x-3">
            <div className={`text-2xl font-bold ${
              totalBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(totalBalance)}
            </div>
            <div className="text-xs text-muted-foreground">
              vs mês anterior
            </div>
          </div>
          
          <div className="h-[80px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 5,
                }}
              >
                <defs>
                  <linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={totalBalance >= 0 ? "#22c55e" : "#ef4444"}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={totalBalance >= 0 ? "#22c55e" : "#ef4444"}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                />
                <Area
                  dataKey="balance"
                  type="monotone"
                  fill="url(#fillBalance)"
                  fillOpacity={0.4}
                  stroke={totalBalance >= 0 ? "#22c55e" : "#ef4444"}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}