import { Badge } from "@/components/ui/badge";
import React from "react";

type ListHeaderProps = {
  title: string;
  count?: number;
  right?: React.ReactNode;
};

export function ListHeader({ title, count, right }: ListHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
        {typeof count === "number" ? (
          <Badge variant="secondary" aria-label={`${count} categorias`}>
            {count}
          </Badge>
        ) : null}
      </div>
      {right ? <div className="flex items-center gap-2">{right}</div> : null}
    </div>
  );
}
