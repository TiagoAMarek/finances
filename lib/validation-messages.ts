/**
 * Centralized Portuguese validation messages for consistent user experience
 * All user-facing error messages should use these standardized messages
 */

export const VALIDATION_MESSAGES = {
  // Required field messages
  required: {
    name: "Nome é obrigatório",
    accountName: "Nome da conta é obrigatório",
    cardName: "Nome do cartão é obrigatório",
    email: "Email é obrigatório",
    password: "Senha é obrigatória",
    confirmPassword: "Confirmação de senha é obrigatória",
    description: "Descrição é obrigatória",
    amount: "Valor é obrigatório",
    date: "Data é obrigatória",
    category: "Categoria é obrigatória",
    type: "Tipo é obrigatório",
    account: "Conta é obrigatória",
    creditCard: "Cartão de crédito é obrigatório",
    balance: "Saldo é obrigatório",
    currency: "Moeda é obrigatória",
    limit: "Limite é obrigatório",
    currentBill: "Fatura atual é obrigatória",
    color: "Cor é obrigatória",
    icon: "Ícone é obrigatório",
  },

  // Format validation messages
  format: {
    email: "Formato de email inválido",
    hexColor: "Cor deve estar no formato hexadecimal (#RRGGBB)",
    positiveNumber: "Valor deve ser um número positivo",
    currency: "Formato de moeda inválido",
    amount: "Valor deve ser um número válido com até 2 casas decimais",
    amountPositive: "Valor deve ser maior que zero",
  },

  // Invalid field messages
  invalid: {
    amount: "Valor inválido",
    creditCard: "Cartão de crédito inválido",
  },

  // File upload validation messages
  file: {
    base64Invalid: "Dados do arquivo devem estar em formato Base64 válido",
    fileNameInvalid: "Nome do arquivo contém caracteres inválidos",
    fileTooLarge: "Arquivo excede o tamanho máximo permitido (10MB)",
    fileNameRequired: "Nome do arquivo é obrigatório",
    fileDataRequired: "Dados do arquivo são obrigatórios",
    bankCodeRequired: "Código do banco é obrigatório",
    bankCodeMax: "Código do banco deve ter no máximo 50 caracteres",
    fileNameMax: "Nome do arquivo deve ter no máximo 255 caracteres",
  },

  // Length validation messages
  length: {
    nameMin: "Nome deve ter pelo menos 2 caracteres",
    passwordMin: "Senha deve ter pelo menos 8 caracteres",
    descriptionMin: "Descrição deve ter pelo menos 1 caractere",
    nameMax: "Nome deve ter no máximo 100 caracteres",
    descriptionMax: "Descrição deve ter no máximo 255 caracteres",
  },

  // Password strength messages
  password: {
    uppercase: "Senha deve conter pelo menos uma letra maiúscula",
    lowercase: "Senha deve conter pelo menos uma letra minúscula",
    number: "Senha deve conter pelo menos um número",
    special: "Senha deve conter pelo menos um caractere especial",
    match: "As senhas não coincidem",
  },

  // Business logic validation messages
  business: {
    categoryRequired: "Categoria é obrigatória",
    categoryRequiredDetailed: "Categoria é obrigatória para receitas e despesas",
    transferAccounts: "Para transferências, conta de origem e destino são obrigatórias e devem ser diferentes",
    singleSource: "Para receitas e despesas, selecione apenas uma conta ou cartão de crédito",
    sameAccount: "Não é possível transferir para a mesma conta",
    insufficientFunds: "Saldo insuficiente para esta operação",
    invalidAmount: "Valor deve ser maior que zero",
  },

  // Enum validation messages
  enums: {
    transactionType: "Tipo deve ser 'receita', 'despesa' ou 'transferência'",
    categoryType: "Tipo deve ser 'receita', 'despesa' ou 'ambos'",
    currency: "Moeda deve ser uma das opções válidas",
  },

  // General error messages
  general: {
    invalidData: "Dados inválidos fornecidos",
    serverError: "Erro interno do servidor. Tente novamente mais tarde.",
    networkError: "Erro de conexão. Verifique sua internet e tente novamente.",
    unauthorized: "Acesso não autorizado. Faça login novamente.",
    forbidden: "Você não tem permissão para esta ação",
    notFound: "Recurso não encontrado",
    conflict: "Conflito de dados. Verifique as informações e tente novamente.",
  },

  // Success messages
  success: {
    created: "Criado com sucesso",
    updated: "Atualizado com sucesso",
    deleted: "Excluído com sucesso",
    saved: "Salvo com sucesso",
    login: "Login realizado com sucesso",
    logout: "Logout realizado com sucesso",
    register: "Cadastro realizado com sucesso",
  },

  // Form-specific messages
  forms: {
    unsavedChanges: "Você tem alterações não salvas. Deseja continuar?",
    confirmDelete: "Tem certeza que deseja excluir este item?",
    processing: "Processando...",
    loading: "Carregando...",
    saving: "Salvando...",
    creating: "Criando...",
    updating: "Atualizando...",
    deleting: "Excluindo...",
  },
} as const;

/**
 * Helper function to get validation message with dynamic values
 */
export function getValidationMessage(
  category: keyof typeof VALIDATION_MESSAGES,
  key: string,
  ...args: string[]
): string {
  const categoryMessages = VALIDATION_MESSAGES[category] as Record<string, string>;
  const message = categoryMessages[key];
  if (!message) {
    console.warn(`Missing validation message: ${category}.${key}`);
    return "Erro de validação";
  }

  // Replace placeholders if any
  return args.reduce((msg, arg, index) => {
    return msg.replace(`{${index}}`, arg);
  }, message);
}

/**
 * Type-safe helper for required field messages
 */
export const requiredMessage = (field: keyof typeof VALIDATION_MESSAGES.required): string => {
  return VALIDATION_MESSAGES.required[field];
};

/**
 * Type-safe helper for format validation messages
 */
export const formatMessage = (format: keyof typeof VALIDATION_MESSAGES.format): string => {
  return VALIDATION_MESSAGES.format[format];
};

/**
 * Type-safe helper for business logic messages
 */
export const businessMessage = (rule: keyof typeof VALIDATION_MESSAGES.business): string => {
  return VALIDATION_MESSAGES.business[rule];
};