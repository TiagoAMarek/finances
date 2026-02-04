"use client";

import { FileText, Calendar, DollarSign, CreditCard, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/features/shared/components/ui";
import { Badge } from "@/features/shared/components/ui";
import { Button } from "@/features/shared/components/ui";
import type { CreditCardStatementWithCard } from "@/lib/schemas/credit-card-statements";

interface StatementItemProps {
  statement: CreditCardStatementWithCard;
  onView: (statementId: number) => void;
}

const STATUS_LABELS = {
  pending: "Pendente",
  reviewed: "Revisada",
  imported: "Importada",
  cancelled: "Cancelada",
} as const;

const STATUS_VARIANTS = {
  pending: "secondary",
  reviewed: "default",
  imported: "success",
  cancelled: "destructive",
} as const;

export function StatementItem({ statement, onView }: StatementItemProps) {
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, "dd/MM/yyyy", { locale: ptBR });
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parseFloat(amount));
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{statement.creditCard?.name || "Cartão"}</CardTitle>
              <CardDescription className="mt-1">
                {statement.fileName}
              </CardDescription>
            </div>
          </div>
          <Badge variant={STATUS_VARIANTS[statement.status] as any}>
            {STATUS_LABELS[statement.status]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Vencimento</p>
              <p className="font-medium">{formatDate(statement.dueDate)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Fatura de</p>
              <p className="font-medium">{formatDate(statement.statementDate)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Total</p>
              <p className="font-medium">{formatCurrency(statement.totalAmount)}</p>
            </div>
          </div>
        </div>

        {statement.status === "pending" && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-md mb-4">
            <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              Esta fatura ainda não foi processada. Clique em "Ver Detalhes" para revisar e importar.
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(statement.id)}
          >
            Ver Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
