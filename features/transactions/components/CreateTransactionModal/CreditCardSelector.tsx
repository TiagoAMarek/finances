import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shared/components/ui";
import { FormModalField } from "@/features/shared/components/FormModal";
import { UseFormReturn, Controller } from "react-hook-form";
import { TransactionFormInput } from "@/lib/schemas";

interface CreditCard {
  id: number;
  name: string;
}

interface CreditCardSelectorProps {
  form: UseFormReturn<TransactionFormInput>;
  creditCards: CreditCard[];
}

export function CreditCardSelector({ form, creditCards }: CreditCardSelectorProps) {
  return (
    <FormModalField
      form={form}
      name="creditCardId"
      label="Selecione o Cartão de Crédito"
      required
    >
      <div className="min-w-0">
        <Controller
          control={form.control}
          name="creditCardId"
          render={({ field }) => (
            <Select
              value={field.value?.toString() || ""}
              onValueChange={(value) =>
                field.onChange(value ? parseInt(value) : undefined)
              }
            >
              <SelectTrigger className="h-11 w-full min-w-0 text-left">
                <SelectValue placeholder="Escolha um cartão de crédito" />
              </SelectTrigger>
              <SelectContent>
                {creditCards.map((card) => (
                  <SelectItem key={card.id} value={card.id.toString()}>
                    {card.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {creditCards.length === 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            Nenhum cartão de crédito disponível.
          </p>
        )}
      </div>
    </FormModalField>
  );
}