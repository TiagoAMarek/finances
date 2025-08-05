"use client";

import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { fetchWithAuth } from '@/utils/api';
import { Bar } from 'react-chartjs-2';
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

interface MonthlySummary {
  month: number;
  year: number;
  total_income: number;
  total_expense: number;
  balance: number;
}

const MonthlyOverviewPage: NextPage = () => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [month, setMonth] = useState<number>(currentMonth);
  const [year, setYear] = useState<number>(currentYear);
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchMonthlySummary = async () => {
      setError(null);
      setLoading(true);
      try {
        const response = await fetchWithAuth(`http://localhost:8000/monthly_summary?month=${month}&year=${year}`);
        if (response.ok) {
          const data: MonthlySummary = await response.json();
          setSummary(data);
        } else {
          const data = await response.json();
          setError(data.detail || 'Erro ao carregar resumo mensal.');
          setSummary(null);
        }
      } catch (err: unknown) {
        setError((err as Error).message || 'Erro de conexão com o servidor.');
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMonthlySummary();
  }, [month, year]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(parseInt(e.target.value));
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
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Visão Geral Mensal</h1>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      <div className="mb-8 rounded-md bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">Selecionar Período</h2>
        <div className="flex space-x-4">
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-600">Mês</label>
            <select
              id="month"
              className="mt-1 rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring"
              value={month}
              onChange={handleMonthChange}
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {new Date(currentYear, m - 1, 1).toLocaleString('pt-BR', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-600">Ano</label>
            <select
              id="year"
              className="mt-1 rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring"
              value={year}
              onChange={handleYearChange}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">Carregando resumo...</div>
      ) : summary ? (
        <div className="rounded-md bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">Resumo Financeiro</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-md bg-blue-50 p-4">
              <p className="text-lg font-medium text-gray-700">Receitas Totais:</p>
              <p className="text-2xl font-bold text-blue-600">R$ {summary.total_income.toFixed(2)}</p>
            </div>
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-lg font-medium text-gray-700">Despesas Totais:</p>
              <p className="text-2xl font-bold text-red-600">R$ {summary.total_expense.toFixed(2)}</p>
            </div>
            <div className="rounded-md bg-green-50 p-4">
              <p className="text-lg font-medium text-gray-700">Saldo:</p>
              <p className="text-2xl font-bold text-green-600">R$ {summary.balance.toFixed(2)}</p>
            </div>
          </div>
          <div className="mt-8">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Nenhum resumo disponível para o período selecionado.</p>
      )}
    </div>
  );
};

export default MonthlyOverviewPage;
