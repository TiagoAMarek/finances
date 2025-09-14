import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCardIcon, PlusIcon } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { QuickCreateButton } from "@/features/shared/components";
import { TextField, CurrencyField } from "@/features/shared/components/FormFields";
import {
  FormModal,
  FormModalHeader,
  FormModalActions,
  FormModalFormWithHook
} from "@/features/shared/components/FormModal";
import {
  BankAccountCreateInput,
  BankAccountFormInput,
  BankAccountFormSchema,
} from "@/lib/schemas";

interface CreateAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BankAccountCreateInput) => void;
  isLoading: boolean;
  errorMessage?: string;
}

export function CreateAccountModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  errorMessage,
}: CreateAccountModalProps) {
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

  const handleSubmit = (data: BankAccountFormInput) => {
    // Convert form data to API data with defaults
    const createData: BankAccountCreateInput = {
      ...data,
      balance: data.balance || "0",
      currency: data.currency || "BRL",
    };
    onSubmit(createData);
    handleClose();
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <FormModal
      confirmOnDirtyClose={true}
      open={open}
      size="md"
      trigger={
        <QuickCreateButton onClick={() => onOpenChange(true)}>
          Nova Conta
        </QuickCreateButton>
      }
      variant="create"
      onOpenChange={onOpenChange}
    >
      <FormModalHeader
        description="Cadastre uma nova conta para controlar suas finanças pessoais"
        icon={CreditCardIcon}
        iconBgColor="bg-primary/10"
        iconColor="text-primary"
        title="Nova Conta Bancária"
      />

       <FormModalFormWithHook
         form={form}
         nonFieldError={errorMessage}
         onSubmit={handleSubmit}
       >
         <TextField
           autoFocus
           description="Escolha um nome que facilite a identificação da conta"
           form={form}
           label="Nome da Conta"
           name="name"
           placeholder="Ex: Conta Corrente Santander"
           required
         />

         <CurrencyField
           description="Informe o saldo atual da sua conta bancária"
           form={form}
           label="Saldo Inicial"
           name="balance"
           placeholder="0,00"
           required
         />

        <FormModalActions
          form={form}
          isLoading={isLoading}
          submitIcon={PlusIcon}
          submitText="Criar Conta"
          onCancel={handleClose}
        />
      </FormModalFormWithHook>
    </FormModal>
  );
}
