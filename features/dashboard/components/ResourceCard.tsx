import { Badge, Button } from "@/features/shared/components/ui";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { LucideIcon, Plus } from "lucide-react";
import Link from "next/link";
import { memo, ReactNode } from "react";

/**
 * Resource card base props
 */
interface ResourceCardProps {
  children: ReactNode;
}

/**
 * Resource card header props
 */
interface ResourceCardHeaderProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  count?: number;
}

/**
 * Resource card empty state props
 */
interface ResourceCardEmptyProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  emptyMessage: string;
  actionText: string;
  actionHref: string;
}

/**
 * Resource card summary props
 */
interface ResourceCardSummaryProps {
  label: string;
  value: number;
  valueColor?: string;
  formatter?: (value: number) => string;
}

/**
 * Resource card list props
 */
interface ResourceCardListProps {
  children: ReactNode;
}

/**
 * Resource card action props
 */
interface ResourceCardActionProps {
  href: string;
  icon: LucideIcon;
  children: ReactNode;
}

/**
 * Base ResourceCard component - container for all resource cards
 */
const ResourceCardBase = memo<ResourceCardProps>(function ResourceCard({
  children,
}) {
  return <Card>{children}</Card>;
});

/**
 * ResourceCard Header - standardized header with title, icon, and optional count badge
 */
const ResourceCardHeader = memo<ResourceCardHeaderProps>(
  function ResourceCardHeader({
    title,
    icon: Icon,
    iconColor,
    iconBgColor,
    count,
  }) {
    return (
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <div className="flex items-center gap-2">
          {count !== undefined && (
            <Badge variant="secondary" className="text-xs">
              {count}
            </Badge>
          )}
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBgColor}`}>
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </div>
        </div>
      </CardHeader>
    );
  },
);

/**
 * ResourceCard Empty State - standardized empty state with icon, message, and action
 */
const ResourceCardEmpty = memo<ResourceCardEmptyProps>(
  function ResourceCardEmpty({
    title,
    icon: Icon,
    iconColor,
    iconBgColor,
    emptyMessage,
    actionText,
    actionHref,
  }) {
    return (
      <>
        <ResourceCardHeader
          title={title}
          icon={Icon}
          iconColor={iconColor}
          iconBgColor={iconBgColor}
        />
        <CardContent>
          <div className="text-center py-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted/30 mb-3">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">{emptyMessage}</p>
            <Button asChild variant="outline" size="sm">
              <Link href={actionHref}>{actionText}</Link>
            </Button>
          </div>
        </CardContent>
      </>
    );
  },
);

/**
 * ResourceCard Summary - standardized summary section with label and formatted value
 */
const ResourceCardSummary = memo<ResourceCardSummaryProps>(
  function ResourceCardSummary({
    label,
    value,
    valueColor = "text-green-600 dark:text-green-400",
    formatter = formatCurrency,
  }) {
    return (
      <div className="p-3 rounded-lg bg-muted/30">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            {label}
          </span>
          <span className={`text-xl font-bold ${valueColor}`}>
            {formatter(value)}
          </span>
        </div>
      </div>
    );
  },
);

/**
 * ResourceCard List - container for list items
 */
const ResourceCardList = memo<ResourceCardListProps>(function ResourceCardList({
  children,
}) {
  return <div className="space-y-2 flex-1">{children}</div>;
});

/**
 * ResourceCard Action - standardized action button
 */
const ResourceCardAction = memo<ResourceCardActionProps>(
  function ResourceCardAction({ href, icon: Icon, children }) {
    return (
      <div className="mt-auto pt-4">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={href} className="flex items-center gap-2">
            <Icon className="h-3 w-3" />
            {children}
          </Link>
        </Button>
      </div>
    );
  },
);

/**
 * ResourceCard Content - main content container that handles flex layout
 */
const ResourceCardContent = memo<{ children: ReactNode }>(
  function ResourceCardContent({ children }) {
    return (
      <CardContent className="flex flex-col h-full space-y-4">
        {children}
      </CardContent>
    );
  },
);

// Compound component type
type ResourceCardComponent = typeof ResourceCardBase & {
  Header: typeof ResourceCardHeader;
  Empty: typeof ResourceCardEmpty;
  Content: typeof ResourceCardContent;
  Summary: typeof ResourceCardSummary;
  List: typeof ResourceCardList;
  Action: typeof ResourceCardAction;
};

// Compound component exports
const ResourceCard = ResourceCardBase as ResourceCardComponent;
ResourceCard.Header = ResourceCardHeader;
ResourceCard.Empty = ResourceCardEmpty;
ResourceCard.Content = ResourceCardContent;
ResourceCard.Summary = ResourceCardSummary;
ResourceCard.List = ResourceCardList;
ResourceCard.Action = ResourceCardAction;

export { ResourceCard };
export type {
  ResourceCardProps,
  ResourceCardHeaderProps,
  ResourceCardEmptyProps,
  ResourceCardSummaryProps,
  ResourceCardListProps,
  ResourceCardActionProps,
};