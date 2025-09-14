import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreditCardIcon,
  EditIcon,
  SaveIcon,
} from "lucide-react";
import { useMemo } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { 
  FormModal,
  FormModalHeader,
  FormModalField,
  FormModalActions,
  FormModalFormWithHook,
  FormModalPreview
} from "@/features/shared/components";
import { Input } from "@/features/shared/components/ui";
import { BankAccount, BankAccountFormInput, BankAccountFormSchema } from "@/lib/schemas";

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
  // Memoize resolver to prevent recreation on every render
  const resolver = useMemo(() => zodResolver(BankAccountFormSchema), []);
  
  // Memoize default values to prevent recreation on every render
  const defaultValues = useMemo(() => ({
    name: "",
    balance: "0",
    currency: "BRL" as const,
  }), []);

  const form = useForm<BankAccountFormInput>({
    resolver,
    mode: "onTouched", // Less aggressive validation for better performance
    defaultValues,
  });

  // Update form values when account changes
  useEffect(() => {
    if (account) {
      form.reset({
        name: account.name,
        balance: account.balance,
        currency: account.currency,
      });
    }
  }, [account, form]);

  const handleSubmit = (data: BankAccountFormInput) => {
    if (!account) return;

    onSave({
      ...account,
      name: data.name,
      balance: data.balance,
      currency: data.currency,
    });
    handleClose();
  };

  const handleClose = () => {
    form.reset();
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
      size="md"
      variant="edit"
      onOpenChange={onOpenChange}
    >
      <FormModalHeader
        description="Atualize os dados da sua conta bancária"
        icon={EditIcon}
        iconBgColor="bg-orange-500/10"
        iconColor="text-orange-500"
        title="Editar Conta Bancária"
      />

      <FormModalPreview>
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
      </FormModalPreview>

      <FormModalFormWithHook form={form} onSubmit={handleSubmit}>
        <FormModalField
          description="Escolha um nome que facilite a identificação da conta"
          form={form}
          label="Nome da Conta"
          name="name"
          required
        >
          <Input
            autoFocus
            className="h-11"
            placeholder="Ex: Conta Corrente Santander"
            type="text"
            {...form.register("name")}
          />
        </FormModalField>

        <FormModalField
          description="Atualize o saldo atual da sua conta bancária"
          form={form}
          label="Saldo Atual"
          name="balance"
          required
        >
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              R$
            </span>
            <Input
              className="h-11 pl-10"
              min="0"
              placeholder="0,00"
              step="0.01"
              type="number"
              {...form.register("balance")}
            />
          </div>
        </FormModalField>

        <FormModalActions
          form={form}
          isLoading={isLoading}
          submitIcon={SaveIcon}
          submitText="Salvar Alterações"
          onCancel={handleClose}
        />
      </FormModalFormWithHook>
    </FormModal>
  );
}
