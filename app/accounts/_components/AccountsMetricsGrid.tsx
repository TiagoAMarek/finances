import { memo } from "react";
import { BankAccount } from "@/lib/schemas";
import { TotalBalanceMetricCard } from "./TotalBalanceMetricCard";
import { PositiveAccountsMetricCard } from "./PositiveAccountsMetricCard";
import { NegativeAccountsMetricCard } from "./NegativeAccountsMetricCard";

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
        <TotalBalanceMetricCard totalBalance={totalBalance} />
        <PositiveAccountsMetricCard
          positiveAccountsCount={positiveAccounts.length}
        />
        <NegativeAccountsMetricCard
          negativeAccountsCount={negativeAccounts.length}
        />
      </div>
    );
  },
);
