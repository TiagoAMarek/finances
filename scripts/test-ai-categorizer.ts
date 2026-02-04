import { AICategorizer, Category } from "../lib/services/ai-categorizer";
import { ParsedLineItem } from "../lib/schemas/credit-card-statements";

// Sample categories (typical Brazilian expense categories)
const sampleCategories: Category[] = [
  { id: 1, name: "Alimentação", type: "expense" },
  { id: 2, name: "Transporte", type: "expense" },
  { id: 3, name: "Saúde", type: "expense" },
  { id: 4, name: "Lazer", type: "expense" },
  { id: 5, name: "Educação", type: "expense" },
  { id: 6, name: "Moradia", type: "expense" },
  { id: 7, name: "Vestuário", type: "expense" },
  { id: 8, name: "Serviços", type: "expense" },
  { id: 9, name: "Compras", type: "expense" },
  { id: 10, name: "Outros", type: "expense" },
];

// Sample transactions from the parsed Itau PDF
const sampleTransactions: ParsedLineItem[] = [
  {
    date: "2024-01-03",
    description: "CINEMARK",
    amount: "139.00",
    type: "purchase",
  },
  {
    date: "2024-01-05",
    description: "UBER",
    amount: "35.50",
    type: "purchase",
  },
  {
    date: "2024-01-10",
    description: "IFOOD",
    amount: "82.00",
    type: "purchase",
  },
  {
    date: "2024-01-12",
    description: "FARMACIA SAO JOAO",
    amount: "45.90",
    type: "purchase",
  },
  {
    date: "2024-01-15",
    description: "RENNER",
    amount: "250.00",
    type: "purchase",
  },
  {
    date: "2024-01-18",
    description: "SPOTIFY",
    amount: "21.90",
    type: "purchase",
  },
  {
    date: "2024-01-20",
    description: "MERCADO LIVRE",
    amount: "180.00",
    type: "purchase",
  },
];

async function testAICategorizer() {
  console.log("🧪 Testing AI Categorizer (Google Gemini)...\n");

  // Check if GEMINI_API_KEY is set
  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY not set!");
    console.log("\n📝 To test AI categorization:");
    console.log("1. Get a free API key at: https://makersuite.google.com/app/apikey");
    console.log("2. Add to your .env file: GEMINI_API_KEY=your-api-key-here");
    console.log("3. Run this test again\n");
    process.exit(1);
  }

  try {
    console.log("📊 Available Categories:");
    sampleCategories.forEach((cat) => {
      console.log(`   ${cat.id}. ${cat.name}`);
    });

    console.log(`\n🔍 Transactions to Categorize (${sampleTransactions.length}):`);
    sampleTransactions.forEach((tx, i) => {
      console.log(`   ${i + 1}. ${tx.description} - R$ ${tx.amount}`);
    });

    console.log("\n🤖 Calling Gemini AI...\n");

    // Create categorizer and process batch
    const categorizer = new AICategorizer();
    const results = await categorizer.categorizeBatch(
      sampleTransactions,
      sampleCategories
    );

    // Display results
    console.log("=".repeat(80));
    console.log("CATEGORIZATION RESULTS");
    console.log("=".repeat(80));

    let successCount = 0;
    sampleTransactions.forEach((tx) => {
      const result = results.get(tx.description);
      if (!result) return;

      const category = sampleCategories.find((c) => c.id === result.suggestedCategoryId);
      const categoryName = category ? category.name : "Sem categoria";
      const confidencePercent = (result.confidence * 100).toFixed(0);
      
      console.log(`\n📌 ${tx.description} (R$ ${tx.amount})`);
      console.log(`   Categoria: ${categoryName} (ID: ${result.suggestedCategoryId || "N/A"})`);
      console.log(`   Confiança: ${confidencePercent}%`);
      if (result.reasoning) {
        console.log(`   Razão: ${result.reasoning}`);
      }

      if (result.suggestedCategoryId !== null) {
        successCount++;
      }
    });

    console.log("\n" + "=".repeat(80));
    console.log("📊 Summary:");
    console.log(`   Total transactions: ${sampleTransactions.length}`);
    console.log(`   Successfully categorized: ${successCount}`);
    console.log(`   Not categorized: ${sampleTransactions.length - successCount}`);
    console.log(`   Success rate: ${((successCount / sampleTransactions.length) * 100).toFixed(1)}%`);
    console.log("=".repeat(80));

    console.log("\n✅ AI CATEGORIZATION TEST SUCCESSFUL!");

  } catch (error) {
    console.error("\n❌ ERROR:", error instanceof Error ? error.message : error);
    console.error("\nStack trace:", error instanceof Error ? error.stack : "");
    process.exit(1);
  }
}

// Run the test
testAICategorizer();
