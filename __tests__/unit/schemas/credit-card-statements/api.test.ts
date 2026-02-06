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
  // Valid base64 encoded content
  const validBase64 = "SGVsbG8gV29ybGQh"; // "Hello World!" in base64

  const validUpload = {
    creditCardId: 1,
    bankCode: "itau",
    fileName: "statement.pdf",
    fileData: validBase64,
  };

  describe("valid data", () => {
    it("should accept valid upload data", () => {
      expect(() => StatementUploadSchema.parse(validUpload)).not.toThrow();
    });

    it("should accept long bank codes up to 50 chars", () => {
      const longBankCode = { ...validUpload, bankCode: "a".repeat(50) };
      expect(() => StatementUploadSchema.parse(longBankCode)).not.toThrow();
    });

    it("should accept long file names up to 255 chars", () => {
      const longFileName = { ...validUpload, fileName: "a".repeat(251) + ".pdf" };
      expect(() => StatementUploadSchema.parse(longFileName)).not.toThrow();
    });

    it("should accept valid base64 with padding", () => {
      const withPadding = { ...validUpload, fileData: "SGVsbG8=" };
      expect(() => StatementUploadSchema.parse(withPadding)).not.toThrow();
    });

    it("should accept valid base64 with double padding", () => {
      const withDoublePadding = { ...validUpload, fileData: "SGVs==" };
      expect(() => StatementUploadSchema.parse(withDoublePadding)).not.toThrow();
    });
  });

  describe("invalid data", () => {
    it("should reject missing creditCardId", () => {
      const { creditCardId, ...invalid } = validUpload;
      expect(() => StatementUploadSchema.parse(invalid)).toThrow();
    });

    it("should reject negative creditCardId", () => {
      const invalid = { ...validUpload, creditCardId: -1 };
      expect(() => StatementUploadSchema.parse(invalid)).toThrow();
    });

    it("should reject zero creditCardId", () => {
      const invalid = { ...validUpload, creditCardId: 0 };
      expect(() => StatementUploadSchema.parse(invalid)).toThrow();
    });

    it("should reject empty bankCode", () => {
      const invalid = { ...validUpload, bankCode: "" };
      expect(() => StatementUploadSchema.parse(invalid)).toThrow();
    });

    it("should reject bankCode longer than 50 chars", () => {
      const invalid = { ...validUpload, bankCode: "a".repeat(51) };
      expect(() => StatementUploadSchema.parse(invalid)).toThrow();
    });

    it("should reject empty fileName", () => {
      const invalid = { ...validUpload, fileName: "" };
      expect(() => StatementUploadSchema.parse(invalid)).toThrow();
    });

    it("should reject fileName longer than 255 chars", () => {
      const invalid = { ...validUpload, fileName: "a".repeat(256) };
      expect(() => StatementUploadSchema.parse(invalid)).toThrow();
    });

    it("should reject empty fileData", () => {
      const invalid = { ...validUpload, fileData: "" };
      expect(() => StatementUploadSchema.parse(invalid)).toThrow();
    });
  });

  describe("security - path traversal", () => {
    it("should reject fileName with double dots (..)", () => {
      const invalid = { ...validUpload, fileName: "../../../etc/passwd" };
      expect(() => StatementUploadSchema.parse(invalid)).toThrow();
    });

    it("should reject fileName with forward slashes", () => {
      const invalid = { ...validUpload, fileName: "path/to/file.pdf" };
      expect(() => StatementUploadSchema.parse(invalid)).toThrow();
    });

    it("should reject fileName with backslashes", () => {
      const invalid = { ...validUpload, fileName: "path\\to\\file.pdf" };
      expect(() => StatementUploadSchema.parse(invalid)).toThrow();
    });

    it("should reject fileName with mixed path separators", () => {
      const invalid = { ...validUpload, fileName: "..\\secret/file.pdf" };
      expect(() => StatementUploadSchema.parse(invalid)).toThrow();
    });
  });

  describe("security - base64 validation", () => {
    it("should reject invalid base64 characters (special chars)", () => {
      const invalid = { ...validUpload, fileData: "SGVsbG8@V29ybGQh" };
      expect(() => StatementUploadSchema.parse(invalid)).toThrow();
    });

    it("should reject invalid base64 characters (spaces)", () => {
      const invalid = { ...validUpload, fileData: "SGVs bG8g V29y" };
      expect(() => StatementUploadSchema.parse(invalid)).toThrow();
    });

    it("should reject invalid base64 characters (unicode)", () => {
      const invalid = { ...validUpload, fileData: "SGVsbG8ñV29ybGQ=" };
      expect(() => StatementUploadSchema.parse(invalid)).toThrow();
    });
  });

  describe("security - file size limit", () => {
    it("should reject files exceeding size limit", () => {
      // Create a string larger than 14MB (the limit)
      const largeData = "A".repeat(14_000_001);
      const invalid = { ...validUpload, fileData: largeData };
      expect(() => StatementUploadSchema.parse(invalid)).toThrow();
    });

    it("should accept files at the size limit", () => {
      // Create a string exactly at the limit
      const maxData = "A".repeat(14_000_000);
      const valid = { ...validUpload, fileData: maxData };
      expect(() => StatementUploadSchema.parse(valid)).not.toThrow();
    });
  });
});

describe("StatementUpdateSchema", () => {
  describe("valid data", () => {
    it("should accept all optional fields", () => {
      const update = {
        statementDate: "2024-01-15",
        dueDate: "2024-02-05",
        previousBalance: "100.50",
        paymentsReceived: "50.00",
        purchases: "200.00",
        fees: "10.00",
        interest: "5.00",
        totalAmount: "265.50",
        status: "reviewed" as const,
      };
      expect(() => StatementUpdateSchema.parse(update)).not.toThrow();
    });

    it("should accept partial updates", () => {
      const update = { status: "reviewed" as const };
      expect(() => StatementUpdateSchema.parse(update)).not.toThrow();
    });

    it("should accept empty object", () => {
      expect(() => StatementUpdateSchema.parse({})).not.toThrow();
    });
  });

  describe("invalid data", () => {
    it("should reject invalid date format", () => {
      const invalid = { statementDate: "15/01/2024" };
      expect(() => StatementUpdateSchema.parse(invalid)).toThrow();
    });

    it("should reject invalid status", () => {
      const invalid = { status: "invalid_status" };
      expect(() => StatementUpdateSchema.parse(invalid)).toThrow();
    });

    it("should reject negative amounts", () => {
      const invalid = { totalAmount: "-100" };
      expect(() => StatementUpdateSchema.parse(invalid)).toThrow();
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
    it("should accept valid update data", () => {
      expect(() => LineItemUpdateSchema.parse(validUpdate)).not.toThrow();
    });

    it("should accept null finalCategoryId", () => {
      const withNull = { ...validUpdate, finalCategoryId: null };
      expect(() => LineItemUpdateSchema.parse(withNull)).not.toThrow();
    });

    it("should accept only id", () => {
      const minimal = { id: 1 };
      expect(() => LineItemUpdateSchema.parse(minimal)).not.toThrow();
    });
  });

  describe("invalid data", () => {
    it("should reject missing id", () => {
      const { id, ...invalid } = validUpdate;
      expect(() => LineItemUpdateSchema.parse(invalid)).toThrow();
    });

    it("should reject negative id", () => {
      const invalid = { ...validUpdate, id: -1 };
      expect(() => LineItemUpdateSchema.parse(invalid)).toThrow();
    });

    it("should reject negative finalCategoryId", () => {
      const invalid = { ...validUpdate, finalCategoryId: -1 };
      expect(() => LineItemUpdateSchema.parse(invalid)).toThrow();
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
    it("should accept all query params", () => {
      const valid = {
        creditCardId: 1,
        status: "pending",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        page: 2,
        limit: 50,
      };
      expect(() => StatementListQuerySchema.parse(valid)).not.toThrow();
    });

    it("should use default values", () => {
      const result = StatementListQuerySchema.parse({});
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it("should coerce string numbers to numbers", () => {
      const result = StatementListQuerySchema.parse({
        creditCardId: "1",
        page: "2",
        limit: "30",
      });
      expect(result.creditCardId).toBe(1);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(30);
    });
  });

  describe("invalid data", () => {
    it("should reject limit over 100", () => {
      const invalid = { limit: 101 };
      expect(() => StatementListQuerySchema.parse(invalid)).toThrow();
    });

    it("should reject negative page", () => {
      const invalid = { page: -1 };
      expect(() => StatementListQuerySchema.parse(invalid)).toThrow();
    });

    it("should reject zero page", () => {
      const invalid = { page: 0 };
      expect(() => StatementListQuerySchema.parse(invalid)).toThrow();
    });

    it("should reject invalid date format", () => {
      const invalid = { startDate: "01/01/2024" };
      expect(() => StatementListQuerySchema.parse(invalid)).toThrow();
    });

    it("should reject invalid status", () => {
      const invalid = { status: "invalid" };
      expect(() => StatementListQuerySchema.parse(invalid)).toThrow();
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
    it("should accept valid parsed line item", () => {
      expect(() => ParsedLineItemSchema.parse(validItem)).not.toThrow();
    });

    it("should accept negative amounts", () => {
      const negative = { ...validItem, amount: "-50.00" };
      expect(() => ParsedLineItemSchema.parse(negative)).not.toThrow();
    });

    it("should accept optional category", () => {
      const withCategory = { ...validItem, category: "Alimentação" };
      expect(() => ParsedLineItemSchema.parse(withCategory)).not.toThrow();
    });
  });

  describe("invalid data", () => {
    it("should reject amount without decimal places", () => {
      const invalid = { ...validItem, amount: "100" };
      expect(() => ParsedLineItemSchema.parse(invalid)).toThrow();
    });

    it("should reject invalid date format", () => {
      const invalid = { ...validItem, date: "10/01/2024" };
      expect(() => ParsedLineItemSchema.parse(invalid)).toThrow();
    });

    it("should reject empty description", () => {
      const invalid = { ...validItem, description: "" };
      expect(() => ParsedLineItemSchema.parse(invalid)).toThrow();
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
    it("should accept valid parsed statement", () => {
      expect(() => ParsedStatementSchema.parse(validStatement)).not.toThrow();
    });

    it("should accept empty line items", () => {
      const empty = { ...validStatement, lineItems: [] };
      expect(() => ParsedStatementSchema.parse(empty)).not.toThrow();
    });

    it("should accept zero amounts", () => {
      const zeros = {
        ...validStatement,
        previousBalance: "0.00",
        paymentsReceived: "0.00",
        purchases: "0.00",
        fees: "0.00",
        interest: "0.00",
        totalAmount: "0.00",
      };
      expect(() => ParsedStatementSchema.parse(zeros)).not.toThrow();
    });
  });

  describe("invalid data", () => {
    it("should reject negative previousBalance", () => {
      const invalid = { ...validStatement, previousBalance: "-100.00" };
      expect(() => ParsedStatementSchema.parse(invalid)).toThrow();
    });

    it("should reject negative paymentsReceived", () => {
      const invalid = { ...validStatement, paymentsReceived: "-50.00" };
      expect(() => ParsedStatementSchema.parse(invalid)).toThrow();
    });

    it("should reject negative purchases", () => {
      const invalid = { ...validStatement, purchases: "-200.00" };
      expect(() => ParsedStatementSchema.parse(invalid)).toThrow();
    });

    it("should reject negative fees", () => {
      const invalid = { ...validStatement, fees: "-10.00" };
      expect(() => ParsedStatementSchema.parse(invalid)).toThrow();
    });

    it("should reject negative interest", () => {
      const invalid = { ...validStatement, interest: "-5.00" };
      expect(() => ParsedStatementSchema.parse(invalid)).toThrow();
    });

    it("should reject negative totalAmount", () => {
      const invalid = { ...validStatement, totalAmount: "-265.00" };
      expect(() => ParsedStatementSchema.parse(invalid)).toThrow();
    });

    it("should reject invalid date format", () => {
      const invalid = { ...validStatement, statementDate: "15/01/2024" };
      expect(() => ParsedStatementSchema.parse(invalid)).toThrow();
    });

    it("should reject amounts without decimal places", () => {
      const invalid = { ...validStatement, totalAmount: "100" };
      expect(() => ParsedStatementSchema.parse(invalid)).toThrow();
    });
  });
});
