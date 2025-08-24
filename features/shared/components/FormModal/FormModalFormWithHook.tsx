import { Card, CardContent } from "../ui/card";
import type { FormModalFormWithHookProps } from "./types";

/**
 * Enhanced FormModal Form with react-hook-form integration
 */
export function FormModalFormWithHook({
  form,
  onSubmit,
  children,
}: FormModalFormWithHookProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="pt-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {children}
        </form>
      </CardContent>
    </Card>
  );
}