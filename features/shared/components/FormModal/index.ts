// ============================================================================
// FORMMODAL - SIMPLIFIED COMPONENT EXPORTS
// ============================================================================

// Individual component exports - no compound pattern
export { FormModalBase as FormModal } from "./FormModalBase";
export { FormModalHeader } from "./FormModalHeader";
export { FormModalPreview } from "./FormModalPreview";
export { FormModalForm } from "./FormModalForm";
export { FormModalFormWithHook } from "./FormModalFormWithHook";
export { FormModalActions } from "./FormModalActions";
export { FormModalField } from "./FormModalField";

// Re-export types for convenience
export type {
  // Core component types
  FormModalProps,
  FormModalHeaderProps,
  FormModalPreviewProps,
  FormModalFormProps,
  FormModalFormWithHookProps,
  FormModalActionsProps,
  FormModalFieldProps,

  // Utility types
  ModalSize,
  ModalVariant,
  FieldValidationState,
} from "./types";

// Re-export utilities for advanced usage
export { getLoadingText, renderIcon, isFormValid } from "./utils";
export {
  MODAL_SIZE_CLASSES,
  LOADING_TEXT_MAP,
  DEFAULT_MODAL_CONFIG,
} from "./constants";