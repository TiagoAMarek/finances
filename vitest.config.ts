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
            "__tests__/browser/**",  // Exclude browser-specific tests
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
          jsx: 'automatic',
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
      // Projeto Browser (Playwright environment)
      {
        test: {
          name: "browser",
          browser: {
            enabled: true,
            provider: "playwright",
            instances: [
              { browser: "chromium" }  // Single browser for faster testing
            ],
            headless: true,
            viewport: {
              width: 1280,
              height: 720
            },
            // Enhanced browser configuration following latest Vitest docs
            screenshotFailures: false,
            ui: false, // Since we're running headless
            api: {
              port: 63315, // Default port, explicit is better
            }
          },
          globals: true,
          setupFiles: ["./__tests__/browser-setup.ts"],
          include: [
            "__tests__/browser/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
            "**/*.browser.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"
          ],
          exclude: [
            "node_modules/**",
            "dist/**",
            ".next/**",
            "coverage/**",
            "**/examples/**",
            "**/*.{node,server}.{test,spec}.*",  // Exclude server tests
            "**/api/**"  // Exclude API tests
          ],
          testTimeout: 5000,      // Optimized for browser tests
          hookTimeout: 3000,      // Optimized for browser tests
        },
        esbuild: {
          jsx: 'automatic',
        },
        optimizeDeps: {
          include: [
            'react/jsx-dev-runtime',
            'react',
            'react-dom',
            'next/navigation',
            'next/image',
            '@vitest/browser/context',
            'vitest-browser-react'
          ],
          exclude: ['@vitest/browser']
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
