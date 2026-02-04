import type {
  CreditCardStatementWithCard,
  LineItemWithRelations,
} from "@/lib/schemas/credit-card-statements";

/**
 * Mock Statements
 * 4 statements with different statuses for comprehensive testing
 */
export const mockStatements: CreditCardStatementWithCard[] = [
  {
    // Statement 1: PENDING - Just uploaded, not yet parsed
    id: 1,
    creditCardId: 1,
    ownerId: 1,
    bankCode: "itau",
    statementDate: "2024-02-01",
    dueDate: "2024-02-15",
    previousBalance: "500.00",
    paymentsReceived: "0.00",
    purchases: "0.00",
    fees: "0.00",
    interest: "0.00",
    totalAmount: "0.00",
    fileName: "fatura-itau-fev-2024.pdf",
    fileHash: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
    status: "pending",
    importedAt: null,
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
    creditCard: {
      id: 1,
      name: "Cartão Platinum",
      limit: "10000.00",
      currentBill: "500.00",
    },
  },
  {
    // Statement 2: REVIEWED - Parsed, has line items, ready to import
    id: 2,
    creditCardId: 2,
    ownerId: 1,
    bankCode: "itau",
    statementDate: "2024-01-01",
    dueDate: "2024-01-15",
    previousBalance: "0.00",
    paymentsReceived: "0.00",
    purchases: "1450.75",
    fees: "15.00",
    interest: "0.00",
    totalAmount: "1465.75",
    fileName: "fatura-itau-jan-2024.pdf",
    fileHash: "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
    status: "reviewed",
    importedAt: null,
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T11:30:00Z",
    creditCard: {
      id: 2,
      name: "Cartão Gold",
      limit: "5000.00",
      currentBill: "0.00",
    },
  },
  {
    // Statement 3: IMPORTED - Already processed
    id: 3,
    creditCardId: 1,
    ownerId: 1,
    bankCode: "itau",
    statementDate: "2023-12-01",
    dueDate: "2023-12-15",
    previousBalance: "0.00",
    paymentsReceived: "0.00",
    purchases: "850.50",
    fees: "0.00",
    interest: "0.00",
    totalAmount: "850.50",
    fileName: "fatura-itau-dez-2023.pdf",
    fileHash: "c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
    status: "imported",
    importedAt: "2023-12-20T14:30:00Z",
    createdAt: "2023-12-15T10:00:00Z",
    updatedAt: "2023-12-20T14:30:00Z",
    creditCard: {
      id: 1,
      name: "Cartão Platinum",
      limit: "10000.00",
      currentBill: "500.00",
    },
  },
  {
    // Statement 4: CANCELLED - User cancelled
    id: 4,
    creditCardId: 3,
    ownerId: 1,
    bankCode: "itau",
    statementDate: "2024-01-01",
    dueDate: "2024-01-20",
    previousBalance: "0.00",
    paymentsReceived: "0.00",
    purchases: "0.00",
    fees: "0.00",
    interest: "0.00",
    totalAmount: "0.00",
    fileName: "fatura-errada.pdf",
    fileHash: "d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
    status: "cancelled",
    importedAt: null,
    createdAt: "2024-01-25T10:00:00Z",
    updatedAt: "2024-01-25T10:05:00Z",
    creditCard: {
      id: 3,
      name: "Cartão Empresarial",
      limit: "20000.00",
      currentBill: "0.00",
    },
  },
];

/**
 * Mock Line Items
 * 18 line items for Statement 2 (reviewed status)
 * Includes regular purchases, duplicates, various categories
 */
export const mockLineItems: LineItemWithRelations[] = [
  // Regular purchases with AI-suggested categories
  {
    id: 1,
    statementId: 2,
    date: "2024-01-05",
    description: "SUPERMERCADO EXTRA SAO PAULO BR",
    amount: "245.80",
    type: "purchase",
    category: null,
    suggestedCategoryId: 4,
    finalCategoryId: null,
    transactionId: null,
    isDuplicate: false,
    duplicateReason: null,
    rawData: null,
    createdAt: "2024-01-20T11:30:00Z",
    suggestedCategory: {
      id: 4,
      name: "Alimentação",
      type: "expense",
    },
    finalCategory: null,
    duplicateOf: null,
  },
  {
    id: 2,
    statementId: 2,
    date: "2024-01-06",
    description: "UBER *TRIP SAO PAULO BR",
    amount: "32.50",
    type: "purchase",
    category: null,
    suggestedCategoryId: 5,
    finalCategoryId: null,
    transactionId: null,
    isDuplicate: true,
    duplicateReason: "Transação similar encontrada: mesma data, valor e descrição",
    rawData: null,
    createdAt: "2024-01-20T11:30:00Z",
    suggestedCategory: {
      id: 5,
      name: "Transporte",
      type: "expense",
    },
    finalCategory: null,
    duplicateOf: {
      id: 1,
      date: new Date("2024-01-06"),
      amount: "32.50",
      description: "Uber",
    },
  },
  {
    id: 3,
    statementId: 2,
    date: "2024-01-07",
    description: "IFOOD *RESTAURANTE ITALIANO",
    amount: "58.90",
    type: "purchase",
    category: null,
    suggestedCategoryId: 4,
    finalCategoryId: null,
    transactionId: null,
    isDuplicate: false,
    duplicateReason: null,
    rawData: null,
    createdAt: "2024-01-20T11:30:00Z",
    suggestedCategory: {
      id: 4,
      name: "Alimentação",
      type: "expense",
    },
    finalCategory: null,
    duplicateOf: null,
  },
  {
    id: 4,
    statementId: 2,
    date: "2024-01-08",
    description: "NETFLIX.COM SAO PAULO BR",
    amount: "45.90",
    type: "purchase",
    category: null,
    suggestedCategoryId: 6,
    finalCategoryId: null,
    transactionId: null,
    isDuplicate: false,
    duplicateReason: null,
    rawData: null,
    createdAt: "2024-01-20T11:30:00Z",
    suggestedCategory: {
      id: 6,
      name: "Lazer",
      type: "expense",
    },
    finalCategory: null,
    duplicateOf: null,
  },
  {
    id: 5,
    statementId: 2,
    date: "2024-01-09",
    description: "FARMACIA DROGASIL",
    amount: "127.50",
    type: "purchase",
    category: null,
    suggestedCategoryId: 7,
    finalCategoryId: null,
    transactionId: null,
    isDuplicate: false,
    duplicateReason: null,
    rawData: null,
    createdAt: "2024-01-20T11:30:00Z",
    suggestedCategory: {
      id: 7,
      name: "Saúde",
      type: "expense",
    },
    finalCategory: null,
    duplicateOf: null,
  },
  {
    id: 6,
    statementId: 2,
    date: "2024-01-10",
    description: "POSTO IPIRANGA",
    amount: "180.00",
    type: "purchase",
    category: null,
    suggestedCategoryId: 5,
    finalCategoryId: null,
    transactionId: null,
    isDuplicate: false,
    duplicateReason: null,
    rawData: null,
    createdAt: "2024-01-20T11:30:00Z",
    suggestedCategory: {
      id: 5,
      name: "Transporte",
      type: "expense",
    },
    finalCategory: null,
    duplicateOf: null,
  },
  {
    id: 7,
    statementId: 2,
    date: "2024-01-11",
    description: "SPOTIFY BRASIL",
    amount: "21.90",
    type: "purchase",
    category: null,
    suggestedCategoryId: 6,
    finalCategoryId: null,
    transactionId: null,
    isDuplicate: true,
    duplicateReason: "Transação similar encontrada: mesma data, valor e descrição",
    rawData: null,
    createdAt: "2024-01-20T11:30:00Z",
    suggestedCategory: {
      id: 6,
      name: "Lazer",
      type: "expense",
    },
    finalCategory: null,
    duplicateOf: {
      id: 2,
      date: new Date("2024-01-11"),
      amount: "21.90",
      description: "Spotify Premium",
    },
  },
  {
    id: 8,
    statementId: 2,
    date: "2024-01-12",
    description: "99 *CORRIDA SP",
    amount: "28.50",
    type: "purchase",
    category: null,
    suggestedCategoryId: 5,
    finalCategoryId: null,
    transactionId: null,
    isDuplicate: false,
    duplicateReason: null,
    rawData: null,
    createdAt: "2024-01-20T11:30:00Z",
    suggestedCategory: {
      id: 5,
      name: "Transporte",
      type: "expense",
    },
    finalCategory: null,
    duplicateOf: null,
  },
  {
    id: 9,
    statementId: 2,
    date: "2024-01-13",
    description: "RESTAURANTE VILLA ROMA",
    amount: "145.00",
    type: "purchase",
    category: null,
    suggestedCategoryId: 4,
    finalCategoryId: null,
    transactionId: null,
    isDuplicate: false,
    duplicateReason: null,
    rawData: null,
    createdAt: "2024-01-20T11:30:00Z",
    suggestedCategory: {
      id: 4,
      name: "Alimentação",
      type: "expense",
    },
    finalCategory: null,
    duplicateOf: null,
  },
  {
    id: 10,
    statementId: 2,
    date: "2024-01-14",
    description: "CINEMA CINEMARK",
    amount: "68.00",
    type: "purchase",
    category: null,
    suggestedCategoryId: 6,
    finalCategoryId: null,
    transactionId: null,
    isDuplicate: false,
    duplicateReason: null,
    rawData: null,
    createdAt: "2024-01-20T11:30:00Z",
    suggestedCategory: {
      id: 6,
      name: "Lazer",
      type: "expense",
    },
    finalCategory: null,
    duplicateOf: null,
  },
  {
    id: 11,
    statementId: 2,
    date: "2024-01-15",
    description: "PADARIA E CONFEITARIA",
    amount: "42.30",
    type: "purchase",
    category: null,
    suggestedCategoryId: 4,
    finalCategoryId: null,
    transactionId: null,
    isDuplicate: false,
    duplicateReason: null,
    rawData: null,
    createdAt: "2024-01-20T11:30:00Z",
    suggestedCategory: {
      id: 4,
      name: "Alimentação",
      type: "expense",
    },
    finalCategory: null,
    duplicateOf: null,
  },
  {
    id: 12,
    statementId: 2,
    date: "2024-01-16",
    description: "MAGAZIN LUIZA",
    amount: "299.90",
    type: "purchase",
    category: null,
    suggestedCategoryId: null,
    finalCategoryId: null,
    transactionId: null,
    isDuplicate: true,
    duplicateReason: "Transação similar encontrada: mesma data, valor e descrição",
    rawData: null,
    createdAt: "2024-01-20T11:30:00Z",
    suggestedCategory: null,
    finalCategory: null,
    duplicateOf: {
      id: 3,
      date: new Date("2024-01-16"),
      amount: "299.90",
      description: "Magazine Luiza",
    },
  },
  {
    id: 13,
    statementId: 2,
    date: "2024-01-17",
    description: "MERCADO LIVRE",
    amount: "89.00",
    type: "purchase",
    category: null,
    suggestedCategoryId: null,
    finalCategoryId: null,
    transactionId: null,
    isDuplicate: false,
    duplicateReason: null,
    rawData: null,
    createdAt: "2024-01-20T11:30:00Z",
    suggestedCategory: null,
    finalCategory: null,
    duplicateOf: null,
  },
  {
    id: 14,
    statementId: 2,
    date: "2024-01-18",
    description: "DROGARIA SAO PAULO",
    amount: "54.80",
    type: "purchase",
    category: null,
    suggestedCategoryId: 7,
    finalCategoryId: null,
    transactionId: null,
    isDuplicate: false,
    duplicateReason: null,
    rawData: null,
    createdAt: "2024-01-20T11:30:00Z",
    suggestedCategory: {
      id: 7,
      name: "Saúde",
      type: "expense",
    },
    finalCategory: null,
    duplicateOf: null,
  },
  {
    id: 15,
    statementId: 2,
    date: "2024-01-19",
    description: "TAXI SAO PAULO",
    amount: "45.00",
    type: "purchase",
    category: null,
    suggestedCategoryId: 5,
    finalCategoryId: null,
    transactionId: null,
    isDuplicate: false,
    duplicateReason: null,
    rawData: null,
    createdAt: "2024-01-20T11:30:00Z",
    suggestedCategory: {
      id: 5,
      name: "Transporte",
      type: "expense",
    },
    finalCategory: null,
    duplicateOf: null,
  },
  // Non-purchase items
  {
    id: 16,
    statementId: 2,
    date: "2024-01-20",
    description: "PAGAMENTO RECEBIDO",
    amount: "-200.00",
    type: "payment",
    category: null,
    suggestedCategoryId: null,
    finalCategoryId: null,
    transactionId: null,
    isDuplicate: false,
    duplicateReason: null,
    rawData: null,
    createdAt: "2024-01-20T11:30:00Z",
    suggestedCategory: null,
    finalCategory: null,
    duplicateOf: null,
  },
  {
    id: 17,
    statementId: 2,
    date: "2024-01-21",
    description: "TARIFA MANUTENCAO CONTA",
    amount: "15.00",
    type: "fee",
    category: null,
    suggestedCategoryId: null,
    finalCategoryId: null,
    transactionId: null,
    isDuplicate: false,
    duplicateReason: null,
    rawData: null,
    createdAt: "2024-01-20T11:30:00Z",
    suggestedCategory: null,
    finalCategory: null,
    duplicateOf: null,
  },
  {
    id: 18,
    statementId: 2,
    date: "2024-01-22",
    description: "AJUSTE DE CREDITO",
    amount: "-10.00",
    type: "reversal",
    category: null,
    suggestedCategoryId: null,
    finalCategoryId: null,
    transactionId: null,
    isDuplicate: false,
    duplicateReason: null,
    rawData: null,
    createdAt: "2024-01-20T11:30:00Z",
    suggestedCategory: null,
    finalCategory: null,
    duplicateOf: null,
  },
];

/**
 * Sequential ID counters for dynamic mock creation
 */
let mockStatementIdCounter = 100;
let mockLineItemIdCounter = 1000;

/**
 * Create a mock statement with custom overrides
 */
export const createMockStatement = (
  overrides: Partial<CreditCardStatementWithCard> = {}
): CreditCardStatementWithCard => ({
  id: ++mockStatementIdCounter,
  creditCardId: 1,
  ownerId: 1,
  bankCode: "itau",
  statementDate: "2024-02-01",
  dueDate: "2024-02-15",
  previousBalance: "0.00",
  paymentsReceived: "0.00",
  purchases: "0.00",
  fees: "0.00",
  interest: "0.00",
  totalAmount: "0.00",
  fileName: "test-statement.pdf",
  fileHash: "test" + "0".repeat(60),
  status: "pending",
  importedAt: null,
  createdAt: "2024-02-01T10:00:00Z",
  updatedAt: "2024-02-01T10:00:00Z",
  creditCard: {
    id: 1,
    name: "Cartão Platinum",
    limit: "10000.00",
    currentBill: "0.00",
  },
  ...overrides,
});

/**
 * Create a mock line item with custom overrides
 */
export const createMockLineItem = (
  overrides: Partial<LineItemWithRelations> = {}
): LineItemWithRelations => ({
  id: ++mockLineItemIdCounter,
  statementId: 2,
  date: "2024-01-10",
  description: "COMPRA TESTE",
  amount: "100.00",
  type: "purchase",
  category: null,
  suggestedCategoryId: null,
  finalCategoryId: null,
  transactionId: null,
  isDuplicate: false,
  duplicateReason: null,
  rawData: null,
  createdAt: "2024-01-20T11:30:00Z",
  ...overrides,
});

/**
 * Detect category from description using keyword matching
 * Simulates AI categorization with deterministic rules
 */
export const detectCategoryFromDescription = (
  description: string
): { id: number; name: string; type: string } | null => {
  const desc = description.toUpperCase();

  // Alimentação (Category 4)
  if (
    desc.includes("SUPERMERCADO") ||
    desc.includes("IFOOD") ||
    desc.includes("RESTAURANTE") ||
    desc.includes("PADARIA")
  ) {
    return { id: 4, name: "Alimentação", type: "expense" };
  }

  // Transporte (Category 5)
  if (
    desc.includes("UBER") ||
    desc.includes("99") ||
    desc.includes("TAXI") ||
    desc.includes("POSTO")
  ) {
    return { id: 5, name: "Transporte", type: "expense" };
  }

  // Lazer (Category 6)
  if (
    desc.includes("NETFLIX") ||
    desc.includes("SPOTIFY") ||
    desc.includes("CINEMA")
  ) {
    return { id: 6, name: "Lazer", type: "expense" };
  }

  // Saúde (Category 7)
  if (desc.includes("FARMACIA") || desc.includes("DROGARIA")) {
    return { id: 7, name: "Saúde", type: "expense" };
  }

  return null;
};

/**
 * Create fake PDF data for testing
 * Returns a base64 string that starts with PDF magic bytes
 */
export const createFakePDFData = (): string => {
  // "JVBERi0" is base64 for "%PDF-" (PDF magic bytes)
  return "JVBERi0xLjQKJeLjz9MKM" + "A".repeat(500);
};
