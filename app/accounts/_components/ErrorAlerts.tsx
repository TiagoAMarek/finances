import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorAlertsProps {
  errors: {
    create?: Error | null;
    update?: Error | null;
    delete?: Error | null;
    general?: Error | null;
  };
}

export function ErrorAlerts({ errors }: ErrorAlertsProps) {
  const errorList = Object.entries(errors).filter(([, error]) => error !== null && error !== undefined);

  if (errorList.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {errorList.map(([type, error]) => (
        <Alert key={type} variant="destructive">
          <AlertDescription>{error?.message}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}