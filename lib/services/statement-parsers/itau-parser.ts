import { StatementParser, PDFParsingError } from "./base-parser";
import { ParsedStatement, ParsedLineItem } from "@/lib/schemas/credit-card-statements";
import { PDFParserService } from "./pdf-parser-service";

/**
 * Parser for Itau credit card statements
 */
export class ItauParser extends StatementParser {
  private pdfService: PDFParserService;

  constructor() {
    super();
    this.pdfService = new PDFParserService();
  }

  getBankCode(): string {
    return "itau";
  }

  canParse(pdfText: string): boolean {
    // Check for Itau-specific markers
    return (
      pdfText.includes("Itaú") ||
      pdfText.includes("ITAU") ||
      pdfText.includes("Itau Cartões") ||
      pdfText.includes("Total desta fatura")
    );
  }

  async parse(pdfBuffer: Buffer, fileName: string): Promise<ParsedStatement> {
    try {
      // Extract text from PDF
      const text = await this.pdfService.extractText(pdfBuffer);

      if (!this.canParse(text)) {
        throw new Error("Este PDF não parece ser uma fatura do Itaú");
      }

      // Extract statement metadata
      const statementDate = this.extractStatementDate(text);
      const dueDate = this.extractDueDate(text);
      const year = this.extractYear(statementDate);

      // Extract totals
      const previousBalance = this.extractPreviousBalance(text);
      const paymentsReceived = this.extractPaymentsReceived(text);
      const purchases = this.extractPurchases(text);
      const fees = this.extractFees(text);
      const interest = this.extractInterest(text);
      const totalAmount = this.extractTotalAmount(text);

      // Extract line items (transactions)
      const lineItems = this.extractLineItems(text, year);

      return {
        bankCode: this.getBankCode(),
        statementDate,
        dueDate,
        previousBalance,
        paymentsReceived,
        purchases,
        fees,
        interest,
        totalAmount,
        lineItems,
      };
    } catch (error) {
      throw new PDFParsingError(
        `Erro ao processar fatura do Itaú: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        this.getBankCode(),
        fileName,
        error instanceof Error ? error : undefined
      );
    }
  }

  private extractStatementDate(text: string): string {
    // Look for "Emissão: DD/MM/YYYY" or "Postagem: DD/MM/YYYY"
    const emissaoMatch = text.match(/Emissão:\s*(\d{2}\/\d{2}\/\d{4})/);
    const postagemMatch = text.match(/Postagem:\s*(\d{2}\/\d{2}\/\d{4})/);
    
    const dateStr = emissaoMatch?.[1] || postagemMatch?.[1];
    
    if (!dateStr) {
      throw new Error("Data de emissão da fatura não encontrada");
    }

    return this.parseDate(dateStr);
  }

  private extractDueDate(text: string): string {
    // Look for "Vencimento: DD/MM/YYYY"
    const match = text.match(/Vencimento:\s*(\d{2}\/\d{2}\/\d{4})/);
    
    if (!match) {
      throw new Error("Data de vencimento não encontrada");
    }

    return this.parseDate(match[1]);
  }

  private extractPreviousBalance(text: string): string {
    // Look for "Total da fatura anterior R$ X.XXX,XX" or similar
    const match = text.match(/Total da fatura anterior\s+(\d+[\.,\s]*\d*[,]\d{2})/);
    
    if (!match) {
      return "0.00";
    }

    return this.formatAmount(match[1]);
  }

  private extractPaymentsReceived(text: string): string {
    // Look for "Pagamento efetuado" with negative value
    const match = text.match(/Pagamento(?:s)? efetuado(?:s)?[^\d]*-?\s*(\d+[\.,\s]*\d*[,]\d{2})/i);
    
    if (!match) {
      return "0.00";
    }

    return this.formatAmount(match[1]);
  }

  private extractPurchases(text: string): string {
    // Look for "Lançamentos atuais" or "Total dos lançamentos atuais"
    const match = text.match(/(?:Lançamentos atuais|Total dos lançamentos atuais)\s+(\d+[\.,\s]*\d*[,]\d{2})/i);
    
    if (!match) {
      return "0.00";
    }

    return this.formatAmount(match[1]);
  }

  private extractFees(text: string): string {
    // Look for fees (tarifas, anuidade, etc.)
    // For now, default to 0 - can be enhanced later
    return "0.00";
  }

  private extractInterest(text: string): string {
    // Look for "Juros" line items
    const match = text.match(/Juros(?:\s+do)?\s+rotativo[^\d]*(\d+[\.,\s]*\d*[,]\d{2})/i);
    
    if (!match) {
      return "0.00";
    }

    return this.formatAmount(match[1]);
  }

  private extractTotalAmount(text: string): string {
    // Look for "Total desta fatura" or "O total da sua fatura é"
    const match1 = text.match(/Total desta fatura\s+(\d+[\.,\s]*\d*[,]\d{2})/i);
    const match2 = text.match(/O total da sua fatura é:\s*R\$\s*(\d+[\.,\s]*\d*[,]\d{2})/i);
    
    const match = match1 || match2;
    
    if (!match) {
      throw new Error("Valor total da fatura não encontrado");
    }

    return this.formatAmount(match[1]);
  }

  private extractLineItems(text: string, year: number): ParsedLineItem[] {
    const lineItems: ParsedLineItem[] = [];

    // Use regex to find all transaction patterns: DD/MM DESCRIPTION VALUE
    // Pattern matches: date (DD/MM), description, amount with optional R$, comma decimal
    const transactionPattern = /(\d{2}\/\d{2})\s+(.+?)\s+(?:R\$\s*)?(\d{1,3}(?:[.,\s]*\d{3})*[,]\d{2})/g;
    
    let match;
    while ((match = transactionPattern.exec(text)) !== null) {
      try {
        const [, dateStr, establishment, amountStr] = match;
        
        // Parse date
        const date = this.parseDate(dateStr, year);
        
        // Parse amount
        const amount = this.formatAmount(amountStr);
        
        // Clean establishment name (remove extra spaces and location indicators)
        const description = this.cleanEstablishmentName(establishment);
        
        // Skip if description is too short (likely parsing error)
        if (description.length < 3) {
          continue;
        }
        
        // Determine type - for now, all are purchases (payments would be negative or in a different section)
        const type = "purchase";
        
        lineItems.push({
          date,
          description,
          amount,
          type,
        });
      } catch (error) {
        // Skip invalid transactions
        continue;
      }
    }

    return lineItems;
  }

  private cleanEstablishmentName(name: string): string {
    // Remove extra spaces, location indicators, and common patterns
    let cleaned = name
      .replace(/\s+/g, " ") // Normalize spaces
      .replace(/PORTO\s*ALE\s*G[A-Z]*\s*(?:BR)?/gi, "") // Remove Porto Alegre variants
      .replace(/SAO\s*PAU\s*LO\s*(?:BR)?/gi, "") // Remove Sao Paulo variants  
      .replace(/ELDOR\s*ADO\s*DO\s*S/gi, "") // Remove Eldorado do Sul
      .replace(/CA\s*PA\s*O\s*DA\s*CAN\s*O/gi, "") // Remove Capao da Canoa
      .replace(/(?:BR|BR A|PO RT|PO RTO|SA O)\s*$/gi, "") // Remove trailing location codes
      .trim();
    
    // Remove category keywords that might have been included
    cleaned = cleaned
      .replace(/\b(?:restaurante|supermercado|outro\s*s|lazer|saúde|serviços|vestuário)\b/gi, "")
      .trim();
    
    return cleaned;
  }
}
