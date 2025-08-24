import { memo, useMemo } from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { DEFAULT_MODAL_CONFIG } from "./constants";
import { renderIcon } from "./utils";
import type { FormModalHeaderProps } from "./types";

/**
 * FormModal Header - standardized header with icon, title, and description
 * Optimized with memoized icon rendering and configuration defaults
 */
export const FormModalHeader = memo<FormModalHeaderProps>(function FormModalHeader({
  icon: Icon,
  iconColor = DEFAULT_MODAL_CONFIG.iconColor,
  iconBgColor = DEFAULT_MODAL_CONFIG.iconBgColor,
  title,
  description,
}) {
  // Memoized icon container styles to prevent recalculation
  const iconContainerClasses = useMemo(
    () => `mx-auto flex h-12 w-12 items-center justify-center rounded-full ${iconBgColor}`,
    [iconBgColor]
  );

  // Memoized icon classes
  const iconClasses = useMemo(
    () => `h-6 w-6 ${iconColor}`,
    [iconColor]
  );

  // Memoized icon component
  const iconComponent = useMemo(
    () => renderIcon(Icon, iconClasses),
    [Icon, iconClasses]
  );

  return (
    <DialogHeader className="text-center space-y-3 pb-4">
      <div className={iconContainerClasses}>
        {iconComponent}
      </div>
      <div className="space-y-1">
        <DialogTitle className="text-xl">{title}</DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          {description}
        </DialogDescription>
      </div>
    </DialogHeader>
  );
});