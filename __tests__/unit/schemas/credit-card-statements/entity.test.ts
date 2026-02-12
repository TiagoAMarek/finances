import { describe, it, expect } from "vitest";

import {
  CreditCardStatementSchema,
  StatementLineItemSchema,
  StatementStatusEnum,
  LineItemTypeEnum,
} from "@/lib/schemas/credit-card-statements/entity";

/**
 * Entity schema tests for credit card statements.
 * 
 * Note: Entity schemas are generated from drizzle-zod and provide type-based
 * validation matching the database structure. Business logic validation
 * (e.g., positive amounts, format regex) is handled by API schemas in api.ts.
 */
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
    status: "pending" as const,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  };

  describe("valid data", () => {
    it.each([
      { name: "valid statement data", data: validStatement },
      { name: "with optional importedAt", data: { ...validStatement, importedAt: "2024-01-16T10:00:00Z" } },
      { name: "with null importedAt", data: { ...validStatement, importedAt: null } },
      { name: "pending status", data: { ...validStatement, status: "pending" as const } },
      { name: "reviewed status", data: { ...validStatement, status: "reviewed" as const } },
      { name: "imported status", data: { ...validStatement, status: "imported" as const } },
      { name: "cancelled status", data: { ...validStatement, status: "cancelled" as const } },
    ])("should accept $name", ({ data }) => {
      expect(() => CreditCardStatementSchema.parse(data)).not.toThrow();
    });
  });

  describe("invalid data", () => {
    it.each([
      { name: "invalid status", data: { ...validStatement, status: "invalid_status" } },
      { name: "missing id", data: (() => { const { id, ...rest } = validStatement; return rest; })() },
      { name: "missing creditCardId", data: (() => { const { creditCardId, ...rest } = validStatement; return rest; })() },
      { name: "missing ownerId", data: (() => { const { ownerId, ...rest } = validStatement; return rest; })() },
      { name: "missing bankCode", data: (() => { const { bankCode, ...rest } = validStatement; return rest; })() },
      { name: "missing status", data: (() => { const { status, ...rest } = validStatement; return rest; })() },
    ])("should reject $name", ({ data }) => {
      expect(() => CreditCardStatementSchema.parse(data)).toThrow();
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
    it.each([
      { name: "valid line item data", data: validLineItem },
      { name: "negative amounts for reversals", data: { ...validLineItem, amount: "-50.00", type: "reversal" as const } },
      { name: "purchase type", data: { ...validLineItem, type: "purchase" as const } },
      { name: "payment type", data: { ...validLineItem, type: "payment" as const } },
      { name: "fee type", data: { ...validLineItem, type: "fee" as const } },
      { name: "interest type", data: { ...validLineItem, type: "interest" as const } },
      { name: "reversal type", data: { ...validLineItem, type: "reversal" as const } },
      { name: "optional category", data: { ...validLineItem, category: "Alimentação" } },
      { name: "null category", data: { ...validLineItem, category: null } },
      { name: "optional suggestedCategoryId", data: { ...validLineItem, suggestedCategoryId: 5 } },
      { name: "null suggestedCategoryId", data: { ...validLineItem, suggestedCategoryId: null } },
      { name: "optional finalCategoryId", data: { ...validLineItem, finalCategoryId: 5 } },
      { name: "null finalCategoryId", data: { ...validLineItem, finalCategoryId: null } },
      { name: "optional transactionId", data: { ...validLineItem, transactionId: 10 } },
      { name: "null transactionId", data: { ...validLineItem, transactionId: null } },
      { name: "duplicate with reason", data: { ...validLineItem, isDuplicate: true, duplicateReason: "Same amount and date found" } },
      { name: "optional rawData", data: { ...validLineItem, rawData: { originalText: "some data", confidence: 0.95 } } },
      { name: "null rawData", data: { ...validLineItem, rawData: null } },
    ])("should accept $name", ({ data }) => {
      expect(() => StatementLineItemSchema.parse(data)).not.toThrow();
    });
  });

  describe("invalid data", () => {
    it.each([
      { name: "invalid type", data: { ...validLineItem, type: "invalid_type" } },
      { name: "missing id", data: (() => { const { id, ...rest } = validLineItem; return rest; })() },
      { name: "missing statementId", data: (() => { const { statementId, ...rest } = validLineItem; return rest; })() },
      { name: "missing description", data: (() => { const { description, ...rest } = validLineItem; return rest; })() },
      { name: "missing amount", data: (() => { const { amount, ...rest } = validLineItem; return rest; })() },
      { name: "missing type", data: (() => { const { type, ...rest } = validLineItem; return rest; })() },
      { name: "missing isDuplicate", data: (() => { const { isDuplicate, ...rest } = validLineItem; return rest; })() },
    ])("should reject $name", ({ data }) => {
      expect(() => StatementLineItemSchema.parse(data)).toThrow();
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
