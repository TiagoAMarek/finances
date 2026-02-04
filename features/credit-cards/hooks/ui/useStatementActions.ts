import { useState } from "react";
import { toast } from "sonner";

import {
  useUploadStatement,
  useParseStatement,
  useImportStatement,
} from "../data";
import { StatementUploadInput, StatementImportInput } from "@/lib/schemas/credit-card-statements";

/**
 * Hook for managing statement import workflow and UI state
 */
export const useStatementActions = () => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedStatementId, setSelectedStatementId] = useState<number | null>(null);

  const uploadMutation = useUploadStatement();
  const parseMutation = useParseStatement();
  const importMutation = useImportStatement();

  const handleUpload = async (data: StatementUploadInput) => {
    try {
      const result = await uploadMutation.mutateAsync(data);
      toast.success("Fatura enviada com sucesso!");
      
      // Automatically parse the statement after upload
      await handleParse(result.statementId);
      
      setIsImportModalOpen(false);
      return result;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao enviar fatura");
      throw error;
    }
  };

  const handleParse = async (statementId: number) => {
    try {
      const result = await parseMutation.mutateAsync(statementId);
      toast.success("Fatura processada com sucesso!");
      return result;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao processar fatura");
      throw error;
    }
  };

  const handleImport = async (statementId: number, data: StatementImportInput) => {
    try {
      const result = await importMutation.mutateAsync({ statementId, data });
      
      const successMessage = `${result.createdTransactionIds.length} transações importadas com sucesso!`;
      if (result.skippedLineItemIds.length > 0) {
        toast.success(
          `${successMessage} (${result.skippedLineItemIds.length} duplicadas foram ignoradas)`
        );
      } else {
        toast.success(successMessage);
      }
      
      setIsDetailsModalOpen(false);
      setSelectedStatementId(null);
      return result;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao importar fatura");
      throw error;
    }
  };

  const openImportModal = () => {
    setIsImportModalOpen(true);
  };

  const closeImportModal = () => {
    setIsImportModalOpen(false);
  };

  const openDetailsModal = (statementId: number) => {
    setSelectedStatementId(statementId);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedStatementId(null);
  };

  return {
    // State
    isImportModalOpen,
    isDetailsModalOpen,
    selectedStatementId,
    
    // Loading states
    isUploading: uploadMutation.isPending,
    isParsing: parseMutation.isPending,
    isImporting: importMutation.isPending,
    
    // Actions
    handleUpload,
    handleParse,
    handleImport,
    openImportModal,
    closeImportModal,
    openDetailsModal,
    closeDetailsModal,
  };
};
