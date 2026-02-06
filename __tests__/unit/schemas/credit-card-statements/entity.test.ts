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

    it("should accept statement with optional importedAt", () => {
      const withImportedAt = { ...validStatement, importedAt: "2024-01-16T10:00:00Z" };
      expect(() => CreditCardStatementSchema.parse(withImportedAt)).not.toThrow();
    });

    it.each(["pending", "reviewed", "imported", "cancelled"] as const)(
      "should accept status '%s'",
      (status) => {
        const statement = { ...validStatement, status };
        expect(() => CreditCardStatementSchema.parse(statement)).not.toThrow();
      }
    );

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
    it.each([
      ["previousBalance", "-10.00"],
      ["paymentsReceived", "-50.00"],
      ["purchases", "-100.00"],
      ["fees", "-10.00"],
      ["interest", "-5.00"],
      ["totalAmount", "-100.00"],
    ])("should reject negative %s", (field, value) => {
      const invalid = { ...validStatement, [field]: value };
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

    it.each([
      ["without decimal places", "100"],
      ["with wrong decimal places", "100.1"],
    ])("should reject amounts %s", (_, value) => {
      const invalid = { ...validStatement, totalAmount: value };
      expect(() => CreditCardStatementSchema.parse(invalid)).toThrow();
    });

    it.each([
      ["negative", -1],
      ["zero", 0],
    ])("should reject %s ID", (_, value) => {
      const invalid = { ...validStatement, id: value };
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

    it.each(["purchase", "payment", "fee", "interest", "reversal"] as const)(
      "should accept type '%s'",
      (type) => {
        const item = { ...validLineItem, type };
        expect(() => StatementLineItemSchema.parse(item)).not.toThrow();
      }
    );

    it.each([
      ["category", "Alimentação"],
      ["suggestedCategoryId", 5],
      ["finalCategoryId", 5],
      ["transactionId", 10],
    ])("should accept optional %s", (field, value) => {
      const withField = { ...validLineItem, [field]: value };
      expect(() => StatementLineItemSchema.parse(withField)).not.toThrow();
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

    it.each([
      ["without decimal places", "100"],
      ["with wrong decimal places", "100.1"],
    ])("should reject amount %s", (_, value) => {
      const invalid = { ...validLineItem, amount: value };
      expect(() => StatementLineItemSchema.parse(invalid)).toThrow();
    });

    it("should reject invalid type", () => {
      const invalid = { ...validLineItem, type: "invalid_type" };
      expect(() => StatementLineItemSchema.parse(invalid)).toThrow();
    });

    it.each([
      ["longer than 500 chars", "a".repeat(501)],
      ["empty", ""],
    ])("should reject description %s", (_, value) => {
      const invalid = { ...validLineItem, description: value };
      expect(() => StatementLineItemSchema.parse(invalid)).toThrow();
    });

    it.each([
      ["negative", -1],
      ["zero", 0],
    ])("should reject %s statementId", (_, value) => {
      const invalid = { ...validLineItem, statementId: value };
      expect(() => StatementLineItemSchema.parse(invalid)).toThrow();
    });
  });
});

describe("Enum schemas", () => {
  describe("StatementStatusEnum", () => {
    it.each(["pending", "reviewed", "imported", "cancelled"])(
      "should accept status '%s'",
      (status) => {
        expect(() => StatementStatusEnum.parse(status)).not.toThrow();
      }
    );

    it.each(["invalid", "", null])("should reject invalid value %p", (value) => {
      expect(() => StatementStatusEnum.parse(value)).toThrow();
    });
  });

  describe("LineItemTypeEnum", () => {
    it.each(["purchase", "payment", "fee", "interest", "reversal"])(
      "should accept type '%s'",
      (type) => {
        expect(() => LineItemTypeEnum.parse(type)).not.toThrow();
      }
    );

    it.each(["invalid", "", null])("should reject invalid value %p", (value) => {
      expect(() => LineItemTypeEnum.parse(value)).toThrow();
    });
  });
});
