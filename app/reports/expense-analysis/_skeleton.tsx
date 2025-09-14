import { PieChart } from "lucide-react";

import { PageHeader } from "@/features/shared/components";
import { Skeleton } from "@/features/shared/components/ui";

export function ExpenseAnalysisPageSkeleton() {
  return (
    <>
      <PageHeader
        action={<Skeleton className="h-9 w-32" />}
        description="Insights avançados sobre seus padrões de consumo"
        icon={PieChart}
        title="Análise Detalhada de Gastos"
      />

      <div className="space-y-6 sm:space-y-8 px-4 lg:px-6 pb-6 sm:pb-8">
        <div className="space-y-4 sm:space-y-6">
          <Skeleton className="h-10 sm:h-12 w-full" />

          <div className="space-y-4 sm:space-y-6">
            {/* Loading para Visão Geral */}
            <div className="space-y-3 sm:space-y-4">
              <div className="rounded-lg border bg-card p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-32 sm:h-48 w-full" />
              </div>
            </div>

            {/* Loading para Análise Detalhada */}
            <div className="space-y-3 sm:space-y-4">
              <div className="rounded-lg border bg-card p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-52" />
                </div>
                <Skeleton className="h-48 sm:h-64 lg:h-80 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
