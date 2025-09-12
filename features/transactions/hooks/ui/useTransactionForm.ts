import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionFormInput, TransactionFormSchema } from "@/lib/schemas";
import { useMemo, useCallback } from "react";

interface UseTransactionFormProps {
  onSubmit: (data: TransactionFormInput) => void;
  onClose: () => void;
}

interface UseTransactionFormReturn {
  form: UseFormReturn<TransactionFormInput>;
  handleSubmit: (data: TransactionFormInput) => void;
  handleClose: () => void;
}

export function useTransactionForm({ 
  onSubmit, 
  onClose 
}: UseTransactionFormProps): UseTransactionFormReturn {
  // Memoize resolver to prevent recreation on every render
  const resolver = useMemo(() => zodResolver(TransactionFormSchema), []);

  // Memoize default values to prevent recreation on every render
  const defaultValues: TransactionFormInput = useMemo(() => ({
    description: "",
    amount: "",
    type: "expense" as const,
    date: new Date().toISOString().split("T")[0],
    categoryId: undefined,
    accountId: undefined,
    creditCardId: undefined,
    sourceType: "account",
  }), []);

  const form = useForm<TransactionFormInput>({
    resolver,
    mode: "onTouched", // Less aggressive validation for better performance
    defaultValues,
  });

  const handleClose = useCallback(() => {
    form.reset();
    onClose();
  }, [form, onClose]);

  const handleSubmit = useCallback(
    (data: TransactionFormInput) => {
      onSubmit(data);
      // Close modal after successful submission
      onClose();
    },
    [onSubmit, onClose],
  );

  return {
    form,
    handleSubmit,
    handleClose,
  };
}