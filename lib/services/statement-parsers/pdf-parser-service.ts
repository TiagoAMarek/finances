import { PDFParse } from "pdf-parse";

/**
 * Service for extracting text from PDF files
 */
export class PDFParserService {
  /**
   * Extract text content from a PDF buffer
   * @param pdfBuffer - The PDF file as a Buffer
   * @returns Extracted text content
   */
  async extractText(pdfBuffer: Buffer): Promise<string> {
    try {
      const parser = new PDFParse({ data: pdfBuffer });
      const result = await parser.getText();
      await parser.destroy();
      return result.text;
    } catch (error) {
      throw new Error(
        `Falha ao extrair texto do PDF: ${error instanceof Error ? error.message : "Erro desconhecido"}`
      );
    }
  }

  /**
   * Extract metadata from a PDF buffer
   * @param pdfBuffer - The PDF file as a Buffer
   * @returns PDF metadata including page count, info, etc.
   */
  async extractMetadata(pdfBuffer: Buffer): Promise<{
    numpages: number;
    info: Record<string, any>;
  }> {
    try {
      const parser = new PDFParse({ data: pdfBuffer });
      const result = await parser.getInfo();
      await parser.destroy();
      
      return {
        numpages: result.total,
        info: result.info || {},
      };
    } catch (error) {
      throw new Error(
        `Falha ao extrair metadados do PDF: ${error instanceof Error ? error.message : "Erro desconhecido"}`
      );
    }
  }

  /**
   * Validate if buffer is a valid PDF file
   * @param buffer - File buffer to validate
   * @returns true if valid PDF
   */
  isValidPDF(buffer: Buffer): boolean {
    // PDF files start with %PDF- magic bytes
    const pdfSignature = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d]); // %PDF-
    
    if (buffer.length < 5) {
      return false;
    }
    
    return buffer.subarray(0, 5).equals(pdfSignature);
  }
}
