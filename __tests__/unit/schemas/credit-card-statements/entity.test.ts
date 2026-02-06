import { describe, it, expect } from "vitest";

import {
  CreditCardStatementSchema,
  StatementLineItemSchema,
  StatementStatusEnum,
  LineItemTypeEnum,
} from "@/lib/schemas/credit-card-statements/entity";

describe("CreditCardStatementSchema", () => {
  const validStatement = {
    id: 1,
    creditCardId: 1,
    ownerId: 1,
    bankCode: "itau",
    statementDate: "2024-01-15",
    dueDate: "2024-02-05",
    previousBalance: "100.00",
    paymentsReceived: "50.00",
    purchases: "200.00",
    fees: "10.00",
    interest: "5.00",
    totalAmount: "265.00",
    fileName: "statement.pdf",
    fileHash: "a".repeat(64), // SHA-256 hash
    status: "pending" as const,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  };

  describe("valid data", () => {
    it("should accept valid statement data", () => {
      expect(() => CreditCardStatementSchema.parse(validStatement)).not.toThrow();
    });

    it("should accept statement with optional fileData", () => {
      const withFileData = { ...validStatement, fileData: "base64data" };
      expect(() => CreditCardStatementSchema.parse(withFileData)).not.toThrow();
    });

    it("should accept statement with optional importedAt", () => {
      const withImportedAt = { ...validStatement, importedAt: "2024-01-16T10:00:00Z" };
      expect(() => CreditCardStatementSchema.parse(withImportedAt)).not.toThrow();
    });

    it("should accept all valid status values", () => {
      const statuses: Array<"pending" | "reviewed" | "imported" | "cancelled"> = [
        "pending",
        "reviewed",
        "imported",
        "cancelled",
      ];

      statuses.forEach((status) => {
        const statement = { ...validStatement, status };
        expect(() => CreditCardStatementSchema.parse(statement)).not.toThrow();
      });
    });

    it("should accept zero amounts", () => {
      const zeroAmounts = {
        ...validStatement,
        previousBalance: "0.00",
        paymentsReceived: "0.00",
        purchases: "0.00",
        fees: "0.00",
        interest: "0.00",
        totalAmount: "0.00",
      };
      expect(() => CreditCardStatementSchema.parse(zeroAmounts)).not.toThrow();
    });
  });

  describe("invalid data", () => {
    it("should reject negative previousBalance", () => {
      const invalid = { ...validStatement, previousBalance: "-10.00" };
      expect(() => CreditCardStatementSchema.parse(invalid)).toThrow();
    });

    it("should reject negative paymentsReceived", () => {
      const invalid = { ...validStatement, paymentsReceived: "-50.00" };
      expect(() => CreditCardStatementSchema.parse(invalid)).toThrow();
    });

    it("should reject negative purchases", () => {
      const invalid = { ...validStatement, purchases: "-100.00" };
      expect(() => CreditCardStatementSchema.parse(invalid)).toThrow();
    });

    it("should reject negative fees", () => {
      const invalid = { ...validStatement, fees: "-10.00" };
      expect(() => CreditCardStatementSchema.parse(invalid)).toThrow();
    });

    it("should reject negative interest", () => {
      const invalid = { ...validStatement, interest: "-5.00" };
      expect(() => CreditCardStatementSchema.parse(invalid)).toThrow();
    });

    it("should reject negative totalAmount", () => {
      const invalid = { ...validStatement, totalAmount: "-100.00" };
      expect(() => CreditCardStatementSchema.parse(invalid)).toThrow();
    });

    it("should reject invalid date format", () => {
      const invalid = { ...validStatement, statementDate: "15/01/2024" };
      expect(() => CreditCardStatementSchema.parse(invalid)).toThrow();
    });

    it("should reject invalid status", () => {
      const invalid = { ...validStatement, status: "invalid_status" };
      expect(() => CreditCardStatementSchema.parse(invalid)).toThrow();
    });

    it("should reject invalid fileHash length", () => {
      const invalid = { ...validStatement, fileHash: "short" };
      expect(() => CreditCardStatementSchema.parse(invalid)).toThrow();
    });

    it("should reject amounts without decimal places", () => {
      const invalid = { ...validStatement, totalAmount: "100" };
      expect(() => CreditCardStatementSchema.parse(invalid)).toThrow();
    });

    it("should reject amounts with wrong decimal places", () => {
      const invalid = { ...validStatement, totalAmount: "100.1" };
      expect(() => CreditCardStatementSchema.parse(invalid)).toThrow();
    });

    it("should reject negative ID", () => {
      const invalid = { ...validStatement, id: -1 };
      expect(() => CreditCardStatementSchema.parse(invalid)).toThrow();
    });

    it("should reject zero ID", () => {
      const invalid = { ...validStatement, id: 0 };
      expect(() => CreditCardStatementSchema.parse(invalid)).toThrow();
    });
  });
});

describe("StatementLineItemSchema", () => {
  const validLineItem = {
    id: 1,
    statementId: 1,
    date: "2024-01-10",
    description: "Purchase at Store",
    amount: "100.00",
    type: "purchase" as const,
    isDuplicate: false,
    createdAt: "2024-01-15T10:00:00Z",
  };

  describe("valid data", () => {
    it("should accept valid line item data", () => {
      expect(() => StatementLineItemSchema.parse(validLineItem)).not.toThrow();
    });

    it("should accept negative amounts for reversals", () => {
      const reversal = { ...validLineItem, amount: "-50.00", type: "reversal" as const };
      expect(() => StatementLineItemSchema.parse(reversal)).not.toThrow();
    });

    it("should accept all valid type values", () => {
      const types: Array<"purchase" | "payment" | "fee" | "interest" | "reversal"> = [
        "purchase",
        "payment",
        "fee",
        "interest",
        "reversal",
      ];

      types.forEach((type) => {
        const item = { ...validLineItem, type };
        expect(() => StatementLineItemSchema.parse(item)).not.toThrow();
      });
    });

    it("should accept optional category", () => {
      const withCategory = { ...validLineItem, category: "Alimentação" };
      expect(() => StatementLineItemSchema.parse(withCategory)).not.toThrow();
    });

    it("should accept optional suggestedCategoryId", () => {
      const withSuggestedCategory = { ...validLineItem, suggestedCategoryId: 5 };
      expect(() => StatementLineItemSchema.parse(withSuggestedCategory)).not.toThrow();
    });

    it("should accept optional finalCategoryId", () => {
      const withFinalCategory = { ...validLineItem, finalCategoryId: 5 };
      expect(() => StatementLineItemSchema.parse(withFinalCategory)).not.toThrow();
    });

    it("should accept optional transactionId", () => {
      const withTransaction = { ...validLineItem, transactionId: 10 };
      expect(() => StatementLineItemSchema.parse(withTransaction)).not.toThrow();
    });

    it("should accept duplicate with reason", () => {
      const duplicate = {
        ...validLineItem,
        isDuplicate: true,
        duplicateReason: "Same amount and date found",
      };
      expect(() => StatementLineItemSchema.parse(duplicate)).not.toThrow();
    });

    it("should accept optional rawData", () => {
      const withRawData = {
        ...validLineItem,
        rawData: { originalText: "some data", confidence: 0.95 },
      };
      expect(() => StatementLineItemSchema.parse(withRawData)).not.toThrow();
    });
  });

  describe("invalid data", () => {
    it("should reject invalid date format", () => {
      const invalid = { ...validLineItem, date: "10/01/2024" };
      expect(() => StatementLineItemSchema.parse(invalid)).toThrow();
    });

    it("should reject amount without decimal places", () => {
      const invalid = { ...validLineItem, amount: "100" };
      expect(() => StatementLineItemSchema.parse(invalid)).toThrow();
    });

    it("should reject amount with wrong decimal places", () => {
      const invalid = { ...validLineItem, amount: "100.1" };
      expect(() => StatementLineItemSchema.parse(invalid)).toThrow();
    });

    it("should reject invalid type", () => {
      const invalid = { ...validLineItem, type: "invalid_type" };
      expect(() => StatementLineItemSchema.parse(invalid)).toThrow();
    });

    it("should reject description longer than 500 chars", () => {
      const invalid = { ...validLineItem, description: "a".repeat(501) };
      expect(() => StatementLineItemSchema.parse(invalid)).toThrow();
    });

    it("should reject empty description", () => {
      const invalid = { ...validLineItem, description: "" };
      expect(() => StatementLineItemSchema.parse(invalid)).toThrow();
    });

    it("should reject negative statementId", () => {
      const invalid = { ...validLineItem, statementId: -1 };
      expect(() => StatementLineItemSchema.parse(invalid)).toThrow();
    });

    it("should reject zero statementId", () => {
      const invalid = { ...validLineItem, statementId: 0 };
      expect(() => StatementLineItemSchema.parse(invalid)).toThrow();
    });
  });
});

describe("Enum schemas", () => {
  describe("StatementStatusEnum", () => {
    it("should accept all valid status values", () => {
      expect(() => StatementStatusEnum.parse("pending")).not.toThrow();
      expect(() => StatementStatusEnum.parse("reviewed")).not.toThrow();
      expect(() => StatementStatusEnum.parse("imported")).not.toThrow();
      expect(() => StatementStatusEnum.parse("cancelled")).not.toThrow();
    });

    it("should reject invalid status values", () => {
      expect(() => StatementStatusEnum.parse("invalid")).toThrow();
      expect(() => StatementStatusEnum.parse("")).toThrow();
      expect(() => StatementStatusEnum.parse(null)).toThrow();
    });
  });

  describe("LineItemTypeEnum", () => {
    it("should accept all valid type values", () => {
      expect(() => LineItemTypeEnum.parse("purchase")).not.toThrow();
      expect(() => LineItemTypeEnum.parse("payment")).not.toThrow();
      expect(() => LineItemTypeEnum.parse("fee")).not.toThrow();
      expect(() => LineItemTypeEnum.parse("interest")).not.toThrow();
      expect(() => LineItemTypeEnum.parse("reversal")).not.toThrow();
    });

    it("should reject invalid type values", () => {
      expect(() => LineItemTypeEnum.parse("invalid")).toThrow();
      expect(() => LineItemTypeEnum.parse("")).toThrow();
      expect(() => LineItemTypeEnum.parse(null)).toThrow();
    });
  });
});
