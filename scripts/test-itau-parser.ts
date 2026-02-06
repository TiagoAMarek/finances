import * as fs from "fs";
import * as path from "path";
import { ParserFactory } from "../lib/services/statement-parsers";

async function testItauParser() {
  console.log("🧪 Testing Itau Parser...\n");

  try {
    // Read the sample PDF
    const pdfPath = "/Users/tiagomarek/Downloads/d24be227-2679-4442-9b96-54210555a8f5.pdf";
    
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`PDF file not found: ${pdfPath}`);
    }

    const pdfBuffer = fs.readFileSync(pdfPath);
    console.log(`✅ Loaded PDF: ${path.basename(pdfPath)} (${(pdfBuffer.length / 1024).toFixed(2)} KB)\n`);

    // Get the Itau parser
    const parser = ParserFactory.getParser("itau");
    console.log(`✅ Parser loaded: ${parser.getBankCode()}\n`);

    // Parse the PDF
    console.log("📄 Parsing statement...\n");
    const statement = await parser.parse(pdfBuffer, path.basename(pdfPath));

    // Display results
    console.log("=" .repeat(60));
    console.log("STATEMENT METADATA");
    console.log("=".repeat(60));
    console.log(`Bank Code:         ${statement.bankCode}`);
    console.log(`Statement Date:    ${statement.statementDate}`);
    console.log(`Due Date:          ${statement.dueDate}`);
    console.log(`Previous Balance:  R$ ${statement.previousBalance}`);
    console.log(`Payments Received: R$ ${statement.paymentsReceived}`);
    console.log(`Purchases:         R$ ${statement.purchases}`);
    console.log(`Fees:              R$ ${statement.fees}`);
    console.log(`Interest:          R$ ${statement.interest}`);
    console.log(`Total Amount:      R$ ${statement.totalAmount}`);
    console.log(`\n${"=".repeat(60)}`);
    console.log(`LINE ITEMS (${statement.lineItems.length} transactions)`);
    console.log("=".repeat(60));
    
    statement.lineItems.forEach((item, index) => {
      console.log(`\n[${index + 1}] ${item.date}`);
      console.log(`    Description: ${item.description}`);
      console.log(`    Amount:      R$ ${item.amount}`);
      console.log(`    Type:        ${item.type}`);
      if (item.category) {
        console.log(`    Category:    ${item.category}`);
      }
    });

    console.log(`\n${"=".repeat(60)}`);
    console.log("✅ PARSING SUCCESSFUL!");
    console.log("=".repeat(60));

    // Summary statistics
    const purchases = statement.lineItems.filter(i => i.type === "purchase");
    const payments = statement.lineItems.filter(i => i.type === "payment");
    
    console.log(`\n📊 Summary:`);
    console.log(`   Total transactions: ${statement.lineItems.length}`);
    console.log(`   Purchases: ${purchases.length}`);
    console.log(`   Payments: ${payments.length}`);
    
  } catch (error) {
    console.error("\n❌ ERROR:", error instanceof Error ? error.message : error);
    console.error("\nStack trace:", error instanceof Error ? error.stack : "");
    process.exit(1);
  }
}

// Run the test
testItauParser();
