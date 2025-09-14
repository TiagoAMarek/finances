import { UseFormReturn, Controller } from "react-hook-form";

import { RadioGroup, RadioGroupItem } from "@/features/shared/components/ui";
import { TransactionFormInput } from "@/lib/schemas";

interface SourceTypeSelectorProps {
  form: UseFormReturn<TransactionFormInput>;
}

export function SourceTypeSelector({ form }: SourceTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">
        Origem do Lançamento *
      </label>
      <Controller
        control={form.control}
        name="sourceType"
        render={({ field }) => (
          <RadioGroup
            className="flex flex-col space-y-2"
            value={field.value}
            onValueChange={field.onChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem data-testid="account-radio" id="account-radio" value="account" />
              <label className="cursor-pointer" htmlFor="account-radio">
                🏦 Conta Bancária
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem data-testid="credit-card-radio" id="creditCard-radio" value="creditCard" />
              <label className="cursor-pointer" htmlFor="creditCard-radio">
                💳 Cartão de Crédito
              </label>
            </div>
          </RadioGroup>
        )}
      />
    </div>
  );
}