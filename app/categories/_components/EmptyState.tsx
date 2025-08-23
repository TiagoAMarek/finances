import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag, Plus, TrendingUp, ShoppingCart, Wallet } from "lucide-react";
import React from "react";

type EmptyStateProps = {
  title?: string;
  description?: string;
  className?: string;
  children?: React.ReactNode; // For custom primary action (e.g., CreateCategoryModal trigger)
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
};

export function EmptyState({
  title = "Nenhuma categoria ainda",
  description = "Crie categorias para organizar suas receitas e despesas.",
  className,
  children,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <Card
      className={cn(
        "border-dashed bg-gradient-to-br from-background to-muted/20",
        className,
      )}
    >
      <CardContent className="py-16 sm:py-20 text-center space-y-6 max-w-lg mx-auto">
        {/* Animated icon group */}
        <div className="relative">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary shadow-sm">
            <Tag className="h-8 w-8" />
          </div>

          {/* Floating category type icons */}
          <div className="absolute -top-2 -right-2 h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-pulse">
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <div
            className="absolute -bottom-2 -left-2 h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center animate-pulse"
            style={{ animationDelay: "0.5s" }}
          >
            <ShoppingCart className="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>
          <div
            className="absolute top-4 -left-4 h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center animate-pulse"
            style={{ animationDelay: "1s" }}
          >
            <Wallet className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {title}
          </h3>
          <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
            {description}
          </p>
          <div className="text-xs text-muted-foreground/80 space-y-1">
            <p>📊 Organize receitas e despesas</p>
            <p>📋 Acompanhe gastos por categoria</p>
            <p>🎯 Mantenha suas finanças organizadas</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-4">
          {/* Primary action: accept external trigger (e.g., CreateCategoryModal) */}
          {children ?? (
            <Button
              size="lg"
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              <Plus className="mr-2 h-5 w-5" />
              Criar primeira categoria
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="outline"
              size="lg"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
