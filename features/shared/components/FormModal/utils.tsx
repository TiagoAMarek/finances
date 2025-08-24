import { UseFormReturn, FieldValues } from "react-hook-form";
import { LucideIcon } from "lucide-react";
import { LOADING_TEXT_MAP } from "./constants";

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Determines loading text based on submit text content
 * @param submitText - The submit button text
 * @returns Appropriate loading text
 */
export const getLoadingText = (submitText: string): string => {
  const key = Object.keys(LOADING_TEXT_MAP).find(k => 
    k !== "default" && submitText.includes(k)
  ) as keyof typeof LOADING_TEXT_MAP;
  
  return LOADING_TEXT_MAP[key] || LOADING_TEXT_MAP.default;
};

/**
 * Renders an icon component with memoization
 * @param IconComponent - The icon component to render
 * @param className - CSS classes for the icon
 */
export const renderIcon = (IconComponent: LucideIcon, className: string) => {
  return <IconComponent className={className} />;
};

/**
 * Checks if a form is valid based on form state
 * @param formState - React Hook Form's form state
 * @returns Whether the form is valid
 */
export const isFormValid = <T extends FieldValues>(formState: UseFormReturn<T>['formState']): boolean => {
  return formState.isValid && !Object.keys(formState.errors).length;
};