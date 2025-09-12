import { Input, BrazilianCurrencyInput } from "@/features/shared/components/ui";
import { FormModalField } from "@/features/shared/components/FormModal";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormInput } from "@/lib/schemas";

interface TransactionBasicFieldsProps {
  form: UseFormReturn<TransactionFormInput>;
}

export function TransactionBasicFields({ form }: TransactionBasicFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
      <FormModalField
        form={form}
        name="description"
        label="Descrição"
        required
      >
        <Input
          type="text"
          placeholder="Ex: Compra no supermercado"
          className="h-11 w-full min-w-0"
          autoFocus
          data-testid="description-input"
          {...form.register("description")}
        />
      </FormModalField>

      <FormModalField
        form={form}
        name="amount"
        label="Valor"
        required
      >
        <BrazilianCurrencyInput
          form={form}
          name="amount"
          data-testid="amount-input"
          className="h-11 pl-10 w-full min-w-0"
        />
      </FormModalField>
    </div>
  );
}
