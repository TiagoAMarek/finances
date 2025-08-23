import { FormModal, QuickCreateButton } from "@/features/shared/components";
import { Input, Label } from "@/features/shared/components/ui";
import {
  CreditCardIcon,
  DollarSignIcon,
  PlusIcon,
} from "lucide-react";
import { useState } from "react";

interface CreateCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    name: string;
    limit: string;
    currentBill: string;
  }) => void;
  isLoading: boolean;
}

export function CreateCardModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: CreateCardModalProps) {
  const [name, setName] = useState("");
  const [limit, setLimit] = useState<number>(0);
  const [currentBill, setCurrentBill] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      limit: limit.toString(),
      currentBill: currentBill.toString(),
    });
    setName("");
    setLimit(0);
  };

  const resetForm = () => {
    setName("");
    setLimit(0);
    setCurrentBill(0);
  };

  const handleClose = () => {
    resetForm();
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
      <FormModal.Header
        icon={CreditCardIcon}
        iconColor="text-blue-500"
        iconBgColor="bg-blue-500/10"
        title="Novo Cartão de Crédito"
        description="Cadastre um novo cartão para controlar suas despesas"
      />

      <FormModal.Form onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label
            htmlFor="cardName"
            className="text-sm font-medium flex items-center gap-2"
          >
            <CreditCardIcon className="h-4 w-4" />
            Nome do Cartão
          </Label>
          <Input
            type="text"
            id="cardName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Cartão Principal"
            className="h-11"
            autoFocus
            required
          />
          <p className="text-xs text-muted-foreground">
            Escolha um nome que facilite a identificação do cartão
          </p>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="cardLimit"
            className="text-sm font-medium flex items-center gap-2"
          >
            <DollarSignIcon className="h-4 w-4" />
            Limite do Cartão
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              R$
            </span>
            <Input
              type="number"
              id="cardLimit"
              value={limit || ""}
              onChange={(e) => setLimit(parseFloat(e.target.value) || 0)}
              placeholder="0,00"
              className="h-11 pl-10"
              step="0.01"
              min="0"
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Informe o limite disponível do seu cartão de crédito
          </p>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="currentBill"
            className="text-sm font-medium flex items-center gap-2"
          >
            <DollarSignIcon className="h-4 w-4" />
            Fatura Atual
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              R$
            </span>
            <Input
              type="number"
              id="currentBill"
              value={currentBill || ""}
              onChange={(e) =>
                setCurrentBill(parseFloat(e.target.value) || 0)
              }
              placeholder="0,00"
              className="h-11 pl-10"
              step="0.01"
              min="0"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Valor da fatura atual do cartão (opcional)
          </p>
        </div>

        <FormModal.Actions
          onCancel={handleClose}
          submitText="Criar Cartão"
          submitIcon={PlusIcon}
          isLoading={isLoading}
          isDisabled={!name.trim()}
        />
      </FormModal.Form>
    </FormModal>
  );
}
