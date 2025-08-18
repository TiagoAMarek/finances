import { memo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/expense-utils";

/**
 * Props for the tooltip component
 */
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

/**
 * Props for the expense analysis chart
 */
interface ExpenseAnalysisChartProps {
  data: Array<{
    month: string;
    total: number;
    transactions: number;
  }>;
  height?: number;
}

/**
 * Custom tooltip component for expense analysis chart
 */
const CustomTooltip = memo<TooltipProps>(function CustomTooltip({
  active,
  payload,
  label,
}) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

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
            📊 {data.transactions} transação{data.transactions !== 1 ? "s" : ""}
          </p>
        )}
        {payload[0].value > 0 && (
          <p className="text-xs text-muted-foreground">
            💳 Média por transação:{" "}
            {formatCurrency(payload[0].value / (data.transactions || 1))}
          </p>
        )}
      </div>
    </div>
  );
});

/**
 * Pure chart component for expense analysis
 *
 * Features:
 * - Optimized with React.memo for performance
 * - Custom tooltip with transaction details
 * - Responsive design with configurable height
 * - Consistent styling with application theme
 */
export const ExpenseAnalysisChart = memo<ExpenseAnalysisChartProps>(
  function ExpenseAnalysisChart({ data, height = 350 }) {
    return (
      <div className="p-2" style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: "#374151" }}
              axisLine={false}
              className="fill-muted-foreground"
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: "#374151" }}
              axisLine={false}
              className="fill-muted-foreground"
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{
                fill: "#ef4444",
                strokeWidth: 2,
                r: 6,
                className: "transition-all duration-200 hover:r-8",
              }}
              activeDot={{
                r: 8,
                fill: "#dc2626",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  },
);
