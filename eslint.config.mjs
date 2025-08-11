import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
  }),
  // Include test files for linting
  {
    files: [
      "**/*.test.ts",
      "**/*.test.tsx", 
      "**/*.spec.ts",
      "**/*.spec.tsx",
      "tests/**/*.ts",
      "tests/**/*.tsx",
      "vitest.config.ts"
    ],
    rules: {
      // Allow any for test files where it's common
      "@typescript-eslint/no-explicit-any": "off",
      // Allow unused vars in tests (test parameters, etc.)
      "@typescript-eslint/no-unused-vars": "off",
      // Allow non-null assertions in tests
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
];

export default eslintConfig;
