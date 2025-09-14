import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreditCardIcon,
  EditIcon,
  SaveIcon,
} from "lucide-react";
import { useMemo } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { 
  FormModal,
  FormModalHeader,
  FormModalField,
  FormModalActions,
  FormModalFormWithHook,
  FormModalPreview
} from "@/features/shared/components";
import { Input } from "@/features/shared/components/ui";
import { CreditCard, CreditCardCreateInput, CreditCardCreateSchema } from "@/lib/schemas";

interface EditCardModalProps {
  card: CreditCard | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (card: CreditCard) => void;
  isLoading: boolean;
}

export function EditCardModal({
  card,
  open,
  onOpenChange,
  onSave,
  isLoading,
}: EditCardModalProps) {
  // Memoize resolver to prevent recreation on every render
  const resolver = useMemo(() => zodResolver(CreditCardCreateSchema), []);
  
  // Memoize default values to prevent recreation on every render
  const defaultValues = useMemo(() => ({
    name: "",
    limit: "0",
    currentBill: "0",
  }), []);

  const form = useForm<CreditCardCreateInput>({
    resolver,
    mode: "onTouched", // Less aggressive validation for better performance
    defaultValues,
  });

  // Update form values when card changes
  useEffect(() => {
    if (card) {
      form.reset({
        name: card.name,
        limit: card.limit,
        currentBill: card.currentBill,
      });
    }
  }, [card, form]);

  const handleSubmit = (data: CreditCardCreateInput) => {
    if (!card) return;

    onSave({
      ...card,
      name: data.name,
      limit: data.limit,
      currentBill: data.currentBill,
    });
    handleClose();
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (!card) return null;

  const currentLimit = parseFloat(card.limit);
  const currentBillValue = parseFloat(card.currentBill);
  const usagePercentage = currentLimit > 0 ? (currentBillValue / currentLimit) * 100 : 0;
  const isHighUsage = usagePercentage > 80;

  return (
    <FormModal
      open={open}
      size="md"
      variant="edit"
      onOpenChange={onOpenChange}
    >
      <FormModalHeader
        description="Atualize os dados do seu cartão de crédito"
        icon={EditIcon}
        iconBgColor="bg-orange-500/10"
        iconColor="text-orange-500"
        title="Editar Cartão de Crédito"
      />

      <FormModalPreview>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
            <CreditCardIcon className="h-5 w-5 text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">{card.name}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                Fatura: {formatCurrency(currentBillValue)}
              </span>
              <span>•</span>
              <span
                className={
                  isHighUsage ? "text-amber-600" : "text-muted-foreground"
                }
              >
                {usagePercentage.toFixed(1)}% usado
              </span>
            </div>
          </div>
        </div>
      </FormModalPreview>

      <FormModalFormWithHook form={form} onSubmit={handleSubmit}>
        <FormModalField
          description="Escolha um nome que facilite a identificação do cartão"
          form={form}
          label="Nome do Cartão"
          name="name"
          required
        >
          <Input
            autoFocus
            className="h-11"
            placeholder="Ex: Cartão Principal"
            type="text"
            {...form.register("name")}
          />
        </FormModalField>

        <FormModalField
          description="Atualize o limite disponível do seu cartão"
          form={form}
          label="Limite do Cartão"
          name="limit"
          required
        >
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              R$
            </span>
            <Input
              className="h-11 pl-10"
              min="0"
              placeholder="0,00"
              step="0.01"
              type="number"
              {...form.register("limit")}
            />
          </div>
        </FormModalField>

        <FormModalField
          description="Informe o valor atual da fatura do cartão"
          form={form}
          label="Fatura Atual"
          name="currentBill"
          required
        >
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              R$
            </span>
            <Input
              className="h-11 pl-10"
              min="0"
              placeholder="0,00"
              step="0.01"
              type="number"
              {...form.register("currentBill")}
            />
          </div>
        </FormModalField>

        <FormModalActions
          form={form}
          isLoading={isLoading}
          submitIcon={SaveIcon}
          submitText="Salvar Alterações"
          onCancel={handleClose}
        />
      </FormModalFormWithHook>
    </FormModal>
  );
}
