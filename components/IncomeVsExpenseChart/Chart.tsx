import { memo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { ChartDataPoint, formatCurrency } from "@/lib/chart-utils";

interface ChartProps {
  data: ChartDataPoint[];
  height?: number;
}

/**
 * Chart visualization component for income vs expense data
 */
export const Chart = memo<ChartProps>(({ data, height = 200 }) => {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
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
  );
});

Chart.displayName = "Chart";