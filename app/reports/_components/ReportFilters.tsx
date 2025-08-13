import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { Calendar, Filter, RotateCcw, Clock, TrendingUp } from "lucide-react";
import { BankAccount, CreditCard } from "@/lib/schemas";

interface ReportFiltersProps {
  accounts: BankAccount[];
  creditCards: CreditCard[];
  selectedMonth: number;
  selectedYear: number;
  selectedAccountId: number | null;
  selectedCreditCardId: number | null;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onAccountChange: (accountId: number | null) => void;
  onCreditCardChange: (creditCardId: number | null) => void;
  onReset: () => void;
}

export function ReportFilters({
  accounts,
  creditCards,
  selectedMonth,
  selectedYear,
  selectedAccountId,
  selectedCreditCardId,
  onMonthChange,
  onYearChange,
  onAccountChange,
  onCreditCardChange,
  onReset,
}: ReportFiltersProps) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  
  const months = [
    { value: 0, label: 'Janeiro' },
    { value: 1, label: 'Fevereiro' },
    { value: 2, label: 'Março' },
    { value: 3, label: 'Abril' },
    { value: 4, label: 'Maio' },
    { value: 5, label: 'Junho' },
    { value: 6, label: 'Julho' },
    { value: 7, label: 'Agosto' },
    { value: 8, label: 'Setembro' },
    { value: 9, label: 'Outubro' },
    { value: 10, label: 'Novembro' },
    { value: 11, label: 'Dezembro' },
  ];

  const hasActiveFilters = selectedAccountId !== null || selectedCreditCardId !== null || 
    selectedMonth !== currentMonth || selectedYear !== currentYear;

  // Função para definir período rápido
  const handleQuickPeriod = (period: string) => {
    const now = new Date();
    switch (period) {
      case 'current':
        onMonthChange(now.getMonth());
        onYearChange(now.getFullYear());
        break;
      case 'previous':
        const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        onMonthChange(prevMonth);
        onYearChange(prevYear);
        break;
      case 'last3':
        const last3Month = now.getMonth() - 2 < 0 ? 12 + (now.getMonth() - 2) : now.getMonth() - 2;
        const last3Year = now.getMonth() - 2 < 0 ? now.getFullYear() - 1 : now.getFullYear();
        onMonthChange(last3Month);
        onYearChange(last3Year);
        break;
      case 'last6':
        const last6Month = now.getMonth() - 5 < 0 ? 12 + (now.getMonth() - 5) : now.getMonth() - 5;
        const last6Year = now.getMonth() - 5 < 0 ? now.getFullYear() - 1 : now.getFullYear();
        onMonthChange(last6Month);
        onYearChange(last6Year);
        break;
    }
  };

  // Determinar período ativo
  const getActivePeriod = () => {
    if (selectedMonth === currentMonth && selectedYear === currentYear) return 'current';
    
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    if (selectedMonth === prevMonth && selectedYear === prevYear) return 'previous';
    
    return '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtros dos Relatórios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Períodos Rápidos */}
        <div className="space-y-4">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Períodos Rápidos
          </Label>
          <ToggleGroup 
            type="single" 
            value={getActivePeriod()} 
            onValueChange={handleQuickPeriod}
            className="justify-start"
          >
            <ToggleGroupItem value="current" aria-label="Mês atual">
              Mês Atual
            </ToggleGroupItem>
            <ToggleGroupItem value="previous" aria-label="Mês anterior">
              Mês Anterior
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <Separator />

        {/* Filtros de Data Detalhados */}
        <div className="space-y-4">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Período Personalizado
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month" className="text-xs text-muted-foreground">Mês</Label>
              <Select 
                value={selectedMonth.toString()} 
                onValueChange={(value) => onMonthChange(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year" className="text-xs text-muted-foreground">Ano</Label>
              <Select 
                value={selectedYear.toString()} 
                onValueChange={(value) => onYearChange(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Filtros de Conta/Cartão */}
        <div className="space-y-4">
          <Label className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Filtrar por Origem
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="account" className="text-xs text-muted-foreground">Conta Bancária</Label>
              <Select 
                value={selectedAccountId?.toString() || "all"} 
                onValueChange={(value) => onAccountChange(value === "all" ? null : parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as contas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as contas</SelectItem>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="creditCard" className="text-xs text-muted-foreground">Cartão de Crédito</Label>
              <Select 
                value={selectedCreditCardId?.toString() || "all"} 
                onValueChange={(value) => onCreditCardChange(value === "all" ? null : parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os cartões" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os cartões</SelectItem>
                  {creditCards.map((card) => (
                    <SelectItem key={card.id} value={card.id.toString()}>
                      {card.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Botão de Reset */}
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onReset}
            className="w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Limpar Filtros
          </Button>
        )}
      </CardContent>
    </Card>
  );
}