import { StatementParser } from "./base-parser";
import { ItauParser } from "./itau-parser";

/**
 * Factory for creating bank-specific statement parsers
 */
export class ParserFactory {
  private static parsers: Map<string, StatementParser> = new Map();

  /**
   * Register available parsers
   */
  static {
    // Register Itau parser
    const itauParser = new ItauParser();
    this.parsers.set(itauParser.getBankCode(), itauParser);
    
    // Add more parsers here as they are implemented
    // this.parsers.set('nubank', new NubankParser());
    // this.parsers.set('bradesco', new BradescoParser());
  }

  /**
   * Get a parser by bank code
   * @param bankCode - Bank identifier (e.g., 'itau', 'nubank')
   * @returns Statement parser instance
   * @throws Error if bank is not supported
   */
  static getParser(bankCode: string): StatementParser {
    const parser = this.parsers.get(bankCode.toLowerCase());
    
    if (!parser) {
      const availableBanks = Array.from(this.parsers.keys()).join(", ");
      throw new Error(
        `Banco não suportado: ${bankCode}. Bancos disponíveis: ${availableBanks}`
      );
    }
    
    return parser;
  }

  /**
   * Auto-detect which parser can handle the given PDF
   * @param pdfText - Extracted text from PDF
   * @returns Parser that can handle the PDF
   * @throws Error if no parser can handle the PDF
   */
  static detectParser(pdfText: string): StatementParser {
    for (const parser of this.parsers.values()) {
      if (parser.canParse(pdfText)) {
        return parser;
      }
    }
    
    throw new Error(
      "Não foi possível identificar o banco desta fatura. " +
      "Por favor, verifique se o arquivo é uma fatura de cartão de crédito válida."
    );
  }

  /**
   * Get list of supported bank codes
   * @returns Array of bank codes
   */
  static getSupportedBanks(): string[] {
    return Array.from(this.parsers.keys());
  }
}
