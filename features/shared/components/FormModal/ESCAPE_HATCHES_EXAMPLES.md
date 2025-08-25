// Example: Using FormModal escape hatches for custom dialog behavior

import { FormModal } from "@/features/shared/components/FormModal";

// Example 1: Prevent closing on outside click and customize escape key behavior
function ConfirmationModal() {
  const [open, setOpen] = useState(false);
  
  const handleEscapeKey = (event: KeyboardEvent) => {
    // Show confirmation before closing
    if (hasUnsavedChanges) {
      event.preventDefault();
      showConfirmationDialog();
    }
  };

  const handlePointerDownOutside = (event: PointerEvent) => {
    // Prevent closing when clicking outside
    event.preventDefault();
  };

  return (
    <FormModal
      open={open}
      onOpenChange={setOpen}
      size="lg"
      dialogProps={{
        onEscapeKeyDown: handleEscapeKey,
        onPointerDownOutside: handlePointerDownOutside,
      }}
      dialogContentProps={{
        // Custom content styling or behavior
        onInteractOutside: (event) => event.preventDefault(),
      }}
    >
      {/* Modal content */}
    </FormModal>
  );
}

// Example 2: Modal with custom modal behavior for data loss prevention
function EditFormModal() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  return (
    <FormModal
      open={open}
      onOpenChange={setOpen}
      dialogProps={{
        // Prevent all outside interactions when there are unsaved changes
        onPointerDownOutside: hasUnsavedChanges 
          ? (event) => event.preventDefault()
          : undefined,
        onEscapeKeyDown: hasUnsavedChanges
          ? (event) => {
              event.preventDefault();
              showUnsavedChangesWarning();
            }
          : undefined,
        // Allow focus to move outside the modal in certain cases
        onOpenAutoFocus: (event) => {
          if (shouldPreventAutoFocus) {
            event.preventDefault();
          }
        },
      }}
    >
      {/* Form content */}
    </FormModal>
  );
}

// Example 3: Accessible modal with custom ARIA attributes
function AccessibleFormModal() {
  return (
    <FormModal
      open={open}
      onOpenChange={setOpen}
      dialogContentProps={{
        // Custom accessibility attributes
        "aria-labelledby": "custom-title-id",
        "aria-describedby": "custom-description-id",
        // Custom styling
        className: "custom-modal-styles",
      }}
    >
      {/* Content with custom IDs for accessibility */}
    </FormModal>
  );
}