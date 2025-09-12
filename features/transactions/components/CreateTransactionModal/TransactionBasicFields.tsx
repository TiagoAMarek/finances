import { Input, BrazilianCurrencyInput } from "@/features/shared/components/ui";
import { FormModalField } from "@/features/shared/components/FormModal";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormInput } from "@/lib/schemas";

interface TransactionBasicFieldsProps {
  form: UseFormReturn<TransactionFormInput>;
}

export function TransactionBasicFields({ form }: TransactionBasicFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormModalField
        form={form}
        name="description"
        label="Descrição"
        required
      >
        <Input
          type="text"
          placeholder="Ex: Compra no supermercado"
          className="h-11"
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
        <BrazilianCurrencyInput form={form} data-testid="amount-input" />
      </FormModalField>
    </div>
  );
}