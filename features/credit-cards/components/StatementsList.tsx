"use client";

import { FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/features/shared/components/ui";
import { StatementItem } from "./StatementItem";
import type { CreditCardStatementWithCard } from "@/lib/schemas/credit-card-statements";

interface StatementsListProps {
  statements: CreditCardStatementWithCard[];
  isLoading?: boolean;
  error?: string | null;
  onViewStatement: (statementId: number) => void;
}

export function StatementsList({
  statements,
  isLoading = false,
  error = null,
  onViewStatement,
}: StatementsListProps) {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-48 bg-muted animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (statements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="p-4 bg-muted/50 rounded-full mb-4">
          <FileText className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Nenhuma fatura encontrada</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Você ainda não importou nenhuma fatura. Clique no botão "Importar Fatura" para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {statements.map((statement) => (
        <StatementItem
          key={statement.id}
          statement={statement}
          onView={onViewStatement}
        />
      ))}
    </div>
  );
}
