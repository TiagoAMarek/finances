import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@/features/shared/components/ui";
import { BankAccount } from "@/lib/schemas";
import {
  CreditCardIcon,
  DollarSignIcon,
  EditIcon,
  Loader2Icon,
  SaveIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

interface EditAccountModalProps {
  account: BankAccount | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (account: BankAccount) => void;
  isLoading: boolean;
}

export function EditAccountModal({
  account,
  open,
  onOpenChange,
  onSave,
  isLoading,
}: EditAccountModalProps) {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    if (account) {
      setName(account.name);
      setBalance(parseFloat(account.balance));
    }
  }, [account]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;

    onSave({
      ...account,
      name,
      balance: balance.toString(),
    });
  };

  const resetForm = () => {
    if (account) {
      setName(account.name);
      setBalance(parseFloat(account.balance));
    }
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (!account) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-3 pb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10">
            <EditIcon className="h-6 w-6 text-orange-500" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-xl">Editar Conta Bancária</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Atualize os dados da sua conta bancária
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Preview da conta atual */}
        <div className="bg-muted/30 rounded-lg p-4 border border-dashed mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <CreditCardIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">{account.name}</p>
              <p className="text-sm text-muted-foreground">
                Saldo atual: {formatCurrency(parseFloat(account.balance))}
              </p>
            </div>
          </div>
        </div>

        <Card className="border-dashed">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="editAccountName"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <CreditCardIcon className="h-4 w-4" />
                  Nome da Conta
                </Label>
                <Input
                  type="text"
                  id="editAccountName"
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
                <Label
                  htmlFor="editAccountBalance"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <DollarSignIcon className="h-4 w-4" />
                  Saldo Atual
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    R$
                  </span>
                  <Input
                    type="number"
                    id="editAccountBalance"
                    value={balance || ""}
                    onChange={(e) =>
                      setBalance(parseFloat(e.target.value) || 0)
                    }
                    placeholder="0,00"
                    className="h-11 pl-10"
                    step="0.01"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Atualize o saldo atual da sua conta bancária
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
