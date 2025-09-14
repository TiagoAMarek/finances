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
      <ResponsiveContainer height="100%" width="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid className="stroke-muted" strokeDasharray="3 3" />
          <XAxis
            axisLine={false}
            className="fill-muted-foreground"
            dataKey="month"
            tick={{ fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            className="fill-muted-foreground"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatCurrency(value)}
            tickLine={false}
          />
          <Legend />
          <Bar
            dataKey="receitas"
            fill="#22c55e"
            name="Receitas"
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey="despesas"
            fill="#ef4444"
            name="Despesas"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

Chart.displayName = "Chart";
