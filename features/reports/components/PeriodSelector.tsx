import { CalendarDays, ChevronDown } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/features/shared/components/ui/select";

interface PeriodSelectorProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export function PeriodSelector({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
}: PeriodSelectorProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const months = [
    { value: 0, label: "Jan", fullLabel: "Janeiro" },
    { value: 1, label: "Fev", fullLabel: "Fevereiro" },
    { value: 2, label: "Mar", fullLabel: "Março" },
    { value: 3, label: "Abr", fullLabel: "Abril" },
    { value: 4, label: "Mai", fullLabel: "Maio" },
    { value: 5, label: "Jun", fullLabel: "Junho" },
    { value: 6, label: "Jul", fullLabel: "Julho" },
    { value: 7, label: "Ago", fullLabel: "Agosto" },
    { value: 8, label: "Set", fullLabel: "Setembro" },
    { value: 9, label: "Out", fullLabel: "Outubro" },
    { value: 10, label: "Nov", fullLabel: "Novembro" },
    { value: 11, label: "Dez", fullLabel: "Dezembro" },
  ];

  const selectedMonthLabel =
    months.find((m) => m.value === selectedMonth)?.label || "";

  return (
    <div className="flex items-center gap-2 bg-background border rounded-lg px-3 py-2 min-w-[140px] sm:min-w-[160px]">
      <CalendarDays className="h-4 w-4 text-muted-foreground flex-shrink-0" />

      {/* Período Display/Selector */}
      <Select
        value={`${selectedMonth}-${selectedYear}`}
        onValueChange={(value) => {
          const [month, year] = value.split("-").map(Number);
          onMonthChange(month);
          onYearChange(year);
        }}
      >
        <SelectTrigger className="border-0 shadow-none p-1 h-auto font-medium hover:bg-muted/50 rounded-md [&>svg]:hidden flex-1">
          <div className="flex items-center gap-1 w-full">
            <span className="text-sm sm:text-base whitespace-nowrap">
              {selectedMonthLabel} {selectedYear}
            </span>
            <ChevronDown className="h-3 w-3 opacity-50 flex-shrink-0" />
          </div>
        </SelectTrigger>

        <SelectContent align="start" className="min-w-[200px]">
          {years.map((year) => (
            <div key={year}>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b">
                {year}
              </div>
              {months.map((month) => (
                <SelectItem
                  key={`${month.value}-${year}`}
                  className="pl-4"
                  value={`${month.value}-${year}`}
                >
                  {month.fullLabel}
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
