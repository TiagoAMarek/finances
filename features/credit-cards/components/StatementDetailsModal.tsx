"use client";

import { useState, useMemo } from "react";
import { FileText, Calendar, DollarSign, AlertCircle, Check } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/features/shared/components/ui";
import { Button, Alert, AlertDescription, Badge, Tabs, TabsContent, TabsList, TabsTrigger } from "@/features/shared/components/ui";
import { LineItemsTable } from "./LineItemsTable";
import { useGetStatementDetails, useGetStatementLineItems } from "../hooks/data";
import type { StatementImportInput } from "@/lib/schemas/credit-card-statements";

interface StatementDetailsModalProps {
  statementId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onImport: (statementId: number, data: StatementImportInput) => Promise<any>;
  isImporting?: boolean;
}

export function StatementDetailsModal({
  statementId,
  isOpen,
  onClose,
  onImport,
  isImporting = false,
}: StatementDetailsModalProps) {
  const { data: statement, isLoading: isLoadingStatement } = useGetStatementDetails(statementId);
  const { data: lineItemsData, isLoading: isLoadingLineItems } = useGetStatementLineItems(statementId);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [updateCurrentBill, setUpdateCurrentBill] = useState(true);

  const lineItems = lineItemsData?.data || [];

  // Calculate summary
  const summary = useMemo(() => {
    const total = lineItems.length;
    const duplicates = lineItems.filter((item) => item.isDuplicate).length;
    const toImport = total - duplicates;
    const totalAmount = lineItems
      .filter((item) => !item.isDuplicate)
      .reduce((sum, item) => sum + parseFloat(item.amount), 0);

    return { total, duplicates, toImport, totalAmount };
  }, [lineItems]);

  // Auto-select non-duplicate items on load
  useMemo(() => {
    if (lineItems.length > 0 && selectedItems.length === 0) {
      const nonDuplicates = lineItems
        .filter((item) => !item.isDuplicate)
        .map((item) => item.id);
      setSelectedItems(nonDuplicates);
    }
  }, [lineItems, selectedItems.length]);

  const handleToggleItem = (itemId: number) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleToggleAll = () => {
    const nonDuplicateIds = lineItems
      .filter((item) => !item.isDuplicate)
      .map((item) => item.id);

    if (selectedItems.length === nonDuplicateIds.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(nonDuplicateIds);
    }
  };

  const handleImport = async () => {
    if (!statementId) return;

    const excludeIds = lineItems
      .filter((item) => !selectedItems.includes(item.id))
      .map((item) => item.id);

    await onImport(statementId, {
      updateCurrentBill,
      excludeLineItemIds: excludeIds,
      lineItemUpdates: [], // No manual updates in this version
    });
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, "dd/MM/yyyy", { locale: ptBR });
  };

  const formatCurrency = (amount: string | number) => {
    const value = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (!statementId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle>Detalhes da Fatura</DialogTitle>
              <DialogDescription>
                {statement?.fileName || "Carregando..."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isLoadingStatement || isLoadingLineItems ? (
          <div className="py-12 text-center text-muted-foreground">
            Carregando detalhes...
          </div>
        ) : (
          <div className="space-y-6">
            {/* Statement Info */}
            {statement && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Cartão</p>
                  <p className="font-medium">{statement.creditCard?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Vencimento</p>
                  <p className="font-medium">{formatDate(statement.dueDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total</p>
                  <p className="font-medium">{formatCurrency(statement.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <Badge>{statement.status}</Badge>
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Total de Itens</p>
                </div>
                <p className="text-2xl font-bold">{summary.total}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <p className="text-sm font-medium">Duplicados</p>
                </div>
                <p className="text-2xl font-bold text-red-500">{summary.duplicates}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <p className="text-sm font-medium">A Importar</p>
                </div>
                <p className="text-2xl font-bold text-green-500">{summary.toImport}</p>
              </div>
            </div>

            {/* Duplicates Warning */}
            {summary.duplicates > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {summary.duplicates} {summary.duplicates === 1 ? "transação foi identificada" : "transações foram identificadas"} como possível{summary.duplicates === 1 ? "" : "is"} duplicada{summary.duplicates === 1 ? "" : "s"} e será{summary.duplicates === 1 ? "" : "ão"} ignorada{summary.duplicates === 1 ? "" : "s"} na importação.
                </AlertDescription>
              </Alert>
            )}

            {/* Line Items Table */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Transações ({selectedItems.length} selecionadas)
              </h3>
              <LineItemsTable
                lineItems={lineItems}
                selectedItems={selectedItems}
                onToggleItem={handleToggleItem}
                onToggleAll={handleToggleAll}
              />
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1">
            <input
              type="checkbox"
              id="updateCurrentBill"
              checked={updateCurrentBill}
              onChange={(e) => setUpdateCurrentBill(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="updateCurrentBill" className="text-sm">
              Atualizar fatura atual do cartão
            </label>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isImporting}>
              Cancelar
            </Button>
            <Button
              onClick={handleImport}
              disabled={isImporting || selectedItems.length === 0}
            >
              {isImporting ? "Importando..." : `Importar ${selectedItems.length} Transações`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
