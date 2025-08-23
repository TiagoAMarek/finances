import { PageHeader } from "@/features/shared/components";
import { Skeleton } from "@/features/shared/components/ui";
import { PieChart } from "lucide-react";

export function ExpenseAnalysisPageSkeleton() {
  return (
    <>
      <PageHeader
        title="Análise Detalhada de Gastos"
        description="Insights avançados sobre seus padrões de consumo"
        icon={PieChart}
        action={<Skeleton className="h-9 w-32" />}
      />

      <div className="space-y-8 px-4 lg:px-6 pb-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-full" />

          <div className="space-y-6">
            {/* Loading para Visão Geral */}
            <div className="space-y-4">
              <div className="rounded-lg border bg-card p-6 space-y-4">
                <Skeleton className="h-48 w-full" />
              </div>
            </div>

            {/* Loading para Análise Detalhada */}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border bg-card p-6 space-y-4"
                >
                  <Skeleton className="h-48 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
