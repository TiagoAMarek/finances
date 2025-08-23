import { Button } from "@/features/shared/components/ui";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/features/shared/components/ui/dialog";
import { LucideIcon, Loader2Icon } from "lucide-react";
import { memo, ReactNode } from "react";

/**
 * FormModal base props
 */
interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: "create" | "edit";
  size?: "sm" | "md" | "lg";
  trigger?: ReactNode;
  children: ReactNode;
}

/**
 * FormModal header props
 */
interface FormModalHeaderProps {
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  title: string;
  description: string;
}

/**
 * FormModal preview props
 */
interface FormModalPreviewProps {
  children: ReactNode;
}

/**
 * FormModal form props
 */
interface FormModalFormProps {
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
}

/**
 * FormModal actions props
 */
interface FormModalActionsProps {
  onCancel: () => void;
  cancelText?: string;
  submitText: string;
  submitIcon?: LucideIcon;
  isLoading: boolean;
  isDisabled?: boolean;
}

/**
 * Base FormModal component - container for all form modals
 */
const FormModalBase = memo<FormModalProps>(function FormModal({
  open,
  onOpenChange,
  variant = "create",
  size = "md",
  trigger,
  children,
}) {
  const sizeClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
  };

  const dialogContent = (
    <DialogContent className={`${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}>
      {children}
    </DialogContent>
  );

  if (variant === "create" && trigger) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {dialogContent}
    </Dialog>
  );
});

/**
 * FormModal Header - standardized header with icon, title, and description
 */
const FormModalHeader = memo<FormModalHeaderProps>(function FormModalHeader({
  icon: Icon,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10",
  title,
  description,
}) {
  return (
    <DialogHeader className="text-center space-y-3 pb-4">
      <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${iconBgColor}`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <div className="space-y-1">
        <DialogTitle className="text-xl">{title}</DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          {description}
        </DialogDescription>
      </div>
    </DialogHeader>
  );
});

/**
 * FormModal Preview - preview section for edit modals
 */
const FormModalPreview = memo<FormModalPreviewProps>(function FormModalPreview({
  children,
}) {
  return (
    <div className="bg-muted/30 rounded-lg p-4 border border-dashed mb-4">
      {children}
    </div>
  );
});

/**
 * FormModal Form - form container with consistent styling
 */
const FormModalForm = memo<FormModalFormProps>(function FormModalForm({
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

/**
 * FormModal Actions - standardized action buttons
 */
const FormModalActions = memo<FormModalActionsProps>(function FormModalActions({
  onCancel,
  cancelText = "Cancelar",
  submitText,
  submitIcon,
  isLoading,
  isDisabled = false,
}) {
  return (
    <div className="flex gap-3 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="flex-1"
        disabled={isLoading}
      >
        {cancelText}
      </Button>
      <Button
        type="submit"
        disabled={isLoading || isDisabled}
        className="flex-1"
      >
        {isLoading ? (
          <>
            <Loader2Icon className="h-4 w-4 animate-spin" />
            {submitText.includes("Criando") ? "Criando..." : 
             submitText.includes("Salvando") ? "Salvando..." : "Processando..."}
          </>
        ) : (
          <>
            {submitIcon && (() => {
              const IconComponent = submitIcon;
              return <IconComponent className="h-4 w-4" />;
            })()}
            {submitText}
          </>
        )}
      </Button>
    </div>
  );
});

// Compound component type
type FormModalComponent = typeof FormModalBase & {
  Header: typeof FormModalHeader;
  Preview: typeof FormModalPreview;
  Form: typeof FormModalForm;
  Actions: typeof FormModalActions;
};

// Compound component exports
const FormModal = FormModalBase as FormModalComponent;
FormModal.Header = FormModalHeader;
FormModal.Preview = FormModalPreview;
FormModal.Form = FormModalForm;
FormModal.Actions = FormModalActions;

export { FormModal };
export type {
  FormModalProps,
  FormModalHeaderProps,
  FormModalPreviewProps,
  FormModalFormProps,
  FormModalActionsProps,
};