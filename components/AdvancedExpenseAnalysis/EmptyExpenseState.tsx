import { memo } from "react";
import { AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Props for the empty expense state component
 */
interface EmptyExpenseStateProps {
  periodDescription: string;
}

/**
 * Empty state component for when no expense data is available
 *
 * Features:
 * - Clear messaging about lack of data
 * - Context-aware period description
 * - Consistent styling with application theme
 * - Optimized with React.memo for performance
 */
export const EmptyExpenseState = memo<EmptyExpenseStateProps>(
  function EmptyExpenseState({ periodDescription }) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Tendência de Gastos
          </CardTitle>
          <CardDescription>
            Evolução dos gastos ao longo do período
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nenhuma despesa registrada</p>
              <p className="text-sm">{periodDescription}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
);
