import { memo } from "react";
import type { FormModalPreviewProps } from "./types";

/**
 * FormModal Preview - preview section for edit modals
 */
export const FormModalPreview = memo<FormModalPreviewProps>(
  function FormModalPreview({ children }) {
    return (
      <div className="bg-muted/30 rounded-lg p-4 border border-dashed mb-4">
        {children}
      </div>
    );
  },
);

