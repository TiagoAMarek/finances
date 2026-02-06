import { ParsedStatement, ParsedLineItem } from "@/lib/schemas/credit-card-statements";

/**
 * Base abstract class for credit card statement parsers.
 * Each bank implementation should extend this class and implement the parse method.
 */
export abstract class StatementParser {
  /**
   * Parse a PDF buffer and extract statement data
   * @param pdfBuffer - The PDF file as a Buffer
   * @param fileName - Original filename for error reporting
   * @returns Parsed statement data with line items
   */
  abstract parse(pdfBuffer: Buffer, fileName: string): Promise<ParsedStatement>;

  /**
   * Get the bank code identifier for this parser
   * @returns Bank code string (e.g., 'itau', 'nubank', 'bradesco')
   */
  abstract getBankCode(): string;

  /**
   * Validate if this parser can handle the given PDF
   * @param pdfText - Extracted text from the PDF
   * @returns true if this parser can handle the PDF
   */
  abstract canParse(pdfText: string): boolean;

  /**
   * Helper method to format decimal amounts to standard format (XX.XX)
   * @param amount - Amount string in various formats
   * @returns Formatted amount string
   */
  protected formatAmount(amount: string): string {
    // Remove currency symbols and spaces
    let cleaned = amount.replace(/[R$\s]/g, "");
    
    // Handle Brazilian decimal format (1.234,56 -> 1234.56)
    if (cleaned.includes(",")) {
      cleaned = cleaned.replace(/\./g, ""); // Remove thousand separators
      cleaned = cleaned.replace(",", "."); // Convert decimal separator
    }
    
    // Ensure two decimal places
    const num = parseFloat(cleaned);
    if (isNaN(num)) {
      throw new Error(`Invalid amount format: ${amount}`);
    }
    
    return num.toFixed(2);
  }

  /**
   * Helper method to parse Brazilian date formats to ISO format (YYYY-MM-DD)
   * @param dateStr - Date string in DD/MM/YYYY or DD/MM format
   * @param year - Optional year if date is in DD/MM format
   * @returns ISO date string
   */
  protected parseDate(dateStr: string, year?: number): string {
    const parts = dateStr.split("/");
    
    if (parts.length === 3) {
      // DD/MM/YYYY format
      const day = parts[0].padStart(2, "0");
      const month = parts[1].padStart(2, "0");
      const fullYear = parts[2];
      return `${fullYear}-${month}-${day}`;
    } else if (parts.length === 2 && year) {
      // DD/MM format - use provided year
      const day = parts[0].padStart(2, "0");
      const month = parts[1].padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    
    throw new Error(`Invalid date format: ${dateStr}`);
  }

  /**
   * Helper method to extract year from statement date or filename
   * Useful for parsing transaction dates that only have day/month
   * @param statementDate - Statement date in DD/MM/YYYY format
   * @returns Year as number
   */
  protected extractYear(statementDate: string): number {
    const match = statementDate.match(/(\d{4})$/);
    if (match) {
      return parseInt(match[1], 10);
    }
    // Fallback to current year
    return new Date().getFullYear();
  }
}

/**
 * Error thrown when PDF parsing fails
 */
export class PDFParsingError extends Error {
  constructor(
    message: string,
    public bankCode: string,
    public fileName: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = "PDFParsingError";
  }
}
