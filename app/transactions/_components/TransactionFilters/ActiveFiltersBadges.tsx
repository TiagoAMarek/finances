import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { BadgeMeta } from "./types";

interface ActiveFiltersBadgesProps {
  badges: BadgeMeta[];
  onRemove: (key: BadgeMeta["key"]) => void;
}

export function ActiveFiltersBadges({
  badges,
  onRemove,
}: ActiveFiltersBadgesProps) {
  return (
    <div
      className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg"
      data-testid="active-filters"
      aria-label="Filtros Ativos"
    >
      <span className="text-xs font-medium text-muted-foreground">
        Filtros ativos:
      </span>
      {badges.map((badge) => {
        const IconComponent = badge.icon as React.ComponentType<{
          className?: string;
        }>;
        return (
          <Badge
            key={badge.key}
            variant="secondary"
            className="flex items-center gap-1.5 pr-1 text-xs hover:bg-secondary/80 transition-colors"
          >
            <IconComponent className={`h-3 w-3 ${badge.color}`} />
            <span className="max-w-24 truncate">{badge.label}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(badge.key)}
              className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground rounded-full ml-1"
              aria-label={`Remover filtro ${badge.label}`}
            >
              <XIcon className="h-2.5 w-2.5" />
            </Button>
          </Badge>
        );
      })}
    </div>
  );
}
