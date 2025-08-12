import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { EditIcon, CreditCardIcon, DollarSignIcon, Loader2Icon, SaveIcon } from "lucide-react";
import { CreditCard } from "@/lib/schemas";

interface EditCardModalProps {
  card: CreditCard | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (card: CreditCard) => void;
  isLoading: boolean;
}

export function EditCardModal({
  card,
  open,
  onOpenChange,
  onSave,
  isLoading,
}: EditCardModalProps) {
  const [name, setName] = useState("");
  const [limit, setLimit] = useState<number>(0);
  const [currentBill, setCurrentBill] = useState<number>(0);

  useEffect(() => {
    if (card) {
      setName(card.name);
      setLimit(parseFloat(card.limit));
      setCurrentBill(parseFloat(card.currentBill));
    }
  }, [card]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!card) return;
    
    onSave({
      ...card,
      name,
      limit: limit.toString(),
      currentBill: currentBill.toString(),
    });
  };

  const resetForm = () => {
    if (card) {
      setName(card.name);
      setLimit(parseFloat(card.limit));
      setCurrentBill(parseFloat(card.currentBill));
    }
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (!card) return null;

  const usagePercentage = limit > 0 ? (currentBill / limit) * 100 : 0;
  const isHighUsage = usagePercentage > 80;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-3 pb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10">
            <EditIcon className="h-6 w-6 text-orange-500" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-xl">Editar Cartão de Crédito</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Atualize os dados do seu cartão de crédito
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Preview do cartão atual */}
        <div className="bg-muted/30 rounded-lg p-4 border border-dashed mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <CreditCardIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{card.name}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Fatura: {formatCurrency(parseFloat(card.currentBill))}</span>
                <span>•</span>
                <span className={isHighUsage ? 'text-amber-600' : 'text-muted-foreground'}>
                  {usagePercentage.toFixed(1)}% usado
                </span>
              </div>
            </div>
          </div>
        </div>

        <Card className="border-dashed">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="editCardName" className="text-sm font-medium flex items-center gap-2">
                  <CreditCardIcon className="h-4 w-4" />
                  Nome do Cartão
                </Label>
                <Input
                  type="text"
                  id="editCardName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Cartão Principal"
                  className="h-11"
                  autoFocus
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Escolha um nome que facilite a identificação do cartão
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editCardLimit" className="text-sm font-medium flex items-center gap-2">
                  <DollarSignIcon className="h-4 w-4" />
                  Limite do Cartão
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    R$
                  </span>
                  <Input
                    type="number"
                    id="editCardLimit"
                    value={limit || ""}
                    onChange={(e) => setLimit(parseFloat(e.target.value) || 0)}
                    placeholder="0,00"
                    className="h-11 pl-10"
                    step="0.01"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Atualize o limite disponível do seu cartão
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editCurrentBill" className="text-sm font-medium flex items-center gap-2">
                  <DollarSignIcon className="h-4 w-4" />
                  Fatura Atual
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    R$
                  </span>
                  <Input
                    type="number"
                    id="editCurrentBill"
                    value={currentBill || ""}
                    onChange={(e) => setCurrentBill(parseFloat(e.target.value) || 0)}
                    placeholder="0,00"
                    className="h-11 pl-10"
                    step="0.01"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Informe o valor atual da fatura do cartão
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !name.trim()}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="h-4 w-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}