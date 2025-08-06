"use client";

import type { NextPage } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAccounts } from '@/hooks/useAccounts';
import { useTransactions } from '@/hooks/useTransactions';
import { 
  DollarSign,
  TrendingUp, 
  TrendingDown, 
  BarChart3
} from 'lucide-react';

const DashboardPage: NextPage = () => {
  const { data: accounts = [] } = useAccounts();
  const { data: transactions = [] } = useTransactions();

  // Calcular receitas e despesas do mês atual
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
  });

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyBalance = monthlyIncome - monthlyExpenses;

  // Calcular saldo total de todas as contas
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  // Gerar dados dos últimos 6 meses para o gráfico
  const generateLast6MonthsData = () => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleDateString('pt-BR', { month: 'short' });
      
      // Simular variação do saldo (em produção, isso viria dos dados reais)
      const variation = Math.random() * 10000 - 5000;
      const balance = totalBalance + variation;
      
      data.push({
        month,
        balance: Math.max(0, balance)
      });
    }
    return data;
  };

  const chartData = generateLast6MonthsData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Financeiro</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Receitas do Mês */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receitas do Mês
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(monthlyIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de receitas em {new Date().toLocaleDateString('pt-BR', { month: 'long' })}
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Despesas do Mês */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Despesas do Mês
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(monthlyExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de despesas em {new Date().toLocaleDateString('pt-BR', { month: 'long' })}
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Balanço Mensal */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Balanço Mensal
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${monthlyBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(monthlyBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              {monthlyBalance >= 0 ? 'Superávit' : 'Déficit'} no mês atual
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Saldo Total com Gráfico */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Saldo Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalBalance)}
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Soma de todas as contas
            </p>
            <div className="h-20 flex items-end justify-between">
              {chartData.map((data) => (
                <div 
                  key={data.month}
                  className="flex flex-col items-center gap-1"
                >
                  <div 
                    className="w-2 bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600"
                    style={{
                      height: `${Math.max(10, (data.balance / Math.max(...chartData.map(d => d.balance))) * 60)}px`
                    }}
                  />
                  <span className="text-[8px] text-muted-foreground">{data.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
