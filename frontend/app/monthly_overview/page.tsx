"use client";

import { useState } from 'react';
import type { NextPage } from 'next';
import { Bar } from 'react-chartjs-2';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMonthlySummary } from '@/hooks/useReports';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const MonthlyOverviewPage: NextPage = () => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [month, setMonth] = useState<number>(currentMonth);
  const [year, setYear] = useState<number>(currentYear);

  const { data: summary, error, isLoading } = useMonthlySummary(month, year);


  const handleMonthChange = (value: string) => {
    setMonth(parseInt(value));
  };

  const handleYearChange = (value: string) => {
    setYear(parseInt(value));
  };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i); // Current year +/- 2

  const chartData = {
    labels: ['Receitas', 'Despesas', 'Saldo'],
    datasets: [
      {
        label: 'Valores (R$)',
        data: [summary?.total_income || 0, summary?.total_expense || 0, summary?.balance || 0],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // Receitas
          'rgba(255, 99, 132, 0.6)', // Despesas
          'rgba(54, 162, 235, 0.6)', // Saldo
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Resumo Financeiro Mensal',
      },
    },
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Visão Geral Mensal</h1>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Selecionar Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="space-y-2">
              <Label htmlFor="month">Mês</Label>
              <Select value={month.toString()} onValueChange={handleMonthChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m} value={m.toString()}>
                      {new Date(currentYear, m - 1, 1).toLocaleString('pt-BR', { month: 'long' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Ano</Label>
              <Select value={year.toString()} onValueChange={handleYearChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Carregando resumo...</div>
        </div>
      ) : summary ? (
        <Card>
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-4">
                  <p className="text-lg font-medium text-muted-foreground">Receitas Totais:</p>
                  <p className="text-2xl font-bold text-blue-600">R$ {summary.total_income.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-lg font-medium text-muted-foreground">Despesas Totais:</p>
                  <p className="text-2xl font-bold text-red-600">R$ {summary.total_expense.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-lg font-medium text-muted-foreground">Saldo:</p>
                  <p className="text-2xl font-bold text-green-600">R$ {summary.balance.toFixed(2)}</p>
                </CardContent>
              </Card>
            </div>
            <div>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      ) : (
        <p className="text-muted-foreground">Nenhum resumo disponível para o período selecionado.</p>
      )}
    </div>
  );
};

export default MonthlyOverviewPage;
