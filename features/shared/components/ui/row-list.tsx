"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

interface RowListProps {
  children: React.ReactNode;
  className?: string;
}

export function RowList({ children, className }: RowListProps) {
  return (
    <div
      className={cn(
        "border border-border rounded-lg overflow-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface RowListItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  onClick?: () => void;
  className?: string;
}

export function RowListItem({
  icon,
  title,
  subtitle,
  actions,
  isLoading = false,
  loadingText = "Processando...",
  onClick,
  className,
}: RowListItemProps) {
  return (
    <div
      className={cn(
        "group relative flex items-center gap-4 p-4 transition-all duration-200 hover:bg-muted/30 border-b border-border/50 last:border-b-0",
        isLoading && "opacity-50 pointer-events-none",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <span className="text-sm text-muted-foreground">{loadingText}</span>
          </div>
        </div>
      )}

      {/* Icon */}
      <div className="flex-shrink-0">{icon}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground truncate">{title}</h3>
            {subtitle && (
              <div className="flex items-center gap-2 mt-1">{subtitle}</div>
            )}
          </div>

          {actions && (
            <div className="flex items-center gap-1 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface RowListSkeletonProps {
  rows?: number;
  showSubtitle?: boolean;
  className?: string;
}

export function RowListSkeleton({
  rows = 6,
  showSubtitle = true,
  className,
}: RowListSkeletonProps) {
  return (
    <RowList className={className}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`flex items-center gap-4 p-4 border-b border-border/50 ${i === rows - 1 ? "border-b-0" : ""}`}
        >
          <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                {showSubtitle && (
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-24 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </RowList>
  );
}
