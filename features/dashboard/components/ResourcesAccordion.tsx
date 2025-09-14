import { Wallet } from "lucide-react";
import { memo } from "react";

import { formatDashboardCurrency } from "@/features/dashboard/utils/dashboard-calculations";
import { BankAccount, CreditCard } from "@/lib/schemas";

import { AccountsOverview } from "./AccountsOverview";
import { CreditCardsOverview } from "./CreditCardsOverview";
import { DashboardAccordion } from "./DashboardAccordion";

/**
 * Props for ResourcesAccordion component
 */
interface ResourcesAccordionProps {
  accounts: BankAccount[];
  creditCards: CreditCard[];
  totalBalance: number;
}

/**
 * Resources accordion component for dashboard
 *
 * Features:
 * - Encapsulates accounts and credit cards overview
 * - Uses reusable DashboardAccordionTrigger
 * - Responsive badge display
 * - Memoized for performance
 * - Clean separation of concerns
 */
export const ResourcesAccordion = memo<ResourcesAccordionProps>(
  function ResourcesAccordion({ accounts, creditCards, totalBalance }) {
    const badges = [
      {
        label: `${accounts.length} contas`,
        variant: "secondary" as const,
        hideOnMobile: true,
      },
      {
        label: `${creditCards.length} cartões`,
        variant: "secondary" as const,
        hideOnMobile: true,
      },
      {
        label: `${accounts.length + creditCards.length}`,
        variant: "secondary" as const,
        className: "sm:hidden",
      },
      {
        label: formatDashboardCurrency(totalBalance),
        variant: "outline" as const,
      },
    ];

    return (
      <DashboardAccordion
        badges={badges}
        defaultValue="resources"
        icon={Wallet}
        iconColor="text-blue-500"
        title="Recursos"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
          <AccountsOverview accounts={accounts} totalBalance={totalBalance} />
          <CreditCardsOverview creditCards={creditCards} />
        </div>
      </DashboardAccordion>
    );
  },
);
