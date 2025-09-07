import { FieldValues } from "react-hook-form";
import { Card, CardContent } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertTriangleIcon } from "lucide-react";
import type { FormModalFormWithHookProps } from "./types";

/**
 * Enhanced FormModal Form with react-hook-form integration
 */
export function FormModalFormWithHook<T extends FieldValues = FieldValues>({
  form,
  onSubmit,
  children,
  nonFieldError,
}: FormModalFormWithHookProps<T>) {
  return (
    <Card className="border-dashed">
      <CardContent className="pt-6">
        {nonFieldError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertDescription>{nonFieldError}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" role="form">
          {children}
        </form>
      </CardContent>
    </Card>
  );
}

