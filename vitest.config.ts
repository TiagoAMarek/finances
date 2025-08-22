import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    projects: [
      // Projeto Server (Node environment)
      {
        test: {
          name: "server",
          environment: "node",
          globals: true,
          setupFiles: ["./tests-api/setup.ts"],
          include: [
            "tests-api/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}",
            "app/api/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}",
          ],
          exclude: ["node_modules/**", "dist/**", ".next/**", "coverage/**"],
          testTimeout: 10000,
          hookTimeout: 10000,
        },
        resolve: {
          alias: {
            "@": path.resolve(__dirname, "./"),
          },
        },
        define: {
          "process.env": process.env,
        },
      },
      // Projeto Client (jsdom environment)
      {
        test: {
          name: "client",
          environment: "jsdom",
          globals: true,
          setupFiles: ["./__tests__/setup.ts"],
          include: [
            "__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
            "components/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
            "hooks/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
          ],
          exclude: [
            "node_modules/**",
            "dist/**",
            ".next/**",
            "coverage/**",
            "**/examples/**",
          ],
          testTimeout: 10000,
          hookTimeout: 10000,
        },
        esbuild: {
          jsxInject: `import React from 'react'`,
        },
        resolve: {
          alias: {
            "@": path.resolve(__dirname, "./"),
          },
        },
        define: {
          "process.env": process.env,
        },
      },
    ],
    // Configurações globais aplicadas a todos os projetos
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "**/*.config.*",
        "**/*.d.ts",
        "**/fixtures/**",
        "**/mocks/**",
        ".next/**",
        "__tests__/",
        "coverage/**",
        "node_modules/",
        "tests-api/",
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  define: {
    "process.env": process.env,
  },
});
