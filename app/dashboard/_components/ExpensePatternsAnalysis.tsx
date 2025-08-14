interface SpendingMetrics {
  daysWithSpending: number;
  dailyMedian: number;
  maxDailySpending: number;
  avgTransactionSize: number;
  weekdayTotal: number;
  weekdayAvg: number;
  weekendTotal: number;
  weekendAvg: number;
  dailyAverage: number;
}

interface ExpensePatternsAnalysisProps {
  metrics: SpendingMetrics;
  changePercentage: number;
  formatCurrency: (value: number) => string;
}

export function ExpensePatternsAnalysis({ 
  metrics, 
  changePercentage, 
  formatCurrency 
}: ExpensePatternsAnalysisProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium">Estatísticas Gerais</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Dias com gastos</span>
              <span className="font-medium">{metrics.daysWithSpending}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Gasto mediano/dia</span>
              <span className="font-medium">{formatCurrency(metrics.dailyMedian)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Maior gasto/dia</span>
              <span className="font-medium">{formatCurrency(metrics.maxDailySpending)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Ticket médio</span>
              <span className="font-medium">{formatCurrency(metrics.avgTransactionSize)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Semana vs Fim de Semana</h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Dias úteis</span>
                <span className="font-medium">{formatCurrency(metrics.weekdayTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Média por transação</span>
                <span className="font-medium">{formatCurrency(metrics.weekdayAvg)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Fins de semana</span>
                <span className="font-medium">{formatCurrency(metrics.weekendTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Média por transação</span>
                <span className="font-medium">{formatCurrency(metrics.weekendAvg)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights automáticos simplificados */}
      {(metrics.dailyAverage > metrics.dailyMedian * 1.5 || 
        metrics.weekendTotal > metrics.weekdayTotal * 1.2 || 
        changePercentage > 20) && (
        <div className="space-y-2 pt-4 border-t">
          <h4 className="font-medium text-sm">Insights</h4>
          <div className="space-y-2">
            {metrics.dailyAverage > metrics.dailyMedian * 1.5 && (
              <div className="text-sm text-muted-foreground">
                • Gastos concentrados em poucos dias
              </div>
            )}
            {metrics.weekendTotal > metrics.weekdayTotal * 1.2 && (
              <div className="text-sm text-muted-foreground">
                • Gastos {((metrics.weekendTotal / metrics.weekdayTotal - 1) * 100).toFixed(0)}% maiores nos fins de semana
              </div>
            )}
            {changePercentage > 20 && (
              <div className="text-sm text-muted-foreground">
                • Aumento de {changePercentage.toFixed(0)}% comparado ao período anterior
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}