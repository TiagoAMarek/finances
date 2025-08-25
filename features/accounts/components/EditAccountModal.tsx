import { useMemo } from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreditCardIcon,
  EditIcon,
  SaveIcon,
} from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

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
      onOpenChange={onOpenChange}
      variant="edit"
      size="md"
    >
      <FormModalHeader
        icon={EditIcon}
        iconColor="text-orange-500"
        iconBgColor="bg-orange-500/10"
        title="Editar Conta Bancária"
        description="Atualize os dados da sua conta bancária"
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
          form={form}
          name="name"
          label="Nome da Conta"
          description="Escolha um nome que facilite a identificação da conta"
          required
        >
          <Input
            type="text"
            placeholder="Ex: Conta Corrente Santander"
            className="h-11"
            autoFocus
            {...form.register("name")}
          />
        </FormModalField>

        <FormModalField
          form={form}
          name="balance"
          label="Saldo Atual"
          description="Atualize o saldo atual da sua conta bancária"
          required
        >
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              R$
            </span>
            <Input
              type="number"
              placeholder="0,00"
              className="h-11 pl-10"
              step="0.01"
              min="0"
              {...form.register("balance")}
            />
          </div>
        </FormModalField>

        <FormModalActions
          form={form}
          onCancel={handleClose}
          submitText="Salvar Alterações"
          submitIcon={SaveIcon}
          isLoading={isLoading}
        />
      </FormModalFormWithHook>
    </FormModal>
  );
}
