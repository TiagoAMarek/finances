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
import { Receipt, PlusIcon } from "lucide-react";
import { useTransactionForm } from "../../hooks/ui/useTransactionForm";
import { TransactionBasicFields } from "./TransactionBasicFields";
import { TransactionTypeAndDateFields } from "./TransactionTypeAndDateFields";
import { CategorySelector } from "./CategorySelector";
import { SourceAccountFields } from "./SourceAccountFields";

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
    <FormModal open={open} onOpenChange={onOpenChange} size="lg">
      <FormModalHeader
        icon={Receipt}
        title="Novo Lançamento"
        description="Registre uma receita, despesa ou transferência"
      />

      <FormModalFormWithHook form={form} onSubmit={handleSubmit}>
        <TransactionBasicFields form={form} />
        <TransactionTypeAndDateFields form={form} />
        <CategorySelector form={form} categories={categories} />
        <SourceAccountFields
          form={form}
          accounts={accounts}
          creditCards={creditCards}
        />

        <FormModalActions
          form={form}
          onCancel={handleClose}
          submitText="Criar Lançamento"
          submitIcon={PlusIcon}
          isLoading={isLoading}
        />
      </FormModalFormWithHook>
    </FormModal>
  );
}