import { UseFormReturn, Controller } from "react-hook-form";

import { FormModalField } from "@/features/shared/components/FormModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shared/components/ui";
import { TransactionFormInput } from "@/lib/schemas";

interface BankAccount {
  id: number;
  name: string;
}

interface AccountSelectorProps {
  form: UseFormReturn<TransactionFormInput>;
  accounts: BankAccount[];
}

export function AccountSelector({ form, accounts }: AccountSelectorProps) {
  return (
    <FormModalField
      form={form}
      label="Selecione a Conta Bancária"
      name="accountId"
      required
    >
      <div className="min-w-0">
        <Controller
          control={form.control}
          name="accountId"
          render={({ field }) => (
            <Select
              value={field.value?.toString() || ""}
              onValueChange={(value) =>
                field.onChange(value ? parseInt(value) : undefined)
              }
            >
              <SelectTrigger className="h-11 w-full min-w-0 text-left">
                <SelectValue placeholder="Escolha uma conta bancária" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem
                    key={account.id}
                    value={account.id.toString()}
                  >
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {accounts.length === 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            Nenhuma conta bancária disponível.
          </p>
        )}
      </div>
    </FormModalField>
  );
}