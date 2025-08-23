import { Progress } from "@/features/shared/components/ui";
import { formatCurrency } from "@/lib/utils";
import { AlertTriangle, Banknote, CreditCard, LucideIcon } from "lucide-react";
import { memo } from "react";

/**
 * Base resource item props
 */
interface BaseResourceItemProps {
  id: number;
  name: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
}

/**
 * Bank account item props
 */
interface BankAccountItemProps extends BaseResourceItemProps {
  balance: number;
}

/**
 * Credit card item props
 */
interface CreditCardItemProps extends BaseResourceItemProps {
  currentBill: number;
  limit: number;
  isHighUsage?: boolean;
}

/**
 * Bank Account Item - displays account name and balance with color coding
 */
const BankAccountItem = memo<BankAccountItemProps>(function BankAccountItem({
  id,
  name,
  balance,
  icon: Icon = Banknote,
  iconColor = "text-blue-500",
  iconBgColor = "bg-blue-500/10",
}) {
  const isPositive = balance >= 0;

  return (
    <div
      key={id}
      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`flex h-6 w-6 items-center justify-center rounded-full ${iconBgColor} flex-shrink-0`}>
          <Icon className={`h-3 w-3 ${iconColor}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm truncate">{name}</p>
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <span
          className={`font-semibold text-sm ${
            isPositive
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {formatCurrency(balance)}
        </span>
      </div>
    </div>
  );
});

/**
 * Credit Card Item - displays card name, bill, limit, and usage progress
 */
const CreditCardItem = memo<CreditCardItemProps>(function CreditCardItem({
  id,
  name,
  currentBill,
  limit,
  icon: Icon = CreditCard,
  iconColor = "text-purple-500",
  iconBgColor = "bg-purple-500/10",
}) {
  const usagePercentage = limit > 0 ? (currentBill / limit) * 100 : 0;
  const isHighUsage = usagePercentage > 80;

  return (
    <div
      key={id}
      className="p-3 rounded-lg border space-y-2 hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`flex h-6 w-6 items-center justify-center rounded-full ${iconBgColor} flex-shrink-0`}>
            <Icon className={`h-3 w-3 ${iconColor}`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm truncate">{name}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Limite: {formatCurrency(limit)}</span>
              {isHighUsage && (
                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Alto uso</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">
            {formatCurrency(currentBill)}
          </p>
          <p className="text-xs text-muted-foreground">
            {usagePercentage.toFixed(0)}% usado
          </p>
        </div>
      </div>

      <Progress
        value={usagePercentage}
        className={`h-2 ${
          isHighUsage
            ? "[&>div]:bg-red-500"
            : usagePercentage > 50
              ? "[&>div]:bg-orange-500"
              : "[&>div]:bg-green-500"
        }`}
      />
    </div>
  );
});

export { BankAccountItem, CreditCardItem };
export type { BankAccountItemProps, CreditCardItemProps };