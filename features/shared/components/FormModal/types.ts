import { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";
import { LucideIcon } from "lucide-react";
import { MODAL_SIZE_CLASSES } from "./constants";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/** Modal size types */
export type ModalSize = keyof typeof MODAL_SIZE_CLASSES;

/** Modal variant types */
export type ModalVariant = "create" | "edit";

/** Enhanced form field validation state */
export type FieldValidationState = {
  error?: string;
  isValid: boolean;
  isTouched: boolean;
};

/**
 * FormModal base props with enhanced typing
 */
export interface FormModalProps {
  /** Controls whether the modal is open */
  open: boolean;
  /** Callback when modal open state changes */
  onOpenChange: (open: boolean) => void;
  /** Modal variant - affects layout and behavior */
  variant?: ModalVariant;
  /** Modal size - affects width and spacing */
  size?: ModalSize;
  /** Optional trigger element for create modals */
  trigger?: ReactNode;
  /** Modal content */
  children: ReactNode;
}

/**
 * FormModal header props with enhanced documentation
 */
export interface FormModalHeaderProps {
  /** Icon component to display in header */
  icon: LucideIcon;
  /** Icon color class (default: text-primary) */
  iconColor?: string;
  /** Icon background color class (default: bg-primary/10) */
  iconBgColor?: string;
  /** Header title text */
  title: string;
  /** Header description text */
  description: string;
}

/**
 * FormModal preview props - shows current data for edit modals
 */
export interface FormModalPreviewProps {
  /** Content to display in the preview section */
  children: ReactNode;
}

/**
 * FormModal form props - traditional form submission
 */
export interface FormModalFormProps {
  /** Form submission handler */
  onSubmit: (e: React.FormEvent) => void;
  /** Form content and fields */
  children: ReactNode;
}

/**
 * Enhanced FormModal form props with react-hook-form integration
 */
export interface FormModalFormWithHookProps {
  /** React Hook Form instance */
  form: UseFormReturn<any>;
  /** Form submission handler with typed data */
  onSubmit: (data: any) => void;
  /** Form content and fields */
  children: ReactNode;
}

/**
 * Unified FormModal actions props supporting both traditional and hook form approaches
 */
export interface FormModalActionsProps {
  /** Cancel button handler */
  onCancel: () => void;
  /** Cancel button text (default: "Cancelar") */
  cancelText?: string;
  /** Submit button text */
  submitText: string;
  /** Optional icon for submit button */
  submitIcon?: LucideIcon;
  /** Loading state for async operations */
  isLoading: boolean;
  /** Manual disable override (for traditional forms) */
  isDisabled?: boolean;
  /** Optional form instance for automatic validation */
  form?: UseFormReturn<any>;
}

/**
 * FormModal field props for react-hook-form integration
 */
export interface FormModalFieldProps {
  /** React Hook Form instance */
  form: UseFormReturn<any>;
  /** Field name with type safety */
  name: string;
  /** Field label text */
  label: string;
  /** Optional field description */
  description?: string;
  /** Whether field is required */
  required?: boolean;
  /** Field input component */
  children: ReactNode;
}

/**
 * @deprecated Legacy FormModal actions props - kept for backward compatibility
 * Use FormModalActionsProps with form prop instead
 */
export interface FormModalActionsWithFormProps {
  /** React Hook Form instance */
  form: UseFormReturn<any>;
  /** Cancel button handler */
  onCancel: () => void;
  /** Cancel button text (default: "Cancelar") */
  cancelText?: string;
  /** Submit button text */
  submitText: string;
  /** Optional icon for submit button */
  submitIcon?: LucideIcon;
  /** Loading state for async operations */
  isLoading: boolean;
}