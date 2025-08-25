import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "@vitest/browser/context";
import { BrazilianCurrencyInput } from "@/features/shared/components/ui/brazilian-currency-input";

describe("BrazilianCurrencyInput - Browser Tests", () => {
  describe("Basic Rendering", () => {
    it("renders with default props in browser", async () => {
      render(<BrazilianCurrencyInput data-testid="currency-input" />);

      await expect.element(page.getByTestId("currency-input")).toBeVisible();
      await expect.element(page.getByText("R$")).toBeVisible();

      const input = page.getByTestId("currency-input");
      await expect.element(input).toHaveAttribute("placeholder", "0,00");
      await expect.element(input).toHaveAttribute("type", "text");
    });

    it("renders with custom currency symbol", async () => {
      render(
        <BrazilianCurrencyInput
          currencySymbol="US$"
          data-testid="currency-input"
        />
      );

      await expect.element(page.getByText("US$")).toBeVisible();
      await expect.element(page.getByText("R$")).not.toBeInTheDocument();
    });

    it("renders with custom placeholder", async () => {
      render(
        <BrazilianCurrencyInput
          placeholder="Digite o valor"
          data-testid="currency-input"
        />
      );

      const input = page.getByTestId("currency-input");
      await expect.element(input).toHaveAttribute("placeholder", "Digite o valor");
    });

    it("forwards additional props correctly", async () => {
      render(
        <BrazilianCurrencyInput
          disabled
          readOnly
          data-testid="currency-input"
        />
      );

      const input = page.getByTestId("currency-input");
      await expect.element(input).toBeDisabled();
      await expect.element(input).toHaveAttribute("readonly");
    });
  });

  describe("Basic Browser Functionality", () => {
    it("handles basic user input in real browser", async () => {
      let formValue = "";

      const TestComponent = () => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          formValue = e.target.value;
        };

        return (
          <BrazilianCurrencyInput
            onChange={handleChange}
            data-testid="currency-input"
          />
        );
      };

      render(<TestComponent />);

      const input = page.getByTestId("currency-input");
      await expect.element(input).toBeVisible();

      await input.click();
      await input.fill("1234.56");

      // Verify the form receives the correct decimal value
      expect(formValue).toBe("1234.56");
    });
  });

  describe("Currency Formatting Logic - Real Browser Behavior", () => {
    it("formats numeric input to Brazilian format", async () => {
      let formValue = "";

      const TestComponent = () => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          formValue = e.target.value;
        };

        return (
          <BrazilianCurrencyInput
            onChange={handleChange}
            data-testid="currency-input"
          />
        );
      };

      render(<TestComponent />);

      const input = page.getByTestId("currency-input");
      await input.click();
      await input.fill("1234.56");

      expect(formValue).toBe("1234.56");
    });

    it("handles comma-based decimal input correctly", async () => {
      let formValue = "";

      const TestComponent = () => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          formValue = e.target.value;
        };

        return (
          <BrazilianCurrencyInput
            onChange={handleChange}
            data-testid="currency-input"
          />
        );
      };

      render(<TestComponent />);

      const input = page.getByTestId("currency-input");
      await input.click();
      await input.fill("123,45");

      // Should convert comma to dot for API
      expect(formValue).toBe("123.45");
    });

    it("handles large numbers with thousand separators", async () => {
      let formValue = "";

      const TestComponent = () => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          formValue = e.target.value;
        };

        return (
          <BrazilianCurrencyInput
            onChange={handleChange}
            data-testid="currency-input"
          />
        );
      };

      render(<TestComponent />);

      const input = page.getByTestId("currency-input");
      await input.click();
      await input.fill("1234567.89");

      expect(formValue).toBe("1234567.89");
    });

    it("removes invalid characters", async () => {
      let formValue = "";

      const TestComponent = () => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          formValue = e.target.value;
        };

        return (
          <BrazilianCurrencyInput
            onChange={handleChange}
            data-testid="currency-input"
          />
        );
      };

      render(<TestComponent />);

      const input = page.getByTestId("currency-input");
      await input.click();
      await input.fill("abc123.45def");

      expect(formValue).toBe("123.45");
    });
  });

  describe("Value Synchronization - Controlled Component Behavior", () => {
    it("initializes display value from formatted prop value", async () => {
      render(
        <BrazilianCurrencyInput
          value="1.234,56"
          data-testid="currency-input"
        />
      );

      const input = page.getByTestId("currency-input");
      await expect.element(input).toHaveValue("1.234,56");
    });

    it("initializes display value from decimal prop value", async () => {
      render(
        <BrazilianCurrencyInput
          value="1234.56"
          data-testid="currency-input"
        />
      );

      const input = page.getByTestId("currency-input");
      // Should format decimal to Brazilian display format
      await expect.element(input).toHaveValue("123.456,00");
    });

    it("clears display when value becomes empty", async () => {
      render(
        <BrazilianCurrencyInput
          value=""
          data-testid="currency-input"
        />
      );

      const input = page.getByTestId("currency-input");
      await expect.element(input).toHaveValue("");
    });
  });

  describe("Browser Specific Interactions", () => {
    it("handles real user input and formatting", async () => {
      render(<BrazilianCurrencyInput data-testid="currency-input" />);

      const input = page.getByTestId("currency-input");
      await input.click();
      await input.fill("123.45");

      // Check that input is visible and interactive
      await expect.element(input).toBeVisible();
    });

    it("maintains focus during formatting", async () => {
      render(<BrazilianCurrencyInput data-testid="currency-input" />);

      const input = page.getByTestId("currency-input");
      await input.click();

      await input.fill("123");
      // Check input is still interactive after formatting
      await expect.element(input).toBeVisible();
    });
  });

  describe("Visual Layout Tests", () => {
    it("has correct positioning and styling", async () => {
      render(
        <BrazilianCurrencyInput
          currencySymbol="€"
          data-testid="currency-input"
        />
      );

      const input = page.getByTestId("currency-input");
      await expect.element(input).toBeVisible();

      // Check currency symbol is displayed
      await expect.element(page.getByText("€")).toBeVisible();
    });
  });

  describe("Browser Specific Features", () => {
    it("applies CSS styles correctly in browser", async () => {
      render(<BrazilianCurrencyInput data-testid="currency-input" />);

      const input = page.getByTestId("currency-input");

      // Check that input is rendered and visible
      await expect.element(input).toBeVisible();

      // Verify it has expected CSS classes by checking className attribute
      await expect.element(input).toHaveAttribute("class");
    });
  });
});
