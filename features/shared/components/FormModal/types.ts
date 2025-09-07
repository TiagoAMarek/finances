import { ReactNode, ComponentProps } from "react";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { LucideIcon } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { MODAL_SIZE_CLASSES } from "./constants";

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
 * FormModal base props with enhanced typing and escape hatches
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
  /**
   * Whether to show confirmation dialog when closing with unsaved changes
   */
  confirmOnDirtyClose?: boolean;
  /**
   * Escape hatch: Additional props to pass to the underlying Dialog component
   * Allows customization of dialog behavior like onPointerDownOutside, onEscapeKeyDown, etc.
   */
  dialogProps?: Omit<ComponentProps<typeof DialogPrimitive.Root>, 'open' | 'onOpenChange' | 'children'>;
  /**
   * Escape hatch: Additional props to the DialogContent component
   * Allows customization of content behavior and styling
   */
  dialogContentProps?: Omit<ComponentProps<typeof DialogPrimitive.Content>, 'children'>;
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
export interface FormModalFormWithHookProps<T extends FieldValues = FieldValues> {
  /** React Hook Form instance */
  form: UseFormReturn<T>;
  /** Form submission handler with typed data */
  onSubmit: (data: T) => void;
  /** Form content and fields */
  children: ReactNode;
  /** Non-field error message (e.g., API errors) */
  nonFieldError?: string | ReactNode;
}

/**
 * Unified FormModal actions props supporting both traditional and hook form approaches
 */
export interface FormModalActionsProps<T extends FieldValues = FieldValues> {
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
  form?: UseFormReturn<T>;
}

/**
 * FormModal field props for react-hook-form integration
 */
export interface FormModalFieldProps<T extends FieldValues = FieldValues> {
  /** React Hook Form instance */
  form: UseFormReturn<T>;
  /** Field name with type safety */
  name: Path<T>;
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
export interface FormModalActionsWithFormProps<T extends FieldValues = FieldValues> {
  /** React Hook Form instance */
  form: UseFormReturn<T>;
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