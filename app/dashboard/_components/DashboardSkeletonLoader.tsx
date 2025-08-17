import { memo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loading component for Dashboard
 *
 * Features:
 * - Reusable and maintainable loading states
 * - Matches the actual dashboard structure
 * - Optimized with React.memo for performance
 * - Reduces code duplication from 100+ lines to reusable component
 */

/**
 * Skeleton for individual metric cards
 */
const MetricCardSkeleton = memo(function MetricCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
});

/**
 * Skeleton for accordion items
 */
const AccordionSkeleton = memo(function AccordionSkeleton({
  hasButton = false,
}: {
  hasButton?: boolean;
}) {
  return (
    <div className="border rounded-lg">
      <div className="flex items-center justify-between p-4 border-b">
        <Skeleton className="h-6 w-24" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          {hasButton && <Skeleton className="h-8 w-32" />}
          <Skeleton className="h-4 w-4" />
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded border"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-7 w-7 rounded-lg" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * Main dashboard skeleton loader component
 */
export const DashboardSkeletonLoader = memo(function DashboardSkeletonLoader() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Visão geral das suas finanças e transações recentes"
        action={<Skeleton className="h-9 w-32" />}
      />

      <div className="space-y-8 px-4 lg:px-6 pb-8">
        {/* Loading Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </div>

        {/* Loading Accordions */}
        <div className="space-y-4">
          <AccordionSkeleton />
          <AccordionSkeleton hasButton />
        </div>
      </div>
    </>
  );
});
