import { useGetAccounts } from "@/features/accounts/hooks/data";
import { useGetCategories } from "@/features/categories/hooks/data";
import { useGetCreditCards } from "@/features/credit-cards/hooks/data";
import { 
  FormModal,
  FormModalHeader,
  FormModalField,
  FormModalActions,
  FormModalFormWithHook 
} from "@/features/shared/components/FormModal";


import {
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
  TransactionCreateInput,
  TransactionFormInput,
  TransactionFormSchema,
} from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Receipt } from "lucide-react";
import { useEffect, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { FormModalBase } from "@/features/shared/components/FormModal/FormModalBase";

interface CreateTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TransactionCreateInput) => void;
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

  const form = useForm<TransactionFormInput>({
    resolver: zodResolver(TransactionFormSchema),
    mode: "onChange",
    defaultValues: {
      description: "",
      amount: "",
      type: "expense" as const,
      date: new Date().toISOString().split("T")[0],
      categoryId: undefined,
      accountId: undefined,
      creditCardId: undefined,
    },
  });

  const { watch, setValue, reset } = form;
  const watchedType = watch("type");
  const watchedAccountId = watch("accountId");
  const watchedCreditCardId = watch("creditCardId");

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
      // Convert form data to API data by ensuring categoryId is present for non-transfers
      const createData: TransactionCreateInput = {
        ...data,
        categoryId: data.categoryId,
      };
      onSubmit(createData);
      handleClose();
    },
    [onSubmit, handleClose],
  );

  const handleSourceTypeChange = useCallback(
    (_newSourceType: "account" | "creditCard") => {
      // Clear both fields when switching source type to ensure clean state
      setValue("accountId", undefined);
      setValue("creditCardId", undefined);
    },
    [setValue],
  );

  // Memoized category filtering to prevent unnecessary recalculations
  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      if (category.type === "both") return true;
      return category.type === watchedType;
    });
  }, [categories, watchedType]);

  // Reset category when type changes and current category is not valid
  useEffect(() => {
    const currentCategoryId = watch("categoryId");
    if (currentCategoryId) {
      const currentCategory = categories.find(
        (cat) => cat.id === currentCategoryId,
      );
      if (
        currentCategory &&
        currentCategory.type !== "both" &&
        currentCategory.type !== watchedType
      ) {
        setValue("categoryId", undefined);
      }
    }
  }, [watchedType, categories, watch, setValue]);

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

          <FormModalField form={form} name="amount" label="Valor" required>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                R$
              </span>
              <Input
                type="number"
                placeholder="0,00"
                className="h-11 pl-10"
                step="0.01"
                min="0"
                {...form.register("amount")}
              />
            </div>
          </FormModalField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormModalField form={form} name="type" label="Tipo" required>
            <Select
              value={form.watch("type")}
              onValueChange={(value) =>
                form.setValue("type", value as "income" | "expense")
              }
            >
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
            <Select
              value={form.watch("categoryId")?.toString() || ""}
              onValueChange={(value) =>
                form.setValue("categoryId", value ? parseInt(value) : undefined)
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
                <Select
                  value={form.watch("accountId")?.toString() || ""}
                  onValueChange={(value) =>
                    form.setValue(
                      "accountId",
                      value ? parseInt(value) : undefined,
                    )
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Escolha uma conta bancária" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id.toString()}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Select
                  value={form.watch("creditCardId")?.toString() || ""}
                  onValueChange={(value) =>
                    form.setValue(
                      "creditCardId",
                      value ? parseInt(value) : undefined,
                    )
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
