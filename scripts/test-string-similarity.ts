import { fuzzySimilarity, normalizeString, areSimilar } from "../lib/utils/string-similarity";

console.log("🧪 Testing String Similarity Utilities...\n");

// Test cases for string similarity
const testCases = [
  {
    str1: "UBER *TRIP",
    str2: "UBER TRIP",
    expectedSimilar: true,
    description: "Exact match with special chars"
  },
  {
    str1: "IFOOD *RESTAURANTE",
    str2: "IFOOD RESTAURANTE LTDA",
    expectedSimilar: true,
    description: "Similar with extra text"
  },
  {
    str1: "MERCADO LIVRE",
    str2: "MERCADOLIVRE",
    expectedSimilar: true,
    description: "Same with/without space"
  },
  {
    str1: "SPOTIFY BRASIL",
    str2: "SPOTIFY",
    expectedSimilar: false, // Different - could be different subscriptions
    description: "Partial match (possible duplicate, not definite)"
  },
  {
    str1: "NETFLIX",
    str2: "AMAZON PRIME",
    expectedSimilar: false,
    description: "Completely different"
  },
  {
    str1: "Farmácia São João",
    str2: "FARMACIA SAO JOAO",
    expectedSimilar: true,
    description: "With accents vs without"
  },
  {
    str1: "CINEMARK IGUATEMI",
    str2: "CINEMARK SHOPPING",
    expectedSimilar: false, // Different locations - likely different transactions
    description: "Same establishment, different location (67% - flagged as possible)"
  },
];

console.log("=".repeat(80));
console.log("STRING SIMILARITY TESTS");
console.log("=".repeat(80));

let passed = 0;
let failed = 0;

testCases.forEach((test, index) => {
  const similarity = fuzzySimilarity(test.str1, test.str2);
  const similar = areSimilar(test.str1, test.str2);
  const passed_test = similar === test.expectedSimilar;
  
  const status = passed_test ? "✅ PASS" : "❌ FAIL";
  if (passed_test) passed++;
  else failed++;
  
  console.log(`\n[${index + 1}] ${status} - ${test.description}`);
  console.log(`    "${test.str1}"`);
  console.log(`    vs`);
  console.log(`    "${test.str2}"`);
  console.log(`    Normalized: "${normalizeString(test.str1)}" vs "${normalizeString(test.str2)}"`);
  console.log(`    Similarity: ${(similarity * 100).toFixed(1)}%`);
  console.log(`    Are Similar (≥80%): ${similar ? "YES" : "NO"}`);
  console.log(`    Expected: ${test.expectedSimilar ? "YES" : "NO"}`);
});

console.log("\n" + "=".repeat(80));
console.log(`RESULTS: ${passed} passed, ${failed} failed`);
console.log("=".repeat(80));

if (failed > 0) {
  console.log("\n⚠️  Some tests failed. You may need to adjust the similarity threshold.");
  process.exit(1);
} else {
  console.log("\n✅ All string similarity tests passed!");
}
