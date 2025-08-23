import { FormModal } from "@/features/shared/components";
import { Input, Label } from "@/features/shared/components/ui";
import { BankAccount } from "@/lib/schemas";
import {
  CreditCardIcon,
  DollarSignIcon,
  EditIcon,
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
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      variant="edit"
      size="md"
    >
      <FormModal.Header
        icon={EditIcon}
        iconColor="text-orange-500"
        iconBgColor="bg-orange-500/10"
        title="Editar Conta Bancária"
        description="Atualize os dados da sua conta bancária"
      />

      <FormModal.Preview>
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
      </FormModal.Preview>

      <FormModal.Form onSubmit={handleSubmit}>
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

        <FormModal.Actions
          onCancel={handleClose}
          submitText="Salvar Alterações"
          submitIcon={SaveIcon}
          isLoading={isLoading}
          isDisabled={!name.trim()}
        />
      </FormModal.Form>
    </FormModal>
  );
}
