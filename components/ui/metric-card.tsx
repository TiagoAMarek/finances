import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

type ColorTheme =
  | "success"
  | "danger"
  | "warning"
  | "primary"
  | "neutral"
  | "orange";
type ValueFormat = "currency" | "number" | "custom";

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string | ((value: string | number) => string);
  icon: LucideIcon;
  iconTheme?: ColorTheme | ((value: string | number) => ColorTheme);
  valueTheme?: ColorTheme | ((value: string | number) => ColorTheme);
  formatValue?: ValueFormat;
  className?: string;
  hoverEffect?: boolean;
}

const themeConfig = {
  success: {
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500",
    valueColor: "text-green-600 dark:text-green-400",
  },
  danger: {
    iconBg: "bg-red-500/10",
    iconColor: "text-red-500",
    valueColor: "text-red-600 dark:text-red-400",
  },
  warning: {
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    valueColor: "text-amber-600 dark:text-amber-400",
  },
  primary: {
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    valueColor: "text-blue-600 dark:text-blue-400",
  },
  neutral: {
    iconBg: "bg-gray-500/10",
    iconColor: "text-gray-500",
    valueColor: "text-gray-600 dark:text-gray-400",
  },
  orange: {
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-500",
    valueColor: "text-orange-600 dark:text-orange-400",
  },
};

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  iconTheme = "primary",
  valueTheme = "primary",
  formatValue = "number",
  className,
  hoverEffect = false,
}: MetricCardProps) {
  const resolvedIconTheme =
    typeof iconTheme === "function" ? iconTheme(value) : iconTheme;
  const resolvedValueTheme =
    typeof valueTheme === "function" ? valueTheme(value) : valueTheme;
  const resolvedDescription =
    typeof description === "function" ? description(value) : description;

  const iconConfig = themeConfig[resolvedIconTheme];
  const valueConfig = themeConfig[resolvedValueTheme];

  const formatDisplayValue = (val: string | number): string => {
    if (formatValue === "currency" && typeof val === "number") {
      return formatCurrency(val);
    }
    if (formatValue === "number") {
      return val.toString();
    }
    // formatValue === "custom"
    return val.toString();
  };

  return (
    <Card
      className={cn(
        hoverEffect && "hover:shadow-md transition-shadow",
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            iconConfig.iconBg,
          )}
        >
          <Icon className={cn("h-4 w-4", iconConfig.iconColor)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", valueConfig.valueColor)}>
          {formatDisplayValue(value)}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {resolvedDescription}
        </p>
      </CardContent>
    </Card>
  );
}
