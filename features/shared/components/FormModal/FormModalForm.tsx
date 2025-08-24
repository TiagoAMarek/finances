import { memo } from "react";
import { Card, CardContent } from "../ui/card";
import type { FormModalFormProps } from "./types";

/**
 * FormModal Form - form container with consistent styling
 */
export const FormModalForm = memo<FormModalFormProps>(function FormModalForm({
  onSubmit,
  children,
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="pt-6">
        <form onSubmit={onSubmit} className="space-y-6">
          {children}
        </form>
      </CardContent>
    </Card>
  );
});