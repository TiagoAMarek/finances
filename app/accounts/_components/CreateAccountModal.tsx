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
import { PlusIcon, CreditCardIcon, DollarSignIcon, Loader2Icon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CreateAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; balance: string; currency: string }) => void;
  isLoading: boolean;
}

export function CreateAccountModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: CreateAccountModalProps) {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      balance: balance.toString(),
      currency: "BRL",
    });
    setName("");
    setBalance(0);
  };

  const resetForm = () => {
    setName("");
    setBalance(0);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <QuickCreateButton onClick={() => onOpenChange(true)}>
          Nova Conta
        </QuickCreateButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-3 pb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <CreditCardIcon className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-xl">Nova Conta Bancária</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Cadastre uma nova conta para controlar suas finanças pessoais
            </DialogDescription>
          </div>
        </DialogHeader>

        <Card className="border-dashed">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="accountName" className="text-sm font-medium flex items-center gap-2">
                  <CreditCardIcon className="h-4 w-4" />
                  Nome da Conta
                </Label>
                <Input
                  type="text"
                  id="accountName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Conta Corrente Santander"
                  className="h-11"
                  autoFocus
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Escolha um nome que facilite a identificação da conta
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountBalance" className="text-sm font-medium flex items-center gap-2">
                  <DollarSignIcon className="h-4 w-4" />
                  Saldo Inicial
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    R$
                  </span>
                  <Input
                    type="number"
                    id="accountBalance"
                    value={balance || ""}
                    onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
                    placeholder="0,00"
                    className="h-11 pl-10"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Informe o saldo atual da sua conta bancária
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 border">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary" className="text-xs">
                    BRL
                  </Badge>
                  <span className="text-muted-foreground">
                    Moeda: Real Brasileiro
                  </span>
                </div>
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
                      Criar Conta
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