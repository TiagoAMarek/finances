import { useMemo } from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCardIcon, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";

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
      onOpenChange={onOpenChange}
      variant="create"
      size="md"
      trigger={
        <QuickCreateButton onClick={() => onOpenChange(true)}>
          Novo Cartão
        </QuickCreateButton>
      }
    >
      <FormModalHeader
        icon={CreditCardIcon}
        iconColor="text-blue-500"
        iconBgColor="bg-blue-500/10"
        title="Novo Cartão de Crédito"
        description="Cadastre um novo cartão para controlar suas despesas"
      />

      <FormModalFormWithHook form={form} onSubmit={handleSubmit}>
        <FormModalField
          form={form}
          name="name"
          label="Nome do Cartão"
          description="Escolha um nome que facilite a identificação do cartão"
          required
        >
          <Input
            type="text"
            placeholder="Ex: Cartão Principal"
            className="h-11"
            autoFocus
            {...form.register("name")}
          />
        </FormModalField>

        <FormModalField
          form={form}
          name="limit"
          label="Limite do Cartão"
          description="Informe o limite disponível do seu cartão de crédito"
          required
        >
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
              {...form.register("limit")}
            />
          </div>
        </FormModalField>

        <FormModalField
          form={form}
          name="currentBill"
          label="Fatura Atual"
          description="Valor da fatura atual do cartão (opcional)"
        >
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
              {...form.register("currentBill")}
            />
          </div>
        </FormModalField>

        <FormModalActions
          form={form}
          onCancel={handleClose}
          submitText="Criar Cartão"
          submitIcon={PlusIcon}
          isLoading={isLoading}
        />
      </FormModalFormWithHook>
    </FormModal>
  );
}
