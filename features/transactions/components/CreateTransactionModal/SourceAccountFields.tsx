import { UseFormReturn, useWatch } from "react-hook-form";
import { TransactionFormInput } from "@/lib/schemas";
import { useEffect, useRef } from "react";
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
  const prevSourceTypeRef = useRef<string | undefined>(undefined);
  const isInitialRender = useRef(true);
  
  const sourceType = useWatch({
    control: form.control,
    name: "sourceType",
  });

  // Handle clearing opposite field when source type changes
  // Skip updates on initial render to avoid state update warnings
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      prevSourceTypeRef.current = sourceType;
      return;
    }

    if (prevSourceTypeRef.current !== sourceType) {
      prevSourceTypeRef.current = sourceType;
      
      // Clear opposite field based on current selection
      if (sourceType === "account") {
        setValue("creditCardId", undefined);
      } else if (sourceType === "creditCard") {
        setValue("accountId", undefined);
      }
    }
  }, [sourceType, setValue]);

  return (
    <div className="space-y-4 min-w-0">
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
