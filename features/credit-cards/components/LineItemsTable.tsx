"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertTriangle, Check, X } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
} from "@/features/shared/components/ui";
import { Checkbox } from "@/features/shared/components/ui/checkbox";
import type { LineItemWithRelations } from "@/lib/schemas/credit-card-statements";

interface LineItemsTableProps {
  lineItems: LineItemWithRelations[];
  selectedItems: number[];
  onToggleItem: (itemId: number) => void;
  onToggleAll: () => void;
}

export function LineItemsTable({
  lineItems,
  selectedItems,
  onToggleItem,
  onToggleAll,
}: LineItemsTableProps) {
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

  const allSelected = lineItems.length > 0 && selectedItems.length === lineItems.length;
  const someSelected = selectedItems.length > 0 && selectedItems.length < lineItems.length;

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected || someSelected}
                onCheckedChange={onToggleAll}
                aria-label="Selecionar todos"
              />
            </TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="w-20">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lineItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                Nenhum item encontrado
              </TableCell>
            </TableRow>
          ) : (
            lineItems.map((item) => {
              const isSelected = selectedItems.includes(item.id);
              const isDuplicate = item.isDuplicate || false;
              const hasLowConfidence = false; // Confidence not stored in current schema

              return (
                <TableRow
                  key={item.id}
                  className={isDuplicate ? "bg-red-50 dark:bg-red-950/10" : ""}
                >
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleItem(item.id)}
                      disabled={isDuplicate}
                      aria-label={`Selecionar ${item.description}`}
                    />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(item.date)}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <p className="truncate">{item.description}</p>
                      {item.type !== "purchase" && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {item.type}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.finalCategory || item.suggestedCategory ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {item.finalCategory?.name || item.suggestedCategory?.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Sem categoria</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.amount)}
                  </TableCell>
                  <TableCell>
                    {isDuplicate ? (
                      <Badge variant="destructive" className="gap-1">
                        <X className="h-3 w-3" />
                        Duplicada
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 text-green-600">
                        <Check className="h-3 w-3" />
                        OK
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
