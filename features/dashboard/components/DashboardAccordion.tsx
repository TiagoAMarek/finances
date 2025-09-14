import { LucideIcon } from "lucide-react";
import { memo, ReactNode } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/features/shared/components/ui/accordion";

import { DashboardAccordionTrigger } from "./DashboardAccordionTrigger";

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
 * Props for DashboardAccordion component
 */
interface DashboardAccordionProps {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  badges?: BadgeConfig[];
  actionButton?: ReactNode;
  defaultValue?: string;
  children: ReactNode;
}

/**
 * Reusable dashboard accordion wrapper component
 *
 * Features:
 * - Eliminates code duplication between dashboard accordions
 * - Consistent accordion structure and behavior
 * - Encapsulates Accordion → AccordionItem → DashboardAccordionTrigger pattern
 * - Flexible content composition via children
 * - Configurable title, icon, badges, and action buttons
 * - Memoized for performance optimization
 */
export const DashboardAccordion = memo<DashboardAccordionProps>(
  function DashboardAccordion({
    title,
    icon,
    iconColor,
    badges,
    actionButton,
    defaultValue = title.toLowerCase(),
    children,
  }) {
    return (
      <Accordion
        className="w-full"
        collapsible
        defaultValue={defaultValue}
        type="single"
      >
        <AccordionItem value={defaultValue}>
          <DashboardAccordionTrigger
            actionButton={actionButton}
            badges={badges}
            icon={icon}
            iconColor={iconColor}
            title={title}
          />
          <AccordionContent>{children}</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  },
);

export type { BadgeConfig };