import { useEffect } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";

import { TransactionFormInput } from "@/lib/schemas";

import { AccountSelector } from "./AccountSelector";
import { CreditCardSelector } from "./CreditCardSelector";
import { SourceTypeSelector } from "./SourceTypeSelector";

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
    <div className="space-y-4 min-w-0">
      <SourceTypeSelector form={form} />

      {sourceType === "account" && (
        <AccountSelector accounts={accounts} form={form} />
      )}

      {sourceType === "creditCard" && (
        <CreditCardSelector creditCards={creditCards} form={form} />
      )}
    </div>
  );
}
