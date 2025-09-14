import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { memo } from "react";

import { MetricCard } from "@/features/shared/components/ui";
import { BankAccount } from "@/lib/schemas";

interface AccountsMetricsGridProps {
  accounts: BankAccount[];
}

export const AccountsMetricsGrid = memo<AccountsMetricsGridProps>(
  function AccountsMetricsGrid({ accounts }) {
    // Calculate metrics
    const totalBalance = accounts.reduce(
      (sum, account) => sum + parseFloat(account.balance),
      0,
    );

    const positiveAccounts = accounts.filter(
      (account) => parseFloat(account.balance) >= 0,
    );

    const negativeAccounts = accounts.filter(
      (account) => parseFloat(account.balance) < 0,
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          description="Todas as contas"
          formatValue="currency"
          icon={Wallet}
          iconTheme={(value) => (Number(value) >= 0 ? "primary" : "neutral")}
          title="Saldo Total"
          value={totalBalance}
          valueTheme={(value) => (Number(value) >= 0 ? "success" : "danger")}
        />
        <MetricCard
          description={(value) =>
            `${Number(value) === 1 ? "conta" : "contas"} com saldo positivo`
          }
          formatValue="number"
          icon={TrendingUp}
          iconTheme="success"
          title="Contas Positivas"
          value={positiveAccounts.length}
          valueTheme="success"
        />
        <MetricCard
          description={(value) =>
            `${Number(value) === 1 ? "conta" : "contas"} com saldo negativo`
          }
          formatValue="number"
          icon={TrendingDown}
          iconTheme="danger"
          title="Contas Negativas"
          value={negativeAccounts.length}
          valueTheme="danger"
        />
      </div>
    );
  },
);
