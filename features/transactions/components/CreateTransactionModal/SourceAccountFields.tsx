import { UseFormReturn, useWatch } from "react-hook-form";
import { TransactionFormInput } from "@/lib/schemas";
import { useEffect } from "react";
import { SourceTypeSelector } from "./SourceTypeSelector";
import { AccountSelector } from "./AccountSelector";
import { CreditCardSelector } from "./CreditCardSelector";

interface BankAccount {
  id: number;
  name: string;
}

interface CreditCard {
  id: number;
  name: string;
}

interface SourceAccountFieldsProps {
  form: UseFormReturn<TransactionFormInput>;
  accounts: BankAccount[];
  creditCards: CreditCard[];
}

export function SourceAccountFields({ form, accounts, creditCards }: SourceAccountFieldsProps) {
  const { setValue } = form;
  
  const sourceType = useWatch({
    control: form.control,
    name: "sourceType",
  });

  // Handle clearing opposite field when source type changes
  useEffect(() => {
    if (sourceType === "account") {
      setValue("creditCardId", undefined);
    } else if (sourceType === "creditCard") {
      setValue("accountId", undefined);
    }
  }, [sourceType, setValue]);

  return (
    <div className="space-y-4">
      <SourceTypeSelector form={form} />

      {sourceType === "account" && (
        <AccountSelector form={form} accounts={accounts} />
      )}

      {sourceType === "creditCard" && (
        <CreditCardSelector form={form} creditCards={creditCards} />
      )}
    </div>
  );
}