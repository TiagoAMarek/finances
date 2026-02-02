"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, AlertCircle } from "lucide-react";
import { z } from "zod";
import { useMemo, useState } from "react";

import { FormModal, FormModalHeader, FormModalFormWithHook, FormModalField, FormModalActions } from "@/features/shared/components/FormModal";
import { SelectField } from "@/features/shared/components/FormFields";
import { Input, Alert, AlertDescription } from "@/features/shared/components/ui";
import { useGetCreditCards } from "../hooks/data";
import { StatementUploadInput } from "@/lib/schemas/credit-card-statements";
import type { CreditCard } from "@/lib/schemas/credit-cards";

const SUPPORTED_BANKS = [
  { value: "itau", label: "Itaú" },
  // Add more banks as parsers are implemented
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const uploadSchema = z.object({
  creditCardId: z.number({
    required_error: "Selecione um cartão de crédito",
  }),
  bankCode: z.string({
    required_error: "Selecione o banco",
  }),
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Selecione um arquivo PDF")
    .refine(
      (files) => files[0]?.type === "application/pdf",
      "O arquivo deve ser um PDF"
    )
    .refine(
      (files) => files[0]?.size <= MAX_FILE_SIZE,
      "O arquivo deve ter no máximo 10MB"
    ),
});

type UploadFormData = z.infer<typeof uploadSchema>;

interface ImportStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StatementUploadInput) => Promise<void>;
  isLoading?: boolean;
}

export function ImportStatementModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: ImportStatementModalProps) {
  const { data: creditCards, isLoading: isLoadingCards } = useGetCreditCards();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
  });

  const creditCardOptions = useMemo(
    () =>
      creditCards?.map((card: CreditCard) => ({
        value: card.id,
        label: card.name,
      })) ?? [],
    [creditCards]
  );

  const handleFormSubmit = async (data: UploadFormData) => {
    setError(null);
    
    try {
      const file = data.file[0];
      
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove the data:application/pdf;base64, prefix
          const base64Data = result.split(",")[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      await onSubmit({
        creditCardId: data.creditCardId,
        bankCode: data.bankCode,
        fileName: file.name,
        fileData: base64,
      });

      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer upload");
    }
  };

  return (
    <FormModal
      open={isOpen}
      onOpenChange={onClose}
      variant="create"
    >
      <FormModalHeader
        icon={Upload}
        title="Importar Fatura"
        description="Faça upload do PDF da fatura do seu cartão de crédito"
      />

      <FormModalFormWithHook
        form={form}
        onSubmit={handleFormSubmit}
      >
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <SelectField
          form={form}
          name="creditCardId"
          label="Cartão de Crédito"
          placeholder="Selecione o cartão"
          options={creditCardOptions}
          disabled={isLoadingCards}
          required
        />

        <SelectField
          form={form}
          name="bankCode"
          label="Banco"
          placeholder="Selecione o banco"
          options={SUPPORTED_BANKS}
          required
        />

        <FormModalField
          form={form}
          name="file"
          label="Arquivo PDF"
          required
        >
          <Input
            type="file"
            accept="application/pdf"
            {...form.register("file")}
            disabled={isLoading}
          />
        </FormModalField>

        <FormModalActions
          form={form}
          submitText="Enviar e Processar"
          cancelText="Cancelar"
          isLoading={isLoading}
          onCancel={onClose}
        />
      </FormModalFormWithHook>
    </FormModal>
  );
}
