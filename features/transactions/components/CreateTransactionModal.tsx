import { useGetAccounts } from "@/features/accounts/hooks/data";
import { useGetCategories } from "@/features/categories/hooks/data";
import { useGetCreditCards } from "@/features/credit-cards/hooks/data";
import {
  FormModal,
  FormModalHeader,
  FormModalField,
  FormModalActions,
  FormModalFormWithHook,
} from "@/features/shared/components/FormModal";

import {
  BrazilianCurrencyInput,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui";

import {
  TransactionFormInput,
  TransactionFormSchema,
} from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Receipt } from "lucide-react";
import { useEffect, useMemo, useCallback } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";


interface CreateTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TransactionFormInput) => void;
  isLoading: boolean;
}

export function CreateTransactionModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: CreateTransactionModalProps) {
  const { data: accounts = [] } = useGetAccounts();
  const { data: creditCards = [] } = useGetCreditCards();
  const { data: categories = [] } = useGetCategories();

  // Memoize resolver to prevent recreation on every render
  const resolver = useMemo(() => zodResolver(TransactionFormSchema), []);

  // Memoize default values to prevent recreation on every render
  const defaultValues = useMemo(() => ({
    description: "",
    amount: "",
    type: "expense" as const,
    date: new Date().toISOString().split("T")[0],
    categoryId: undefined,
    accountId: undefined,
    creditCardId: undefined,
  }), []);

  const form = useForm<TransactionFormInput>({
    resolver,
    mode: "onTouched", // Less aggressive validation for better performance
    defaultValues,
  });

  const { setValue, reset } = form;

  // Replace multiple watch() calls with a single useWatch subscription
  // This reduces re-renders by subscribing to multiple fields at once
  const watchedFields = useWatch({
    control: form.control,
    name: ["type", "accountId", "creditCardId"],
  });

  const [watchedType, watchedAccountId, watchedCreditCardId] = watchedFields;

  // Memoized source type determination
  const sourceType = useMemo(() => {
    return watchedAccountId
      ? "account"
      : watchedCreditCardId
        ? "creditCard"
        : "account";
  }, [watchedAccountId, watchedCreditCardId]);

  const handleClose = useCallback(() => {
    reset();
    onOpenChange(false);
  }, [reset, onOpenChange]);

  const handleSubmit = useCallback(
    (data: TransactionFormInput) => {
      onSubmit(data);
    },
    [onSubmit],
  );

  const handleSourceTypeChange = useCallback(() => {
    // Clear both fields when switching source type to ensure clean state
    setValue("accountId", undefined);
    setValue("creditCardId", undefined);
  }, [setValue]);

  // Memoized category filtering to prevent unnecessary recalculations
  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      if (category.type === "both") return true;
      return category.type === watchedType;
    });
  }, [categories, watchedType]);

  // Get current categoryId to check if it needs to be reset
  const watchedCategoryId = useWatch({
    control: form.control,
    name: "categoryId",
  });

  // Reset category when type changes and current category is not valid
  useEffect(() => {
    if (watchedCategoryId) {
      const currentCategory = categories.find(
        (cat) => cat.id === watchedCategoryId,
      );
      if (
        currentCategory &&
        currentCategory.type !== "both" &&
        currentCategory.type !== watchedType
      ) {
        setValue("categoryId", undefined);
      }
    }
  }, [watchedType, categories, watchedCategoryId, setValue]);

  return (
    <FormModal open={open} onOpenChange={onOpenChange} size="lg">
      <FormModalHeader
        icon={Receipt}
        title="Novo Lançamento"
        description="Registre uma receita, despesa ou transferência"
      />

      <FormModalFormWithHook form={form} onSubmit={handleSubmit}>
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
              {...form.register("description")}
            />
          </FormModalField>

          <FormModalField
            form={form}
            name="amount"
            label="Valor"
            required
          >
            <BrazilianCurrencyInput {...form.register("amount")} />
          </FormModalField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormModalField form={form} name="type" label="Tipo" required>
            <Controller
              control={form.control}
              name="type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-11">
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
            <Input type="date" className="h-11" {...form.register("date")} />
          </FormModalField>
        </div>

        <FormModalField
          form={form}
          name="categoryId"
          label="Categoria"
          required
        >
          <div>
            <Controller
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <Select
                  value={field.value?.toString() || ""}
                  onValueChange={(value) =>
                    field.onChange(value ? parseInt(value) : undefined)
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: category.color || "#64748b",
                            }}
                          />
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {filteredCategories.length === 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Nenhuma categoria disponível para este tipo de transação.
              </p>
            )}
          </div>
        </FormModalField>

        <div className="space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Origem do Lançamento *
            </label>
            <RadioGroup
              value={sourceType}
              onValueChange={handleSourceTypeChange}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="account" id="account-radio" />
                <label htmlFor="account-radio" className="cursor-pointer">
                  🏦 Conta Bancária
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="creditCard" id="creditCard-radio" />
                <label htmlFor="creditCard-radio" className="cursor-pointer">
                  💳 Cartão de Crédito
                </label>
              </div>
            </RadioGroup>
          </div>

          {sourceType === "account" && (
            <FormModalField
              form={form}
              name="accountId"
              label="Selecione a Conta Bancária"
              required
            >
              <div>
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
                      <SelectTrigger className="h-11">
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
          )}

          {sourceType === "creditCard" && (
            <FormModalField
              form={form}
              name="creditCardId"
              label="Selecione o Cartão de Crédito"
              required
            >
              <div>
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
                      <SelectTrigger className="h-11">
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
          )}
        </div>

        <FormModalActions
          form={form}
          onCancel={handleClose}
          submitText="Criar Lançamento"
          submitIcon={PlusIcon}
          isLoading={isLoading}
        />
      </FormModalFormWithHook>
    </FormModal>
  );
}
