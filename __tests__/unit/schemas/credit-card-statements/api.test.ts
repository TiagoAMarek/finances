import { describe, it, expect } from "vitest";

import {
  StatementUploadSchema,
  StatementUpdateSchema,
  LineItemUpdateSchema,
  LineItemsBulkUpdateSchema,
  StatementImportSchema,
  StatementListQuerySchema,
  ParsedLineItemSchema,
  ParsedStatementSchema,
} from "@/lib/schemas/credit-card-statements/api";

describe("StatementUploadSchema", () => {
  // Valid SHA-256 hash (64 hex characters)
  const validFileHash = "a".repeat(64);

  const validUpload = {
    creditCardId: 1,
    bankCode: "itau",
    fileName: "statement.pdf",
    fileHash: validFileHash,
  };

  describe("valid data", () => {
    it.each([
      { name: "valid upload data", data: validUpload },
      { name: "long bank codes up to 50 chars", data: { ...validUpload, bankCode: "a".repeat(50) } },
      { name: "long file names up to 255 chars", data: { ...validUpload, fileName: "a".repeat(251) + ".pdf" } },
      { name: "valid SHA-256 hash", data: { ...validUpload, fileHash: "b".repeat(64) } },
    ])("should accept $name", ({ data }) => {
      expect(() => StatementUploadSchema.parse(data)).not.toThrow();
    });
  });

  describe("invalid data", () => {
    it.each([
      { name: "missing creditCardId", data: (() => { const { creditCardId, ...rest } = validUpload; return rest; })() },
      { name: "negative creditCardId", data: { ...validUpload, creditCardId: -1 } },
      { name: "zero creditCardId", data: { ...validUpload, creditCardId: 0 } },
      { name: "empty bankCode", data: { ...validUpload, bankCode: "" } },
      { name: "bankCode longer than 50 chars", data: { ...validUpload, bankCode: "a".repeat(51) } },
      { name: "empty fileName", data: { ...validUpload, fileName: "" } },
      { name: "fileName longer than 255 chars", data: { ...validUpload, fileName: "a".repeat(256) } },
      { name: "empty fileHash", data: { ...validUpload, fileHash: "" } },
      { name: "fileHash shorter than 64 chars", data: { ...validUpload, fileHash: "a".repeat(63) } },
      { name: "fileHash longer than 64 chars", data: { ...validUpload, fileHash: "a".repeat(65) } },
    ])("should reject $name", ({ data }) => {
      expect(() => StatementUploadSchema.parse(data)).toThrow();
    });
  });

  describe("security - path traversal", () => {
    it.each([
      { name: "double dots (..)", fileName: "../../../etc/passwd" },
      { name: "forward slashes", fileName: "path/to/file.pdf" },
      { name: "backslashes", fileName: "path\\to\\file.pdf" },
      { name: "mixed path separators", fileName: "..\\secret/file.pdf" },
    ])("should reject fileName with $name", ({ fileName }) => {
      const invalid = { ...validUpload, fileName };
      expect(() => StatementUploadSchema.parse(invalid)).toThrow();
    });
  });
});

describe("StatementUpdateSchema", () => {
  describe("valid data", () => {
    it.each([
      {
        name: "all optional fields",
        data: {
          statementDate: "2024-01-15",
          dueDate: "2024-02-05",
          previousBalance: "100.50",
          paymentsReceived: "50.00",
          purchases: "200.00",
          fees: "10.00",
          interest: "5.00",
          totalAmount: "265.50",
          status: "reviewed" as const,
        },
      },
      { name: "partial updates", data: { status: "reviewed" as const } },
      { name: "empty object", data: {} },
    ])("should accept $name", ({ data }) => {
      expect(() => StatementUpdateSchema.parse(data)).not.toThrow();
    });
  });

  describe("invalid data", () => {
    it.each([
      { name: "invalid date format", data: { statementDate: "15/01/2024" } },
      { name: "invalid status", data: { status: "invalid_status" } },
      { name: "negative amounts", data: { totalAmount: "-100" } },
    ])("should reject $name", ({ data }) => {
      expect(() => StatementUpdateSchema.parse(data)).toThrow();
    });

    it("should accept amounts without decimal places (validAmount allows it)", () => {
      // validAmount() helper accepts "100" and treats it as valid
      const valid = { totalAmount: "100" };
      expect(() => StatementUpdateSchema.parse(valid)).not.toThrow();
    });
  });
});

describe("LineItemUpdateSchema", () => {
  const validUpdate = {
    id: 1,
    finalCategoryId: 5,
    isDuplicate: false,
  };

  describe("valid data", () => {
    it.each([
      { name: "valid update data", data: validUpdate },
      { name: "null finalCategoryId", data: { ...validUpdate, finalCategoryId: null } },
      { name: "only id", data: { id: 1 } },
    ])("should accept $name", ({ data }) => {
      expect(() => LineItemUpdateSchema.parse(data)).not.toThrow();
    });
  });

  describe("invalid data", () => {
    it.each([
      { name: "missing id", data: (() => { const { id, ...rest } = validUpdate; return rest; })() },
      { name: "negative id", data: { ...validUpdate, id: -1 } },
      { name: "negative finalCategoryId", data: { ...validUpdate, finalCategoryId: -1 } },
    ])("should reject $name", ({ data }) => {
      expect(() => LineItemUpdateSchema.parse(data)).toThrow();
    });
  });
});

describe("LineItemsBulkUpdateSchema", () => {
  describe("valid data", () => {
    it("should accept array of line item updates", () => {
      const valid = {
        lineItems: [
          { id: 1, finalCategoryId: 5 },
          { id: 2, isDuplicate: true },
        ],
      };
      expect(() => LineItemsBulkUpdateSchema.parse(valid)).not.toThrow();
    });
  });

  describe("invalid data", () => {
    it("should reject empty array", () => {
      const invalid = { lineItems: [] };
      expect(() => LineItemsBulkUpdateSchema.parse(invalid)).toThrow();
    });

    it("should reject missing lineItems", () => {
      expect(() => LineItemsBulkUpdateSchema.parse({})).toThrow();
    });
  });
});

describe("StatementImportSchema", () => {
  describe("valid data", () => {
    it("should accept all fields", () => {
      const valid = {
        updateCurrentBill: true,
        excludeLineItemIds: [1, 2, 3],
        lineItemUpdates: [{ id: 1, finalCategoryId: 5 }],
      };
      expect(() => StatementImportSchema.parse(valid)).not.toThrow();
    });

    it("should use default values", () => {
      const result = StatementImportSchema.parse({});
      expect(result).toEqual({
        updateCurrentBill: false,
        excludeLineItemIds: [],
        lineItemUpdates: [],
      });
    });

    it("should accept empty arrays", () => {
      const valid = {
        updateCurrentBill: true,
        excludeLineItemIds: [],
        lineItemUpdates: [],
      };
      expect(() => StatementImportSchema.parse(valid)).not.toThrow();
    });
  });

  describe("invalid data", () => {
    it("should reject invalid line item updates", () => {
      const invalid = {
        lineItemUpdates: [{ id: -1 }],
      };
      expect(() => StatementImportSchema.parse(invalid)).toThrow();
    });

    it("should reject negative excludeLineItemIds", () => {
      const invalid = {
        excludeLineItemIds: [1, -1, 3],
      };
      expect(() => StatementImportSchema.parse(invalid)).toThrow();
    });
  });
});

describe("StatementListQuerySchema", () => {
  describe("valid data", () => {
    it.each([
      {
        name: "all query params",
        data: {
          creditCardId: 1,
          status: "pending",
          startDate: "2024-01-01",
          endDate: "2024-12-31",
          page: 2,
          limit: 50,
        },
        checks: (result: any) => {
          expect(result.creditCardId).toBe(1);
          expect(result.page).toBe(2);
          expect(result.limit).toBe(50);
        },
      },
      {
        name: "default values",
        data: {},
        checks: (result: any) => {
          expect(result.page).toBe(1);
          expect(result.limit).toBe(20);
        },
      },
      {
        name: "string numbers coerced to numbers",
        data: {
          creditCardId: "1",
          page: "2",
          limit: "30",
        },
        checks: (result: any) => {
          expect(result.creditCardId).toBe(1);
          expect(result.page).toBe(2);
          expect(result.limit).toBe(30);
        },
      },
    ])("should accept $name", ({ data, checks }) => {
      const result = StatementListQuerySchema.parse(data);
      checks(result);
    });
  });

  describe("invalid data", () => {
    it.each([
      { name: "limit over 100", data: { limit: 101 } },
      { name: "negative page", data: { page: -1 } },
      { name: "zero page", data: { page: 0 } },
      { name: "invalid date format", data: { startDate: "01/01/2024" } },
      { name: "invalid status", data: { status: "invalid" } },
    ])("should reject $name", ({ data }) => {
      expect(() => StatementListQuerySchema.parse(data)).toThrow();
    });
  });
});

describe("ParsedLineItemSchema", () => {
  const validItem = {
    date: "2024-01-10",
    description: "Purchase",
    amount: "100.00",
    type: "purchase" as const,
  };

  describe("valid data", () => {
    it.each([
      { name: "valid parsed line item", data: validItem },
      { name: "negative amounts", data: { ...validItem, amount: "-50.00" } },
      { name: "optional category", data: { ...validItem, category: "Alimentação" } },
    ])("should accept $name", ({ data }) => {
      expect(() => ParsedLineItemSchema.parse(data)).not.toThrow();
    });
  });

  describe("invalid data", () => {
    it.each([
      { name: "amount without decimal places", data: { ...validItem, amount: "100" } },
      { name: "invalid date format", data: { ...validItem, date: "10/01/2024" } },
      { name: "empty description", data: { ...validItem, description: "" } },
    ])("should reject $name", ({ data }) => {
      expect(() => ParsedLineItemSchema.parse(data)).toThrow();
    });
  });
});

describe("ParsedStatementSchema", () => {
  const validStatement = {
    bankCode: "itau",
    statementDate: "2024-01-15",
    dueDate: "2024-02-05",
    previousBalance: "100.00",
    paymentsReceived: "50.00",
    purchases: "200.00",
    fees: "10.00",
    interest: "5.00",
    totalAmount: "265.00",
    lineItems: [
      {
        date: "2024-01-10",
        description: "Purchase",
        amount: "100.00",
        type: "purchase" as const,
      },
    ],
  };

  describe("valid data", () => {
    it.each([
      { name: "valid parsed statement", data: validStatement },
      { name: "empty line items", data: { ...validStatement, lineItems: [] } },
      {
        name: "zero amounts",
        data: {
          ...validStatement,
          previousBalance: "0.00",
          paymentsReceived: "0.00",
          purchases: "0.00",
          fees: "0.00",
          interest: "0.00",
          totalAmount: "0.00",
        },
      },
    ])("should accept $name", ({ data }) => {
      expect(() => ParsedStatementSchema.parse(data)).not.toThrow();
    });
  });

  describe("invalid data", () => {
    it.each([
      { name: "negative previousBalance", data: { ...validStatement, previousBalance: "-100.00" } },
      { name: "negative paymentsReceived", data: { ...validStatement, paymentsReceived: "-50.00" } },
      { name: "negative purchases", data: { ...validStatement, purchases: "-200.00" } },
      { name: "negative fees", data: { ...validStatement, fees: "-10.00" } },
      { name: "negative interest", data: { ...validStatement, interest: "-5.00" } },
      { name: "negative totalAmount", data: { ...validStatement, totalAmount: "-265.00" } },
      { name: "invalid date format", data: { ...validStatement, statementDate: "15/01/2024" } },
      { name: "amounts without decimal places", data: { ...validStatement, totalAmount: "100" } },
    ])("should reject $name", ({ data }) => {
      expect(() => ParsedStatementSchema.parse(data)).toThrow();
    });
  });
});
