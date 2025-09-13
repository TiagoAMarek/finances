import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shared/components/ui";
import { FormModalField } from "@/features/shared/components/FormModal";
import { UseFormReturn, Controller } from "react-hook-form";
import { TransactionFormInput } from "@/lib/schemas";

interface TransactionTypeAndDateFieldsProps {
  form: UseFormReturn<TransactionFormInput>;
}

export function TransactionTypeAndDateFields({ form }: TransactionTypeAndDateFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
      <FormModalField form={form} name="type" label="Tipo" required>
        <Controller
          control={form.control}
          name="type"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="h-11 w-full min-w-0 text-left" data-testid="type-select">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">📤</span>
                    Despesa
                  </div>
                </SelectItem>
                <SelectItem value="income">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">📥</span>
                    Receita
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormModalField>

      <FormModalField form={form} name="date" label="Data" required>
        <Input type="date" className="h-11 w-full min-w-0 block" data-testid="date-input" {...form.register("date")} />
      </FormModalField>
    </div>
  );
}
