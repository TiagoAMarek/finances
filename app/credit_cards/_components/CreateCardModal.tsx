import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QuickCreateButton } from "@/components/QuickCreateButton";
import {
  PlusIcon,
  CreditCardIcon,
  DollarSignIcon,
  Loader2Icon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CreateCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; limit: string }) => void;
  isLoading: boolean;
}

export function CreateCardModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: CreateCardModalProps) {
  const [name, setName] = useState("");
  const [limit, setLimit] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      limit: limit.toString(),
    });
    setName("");
    setLimit(0);
  };

  const resetForm = () => {
    setName("");
    setLimit(0);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <QuickCreateButton onClick={() => onOpenChange(true)}>
          Novo Cartão
        </QuickCreateButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-3 pb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
            <CreditCardIcon className="h-6 w-6 text-blue-500" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-xl">
              Novo Cartão de Crédito
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Cadastre um novo cartão para controlar suas despesas
            </DialogDescription>
          </div>
        </DialogHeader>

        <Card className="border-dashed">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="cardName"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <CreditCardIcon className="h-4 w-4" />
                  Nome do Cartão
                </Label>
                <Input
                  type="text"
                  id="cardName"
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
                <Label
                  htmlFor="cardLimit"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <DollarSignIcon className="h-4 w-4" />
                  Limite do Cartão
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    R$
                  </span>
                  <Input
                    type="number"
                    id="cardLimit"
                    value={limit || ""}
                    onChange={(e) => setLimit(parseFloat(e.target.value) || 0)}
                    placeholder="0,00"
                    className="h-11 pl-10"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Informe o limite disponível do seu cartão de crédito
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
                      Criando...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-4 w-4" />
                      Criar Cartão
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
