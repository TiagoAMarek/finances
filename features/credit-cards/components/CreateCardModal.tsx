import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCardIcon, PlusIcon } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { 
  FormModal,
  FormModalHeader,
  FormModalField,
  FormModalActions,
  FormModalFormWithHook,
  QuickCreateButton
} from "@/features/shared/components";
import { Input } from "@/features/shared/components/ui";
import { CreditCardCreateInput, CreditCardCreateSchema } from "@/lib/schemas";

interface CreateCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreditCardCreateInput) => void;
  isLoading: boolean;
}

export function CreateCardModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: CreateCardModalProps) {
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

  const handleSubmit = (data: CreditCardCreateInput) => {
    onSubmit(data);
    handleClose();
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <FormModal
      open={open}
      size="md"
      trigger={
        <QuickCreateButton onClick={() => onOpenChange(true)}>
          Novo Cartão
        </QuickCreateButton>
      }
      variant="create"
      onOpenChange={onOpenChange}
    >
      <FormModalHeader
        description="Cadastre um novo cartão para controlar suas despesas"
        icon={CreditCardIcon}
        iconBgColor="bg-blue-500/10"
        iconColor="text-blue-500"
        title="Novo Cartão de Crédito"
      />

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
          description="Informe o limite disponível do seu cartão de crédito"
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
          description="Valor da fatura atual do cartão (opcional)"
          form={form}
          label="Fatura Atual"
          name="currentBill"
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
          submitIcon={PlusIcon}
          submitText="Criar Cartão"
          onCancel={handleClose}
        />
      </FormModalFormWithHook>
    </FormModal>
  );
}
