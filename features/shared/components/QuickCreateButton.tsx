import { Plus } from "lucide-react";

import { Button } from "@/features/shared/components/ui";

interface QuickCreateButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function QuickCreateButton({
  children,
  onClick,
  className,
}: QuickCreateButtonProps) {
  return (
    <Button className={className} size="sm" onClick={onClick}>
      <Plus className="h-4 w-4" />
      <span className="hidden sm:inline">{children}</span>
    </Button>
  );
}
