import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CategoryData {
  category: string;
  total: number;
  count: number;
  average: number;
  percentage: number;
  change: number;
  maxTransaction: number;
}

interface ExpenseCategoriesAnalysisProps {
  categoryData: CategoryData[];
  formatCurrency: (value: number) => string;
  maxItems?: number;
}

export function ExpenseCategoriesAnalysis({
  categoryData,
  formatCurrency,
  maxItems = 8,
}: ExpenseCategoriesAnalysisProps) {
  return (
    <div className="space-y-3">
      {categoryData.slice(0, maxItems).map((item, index) => (
        <div key={item.category} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: `hsl(${index * 45}, 70%, 50%)`,
                }}
              />
              <span className="font-medium">{item.category}</span>
              <Badge variant="secondary" className="text-xs">
                {item.count} transações
              </Badge>
              {Math.abs(item.change) > 10 && (
                <Badge
                  variant={item.change > 0 ? "destructive" : "default"}
                  className="text-xs"
                >
                  {item.change > 0 ? "+" : ""}
                  {item.change.toFixed(1)}%
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
  );
}
