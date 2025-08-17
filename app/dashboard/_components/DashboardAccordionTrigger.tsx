import { memo, ReactNode } from "react";
import { AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

/**
 * Badge configuration for accordion headers
 */
interface BadgeConfig {
  label: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
  hideOnMobile?: boolean;
  icon?: LucideIcon;
}

/**
 * Props for DashboardAccordionTrigger component
 */
interface DashboardAccordionTriggerProps {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  badges?: BadgeConfig[];
  actionButton?: ReactNode;
  children?: ReactNode;
}

/**
 * Reusable accordion trigger component for dashboard
 *
 * Features:
 * - Eliminates code duplication between accordion headers
 * - Consistent styling and behavior
 * - Flexible badge system
 * - Optional action button support
 * - Responsive design with mobile optimizations
 * - Optimized with React.memo
 */
export const DashboardAccordionTrigger = memo<DashboardAccordionTriggerProps>(
  function DashboardAccordionTrigger({
    title,
    icon: Icon,
    iconColor = "text-blue-500",
    badges = [],
    actionButton,
    children,
  }) {
    return (
      <AccordionTrigger className="text-lg font-semibold hover:no-underline hover:bg-muted/50 rounded-lg transition-colors p-4">
        <div className="flex items-center justify-between w-full mr-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Icon className={`h-5 w-5 ${iconColor}`} />
              <span>{title}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {badges.map((badge, index) => {
              const IconComponent = badge.icon;
              return (
                <Badge
                  key={index}
                  variant={badge.variant || "secondary"}
                  className={`text-xs ${badge.hideOnMobile ? "hidden sm:inline-flex" : ""} ${badge.className || ""}`}
                >
                  {IconComponent && <IconComponent className="h-3 w-3 mr-1" />}
                  {badge.label}
                </Badge>
              );
            })}
            {actionButton && (
              <div onClick={(e) => e.stopPropagation()}>{actionButton}</div>
            )}
            {children}
          </div>
        </div>
      </AccordionTrigger>
    );
  },
);
