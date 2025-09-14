import { Receipt, PlusIcon } from "lucide-react";

import { useGetAccounts } from "@/features/accounts/hooks/data";
import { useGetCategories } from "@/features/categories/hooks/data";
import { useGetCreditCards } from "@/features/credit-cards/hooks/data";
import {
  FormModal,
  FormModalHeader,
  FormModalActions,
  FormModalFormWithHook,
} from "@/features/shared/components/FormModal";
import { TransactionFormInput } from "@/lib/schemas";

import { useTransactionForm } from "../../hooks/ui/useTransactionForm";

import { CategorySelector } from "./CategorySelector";
import { SourceAccountFields } from "./SourceAccountFields";
import { TransactionBasicFields } from "./TransactionBasicFields";
import { TransactionTypeAndDateFields } from "./TransactionTypeAndDateFields";

interface CreateTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TransactionFormInput) => void;
  isLoading: boolean;
}

export function CreateTransactionModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: CreateTransactionModalProps) {
  const { data: accounts = [] } = useGetAccounts();
  const { data: creditCards = [] } = useGetCreditCards();
  const { data: categories = [] } = useGetCategories();

  const { form, handleSubmit, handleClose } = useTransactionForm({
    onSubmit,
    onClose: () => onOpenChange(false),
  });

  return (
    <FormModal open={open} size="lg" onOpenChange={onOpenChange}>
      <FormModalHeader
        description="Registre uma receita, despesa ou transferência"
        icon={Receipt}
        title="Novo Lançamento"
      />

      <FormModalFormWithHook form={form} onSubmit={handleSubmit}>
        <TransactionBasicFields form={form} />
        <TransactionTypeAndDateFields form={form} />
        <CategorySelector categories={categories} form={form} />
        <SourceAccountFields
          accounts={accounts}
          creditCards={creditCards}
          form={form}
        />

        <FormModalActions
          form={form}
          isLoading={isLoading}
          submitIcon={PlusIcon}
          submitText="Criar Lançamento"
          onCancel={handleClose}
        />
      </FormModalFormWithHook>
    </FormModal>
  );
}