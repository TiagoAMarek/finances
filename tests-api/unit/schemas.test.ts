import { describe, it, expect } from "vitest";
import {
  LoginSchema,
  RegisterSchema,
  BankAccountCreateSchema,
  BankAccountUpdateSchema,
  CreditCardCreateSchema,
  TransactionCreateSchema,
  TransferCreateSchema,
} from "@/lib/schemas";

describe("Schemas Zod", () => {
  describe("LoginSchema", () => {
    it("valida dados corretos de login", () => {
      const validData = {
        email: "user@example.com",
         password: "Abcdef1!",
      };

      const result = LoginSchema.safeParse(validData);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("rejeita email em formato inválido", () => {
      const invalidData = {
        email: "email-inválido",
         password: "Abcdef1!",
      };

      const result = LoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Formato de email inválido",
        );
      }
    });

    it("rejeita senha vazia", () => {
      const invalidData = {
        email: "user@example.com",
        password: "",
      };

      const result = LoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Senha é obrigatória");
      }
    });

    it("rejeita dados incompletos", () => {
      const invalidData = { email: "user@example.com" };

      const result = LoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("RegisterSchema", () => {
    it("valida dados corretos de registro", () => {
      const validData = {
        name: "Usuário Teste",
        email: "user@example.com",
        password: "Abcdef1!",
        confirmPassword: "Abcdef1!",
      };

      const result = RegisterSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejeita senha fraca (menos de 8 e sem complexidade)", () => {
      const invalidData = {
        name: "Usuário Teste",
        email: "user@example.com",
        password: "1234567",
        confirmPassword: "1234567",
      };

      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("BankAccountCreateSchema", () => {
    it("valida dados corretos para criação de conta", () => {
      const validData = {
        name: "Conta Corrente",
        balance: "1000.00",
        currency: "BRL",
      };

      const result = BankAccountCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("aplica valores padrão quando não fornecidos", () => {
      const minimalData = { name: "Conta Teste" };

      const result = BankAccountCreateSchema.safeParse(minimalData);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.balance).toBe("0");
        expect(result.data.currency).toBe("BRL");
      }
    });

    it("rejeita nome vazio", () => {
      const invalidData = {
        name: "",
        balance: "1000.00",
        currency: "BRL",
      };

      const result = BankAccountCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Nome da conta é obrigatório",
        );
      }
    });
  });

  describe("CreditCardCreateSchema", () => {
    it("valida dados corretos para criação de cartão", () => {
      const validData = {
        name: "Cartão Visa",
        limit: "2000.00",
        currentBill: "500.00",
      };

      const result = CreditCardCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejeita nome vazio", () => {
      const invalidData = {
        name: "",
        limit: "2000.00",
        currentBill: "500.00",
      };

      const result = CreditCardCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Nome do cartão é obrigatório",
        );
      }
    });
  });

  describe("TransactionCreateSchema", () => {
    it("valida transação de despesa válida", () => {
      const validData = {
        description: "Compra no supermercado",
        amount: "150.00",
        type: "expense" as const,
        date: "2024-01-15",
        categoryId: 1,
        accountId: 1,
      };

      const result = TransactionCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("valida transação de receita válida", () => {
      const validData = {
        description: "Salário",
        amount: "5000.00",
        type: "income" as const,
        date: "2024-01-01",
        categoryId: 1,
        accountId: 1,
      };

      const result = TransactionCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejeita descrição vazia", () => {
      const invalidData = {
        description: "",
        amount: "150.00",
        type: "expense",
        date: "2024-01-15",
        categoryId: 1,
        accountId: 1,
      };

      const result = TransactionCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Descrição é obrigatória");
      }
    });

    it("rejeita valor vazio", () => {
      const invalidData = {
        description: "Teste",
        amount: "",
        type: "expense",
        date: "2024-01-15",
        categoryId: 1,
        accountId: 1,
      };

      const result = TransactionCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Valor é obrigatório");
      }
    });

    it("rejeita categoria vazia", () => {
      const invalidData = {
        description: "Teste",
        amount: "100.00",
        type: "expense",
        date: "2024-01-15",
        accountId: 1,
      };

      const result = TransactionCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Categoria é obrigatória");
      }
    });

    it("rejeita configuração inválida (conta E cartão)", () => {
      const invalidData = {
        description: "Teste",
        amount: "100.00",
        type: "expense",
        date: "2024-01-15",
        categoryId: 1,
        accountId: 1,
        creditCardId: 1,
      };

      const result = TransactionCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Para receitas e despesas, selecione apenas uma conta ou cartão de crédito",
        );
      }
    });
  });

  describe("TransferCreateSchema", () => {
    it("valida transferência válida", () => {
      const validData = {
        description: "Transferência entre contas",
        amount: "500.00",
        date: "2024-01-15",
        fromAccountId: 1,
        toAccountId: 2,
      };

      const result = TransferCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejeita transferência para a mesma conta", () => {
      const invalidData = {
        description: "Transferência",
        amount: "500.00",
        date: "2024-01-15",
        fromAccountId: 1,
        toAccountId: 1,
      };

      const result = TransferCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Não é possível transferir para a mesma conta",
        );
      }
    });

    it("rejeita data vazia", () => {
      const invalidData = {
        description: "Transferência",
        amount: "500.00",
        date: "",
        fromAccountId: 1,
        toAccountId: 2,
      };

      const result = TransferCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Data é obrigatória");
      }
    });
  });

  describe("BankAccountUpdateSchema", () => {
    it("valida atualização parcial válida", () => {
      const validData = {
        name: "Conta Atualizada",
      };

      const result = BankAccountUpdateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("aceita objeto vazio (sem atualizações)", () => {
      const emptyData = {};

      const result = BankAccountUpdateSchema.safeParse(emptyData);
      expect(result.success).toBe(true);
    });

    it("rejeita nome vazio quando fornecido", () => {
      const invalidData = {
        name: "",
      };

      const result = BankAccountUpdateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Nome da conta é obrigatório",
        );
      }
    });
  });
});
