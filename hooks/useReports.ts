import { useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '@/utils/api';

interface MonthlySummary {
  month: number;
  year: number;
  total_income: number;
  total_expense: number;
  balance: number;
}

// Fetch Monthly Summary
export const useMonthlySummary = (month: number, year: number) => {
  return useQuery<MonthlySummary>({
    queryKey: ['monthlySummary', month, year],
    queryFn: async () => {
      const response = await fetchWithAuth(`http://localhost:8000/monthly_summary?month=${month}&year=${year}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao carregar resumo mensal.');
      }
      return response.json();
    },
  });
};