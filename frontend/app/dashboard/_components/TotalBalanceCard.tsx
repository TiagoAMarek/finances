import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { DollarSign } from "lucide-react";

export interface TotalBalanceCardProps {
  totalBalance: number;
}

export function TotalBalanceCard({
  totalBalance,
}: TotalBalanceCardProps) {

  // Gerar dados dos últimos 6 meses para o gráfico
  const generateLast6MonthsData = () => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleDateString("pt-BR", { month: "short" });

      // Simular variação do saldo (em produção, isso viria dos dados reais)
      const variation = Math.random() * 10000 - 5000;
      const balance = totalBalance + variation;

      data.push({
        month,
        balance: Math.max(0, balance),
      });
    }
    return data;
  };

  const chartData = generateLast6MonthsData();
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
        <p className="text-xs text-muted-foreground mb-4">
          Soma de todas as contas
        </p>
        <div className="h-20 flex items-end justify-between">
          {chartData.map((data) => (
            <div key={data.month} className="flex flex-col items-center gap-1">
              <div
                className="w-2 bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600"
                style={{
                  height: `${Math.max(10, (data.balance / Math.max(...chartData.map((d) => d.balance))) * 60)}px`,
                }}
              />
              <span className="text-[8px] text-muted-foreground">
                {data.month}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
