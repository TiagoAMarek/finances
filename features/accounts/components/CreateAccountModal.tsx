import { FormModal, QuickCreateButton } from "@/features/shared/components";
import { Input, Label } from "@/features/shared/components/ui";
import { CreditCardIcon, DollarSignIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

interface CreateAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; balance: string }) => void;
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
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      variant="create"
      size="md"
      trigger={
        <QuickCreateButton onClick={() => onOpenChange(true)}>
          Nova Conta
        </QuickCreateButton>
      }
    >
      <FormModal.Header
        icon={CreditCardIcon}
        iconColor="text-primary"
        iconBgColor="bg-primary/10"
        title="Nova Conta Bancária"
        description="Cadastre uma nova conta para controlar suas finanças pessoais"
      />

      <FormModal.Form onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label
            htmlFor="accountName"
            className="text-sm font-medium flex items-center gap-2"
          >
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
          <Label
            htmlFor="accountBalance"
            className="text-sm font-medium flex items-center gap-2"
          >
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

        <FormModal.Actions
          onCancel={handleClose}
          submitText="Criar Conta"
          submitIcon={PlusIcon}
          isLoading={isLoading}
          isDisabled={!name.trim()}
        />
      </FormModal.Form>
    </FormModal>
  );
}
