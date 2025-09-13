import { RadioGroup, RadioGroupItem } from "@/features/shared/components/ui";
import { UseFormReturn, Controller } from "react-hook-form";
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
            value={field.value}
            onValueChange={field.onChange}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="account" id="account-radio" data-testid="account-radio" />
              <label htmlFor="account-radio" className="cursor-pointer">
                🏦 Conta Bancária
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="creditCard" id="creditCard-radio" data-testid="credit-card-radio" />
              <label htmlFor="creditCard-radio" className="cursor-pointer">
                💳 Cartão de Crédito
              </label>
            </div>
          </RadioGroup>
        )}
      />
    </div>
  );
}