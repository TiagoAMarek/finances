import { memo } from "react";
import { BankAccount } from "@/lib/schemas";
import { MetricCard } from "@/components/ui/metric-card";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

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
          title="Saldo Total"
          value={totalBalance}
          description="Todas as contas"
          icon={Wallet}
          iconTheme={(value) => (Number(value) >= 0 ? "primary" : "neutral")}
          valueTheme={(value) => (Number(value) >= 0 ? "success" : "danger")}
          formatValue="currency"
        />
        <MetricCard
          title="Contas Positivas"
          value={positiveAccounts.length}
          description={(value) =>
            `${Number(value) === 1 ? "conta" : "contas"} com saldo positivo`
          }
          icon={TrendingUp}
          iconTheme="success"
          valueTheme="success"
          formatValue="number"
        />
        <MetricCard
          title="Contas Negativas"
          value={negativeAccounts.length}
          description={(value) =>
            `${Number(value) === 1 ? "conta" : "contas"} com saldo negativo`
          }
          icon={TrendingDown}
          iconTheme="danger"
          valueTheme="danger"
          formatValue="number"
        />
      </div>
    );
  },
);
