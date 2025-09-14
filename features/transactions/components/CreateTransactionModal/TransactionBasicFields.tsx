import { UseFormReturn } from "react-hook-form";

import { FormModalField } from "@/features/shared/components/FormModal";
import { Input, BrazilianCurrencyInput } from "@/features/shared/components/ui";
import { TransactionFormInput } from "@/lib/schemas";

interface TransactionBasicFieldsProps {
  form: UseFormReturn<TransactionFormInput>;
}

export function TransactionBasicFields({ form }: TransactionBasicFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
      <FormModalField
        form={form}
        label="Descrição"
        name="description"
        required
      >
        <Input
          autoFocus
          className="h-11 w-full min-w-0"
          data-testid="description-input"
          placeholder="Ex: Compra no supermercado"
          type="text"
          {...form.register("description")}
        />
      </FormModalField>

      <FormModalField
        form={form}
        label="Valor"
        name="amount"
        required
      >
        <BrazilianCurrencyInput
          className="h-11 pl-10 w-full min-w-0"
          data-testid="amount-input"
          form={form}
          name="amount"
        />
      </FormModalField>
    </div>
  );
}
