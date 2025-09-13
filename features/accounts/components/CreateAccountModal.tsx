import { useMemo } from "react";
import {
  FormModal,
  FormModalHeader,
  FormModalActions,
  FormModalFormWithHook
} from "@/features/shared/components/FormModal";
import { QuickCreateButton } from "@/features/shared/components";
import { TextField, CurrencyField } from "@/features/shared/components/FormFields";
import {
  BankAccountCreateInput,
  BankAccountFormInput,
  BankAccountFormSchema,
} from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCardIcon, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";

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
      open={open}
      onOpenChange={onOpenChange}
      variant="create"
      size="md"
      confirmOnDirtyClose={true}
      trigger={
        <QuickCreateButton onClick={() => onOpenChange(true)}>
          Nova Conta
        </QuickCreateButton>
      }
    >
      <FormModalHeader
        icon={CreditCardIcon}
        iconColor="text-primary"
        iconBgColor="bg-primary/10"
        title="Nova Conta Bancária"
        description="Cadastre uma nova conta para controlar suas finanças pessoais"
      />

       <FormModalFormWithHook
         form={form}
         onSubmit={handleSubmit}
         nonFieldError={errorMessage}
       >
         <TextField
           form={form}
           name="name"
           label="Nome da Conta"
           description="Escolha um nome que facilite a identificação da conta"
           required
           placeholder="Ex: Conta Corrente Santander"
           autoFocus
         />

         <CurrencyField
           form={form}
           name="balance"
           label="Saldo Inicial"
           description="Informe o saldo atual da sua conta bancária"
           required
           placeholder="0,00"
         />

        <FormModalActions
          form={form}
          onCancel={handleClose}
          submitText="Criar Conta"
          submitIcon={PlusIcon}
          isLoading={isLoading}
        />
      </FormModalFormWithHook>
    </FormModal>
  );
}
