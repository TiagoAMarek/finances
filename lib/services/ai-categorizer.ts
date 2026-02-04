import { genAI, GEMINI_CONFIG, isAICategorizationAvailable } from "@/lib/config/gemini";
import { ParsedLineItem } from "@/lib/schemas/credit-card-statements";

/**
 * Category type for AI categorization
 */
export type Category = {
  id: number;
  name: string;
  type: string;
};

/**
 * Result of AI categorization
 */
export type CategorizationResult = {
  description: string;
  suggestedCategoryId: number | null;
  confidence: number; // 0-1
  reasoning?: string;
};

/**
 * AI-powered transaction categorizer using Google Gemini
 */
export class AICategorizer {
  /**
   * Categorize a batch of transactions
   * @param lineItems - Transactions to categorize
   * @param availableCategories - Categories available for this user
   * @returns Map of description to categorization result
   */
  async categorizeBatch(
    lineItems: ParsedLineItem[],
    availableCategories: Category[]
  ): Promise<Map<string, CategorizationResult>> {
    // Check if AI is available
    if (!isAICategorizationAvailable()) {
      console.warn("AI categorization not available - GEMINI_API_KEY not configured");
      return this.createFallbackResults(lineItems);
    }

    try {
      // Filter to expense categories only (credit card transactions are expenses)
      const expenseCategories = availableCategories.filter(
        (cat) => cat.type === "expense" || cat.type === "both"
      );

      if (expenseCategories.length === 0) {
        console.warn("No expense categories available for categorization");
        return this.createFallbackResults(lineItems);
      }

      // Build the prompt
      const prompt = this.buildPrompt(lineItems, expenseCategories);

      // Call Gemini API
      const model = genAI!.getGenerativeModel({ 
        model: GEMINI_CONFIG.model,
        generationConfig: GEMINI_CONFIG.generationConfig,
        safetySettings: GEMINI_CONFIG.safetySettings as any,
      });

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Parse the response
      return this.parseResponse(text, lineItems, expenseCategories);
    } catch (error) {
      console.error("Error during AI categorization:", error);
      return this.createFallbackResults(lineItems);
    }
  }

  /**
   * Build the categorization prompt
   */
  private buildPrompt(lineItems: ParsedLineItem[], categories: Category[]): string {
    // Create categories list
    const categoriesList = categories
      .map((cat) => `- ID ${cat.id}: ${cat.name}`)
      .join("\n");

    // Create transactions list
    const transactionsList = lineItems
      .map((item, index) => `${index + 1}. "${item.description}" - R$ ${item.amount}`)
      .join("\n");

    return `Você é um assistente financeiro especializado em categorizar transações de cartão de crédito em português brasileiro.

CATEGORIAS DISPONÍVEIS:
${categoriesList}

TRANSAÇÕES PARA CATEGORIZAR:
${transactionsList}

INSTRUÇÕES:
- Analise cada transação e sugira a categoria mais apropriada
- Retorne APENAS um JSON válido no formato especificado abaixo
- Se não tiver certeza sobre uma categoria, retorne null para o categoryId
- Use o número da transação (1, 2, 3...) como referência

FORMATO DE RESPOSTA (JSON):
{
  "categorizations": [
    {
      "transactionNumber": 1,
      "categoryId": <ID da categoria ou null>,
      "confidence": <número entre 0 e 1>,
      "reasoning": "<breve explicação opcional>"
    }
  ]
}

Retorne APENAS o JSON, sem texto adicional antes ou depois.`;
  }

  /**
   * Parse Gemini response and create results map
   */
  private parseResponse(
    responseText: string,
    lineItems: ParsedLineItem[],
    categories: Category[]
  ): Map<string, CategorizationResult> {
    const results = new Map<string, CategorizationResult>();

    try {
      // Extract JSON from response (handle cases where there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const parsed = JSON.parse(jsonMatch[0]);
      const categorizations = parsed.categorizations || [];

      // Map results back to line items
      categorizations.forEach((cat: any) => {
        const transactionIndex = cat.transactionNumber - 1;
        if (transactionIndex >= 0 && transactionIndex < lineItems.length) {
          const lineItem = lineItems[transactionIndex];
          
          // Validate category ID
          let categoryId = cat.categoryId;
          if (categoryId !== null) {
            const categoryExists = categories.some((c) => c.id === categoryId);
            if (!categoryExists) {
              console.warn(`Invalid category ID ${categoryId} suggested by AI`);
              categoryId = null;
            }
          }

          results.set(lineItem.description, {
            description: lineItem.description,
            suggestedCategoryId: categoryId,
            confidence: Math.max(0, Math.min(1, cat.confidence || 0.5)),
            reasoning: cat.reasoning,
          });
        }
      });

      // Fill in any missing items with null results
      lineItems.forEach((item) => {
        if (!results.has(item.description)) {
          results.set(item.description, {
            description: item.description,
            suggestedCategoryId: null,
            confidence: 0,
          });
        }
      });
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return this.createFallbackResults(lineItems);
    }

    return results;
  }

  /**
   * Create fallback results when AI is not available or fails
   */
  private createFallbackResults(lineItems: ParsedLineItem[]): Map<string, CategorizationResult> {
    const results = new Map<string, CategorizationResult>();
    
    lineItems.forEach((item) => {
      results.set(item.description, {
        description: item.description,
        suggestedCategoryId: null,
        confidence: 0,
      });
    });
    
    return results;
  }

  /**
   * Categorize a single transaction (convenience method)
   */
  async categorizeSingle(
    lineItem: ParsedLineItem,
    availableCategories: Category[]
  ): Promise<CategorizationResult> {
    const results = await this.categorizeBatch([lineItem], availableCategories);
    return results.get(lineItem.description) || {
      description: lineItem.description,
      suggestedCategoryId: null,
      confidence: 0,
    };
  }
}
