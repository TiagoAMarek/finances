"use client";

import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardPage: NextPage = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col items-center justify-center space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Bem-vindo ao Dashboard!</h1>
        <p className="text-muted-foreground">Esta é a sua página principal.</p>
      </div>
      
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-center">Gerenciamento Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/accounts" passHref>
              <Button className="w-full h-16 text-lg" variant="default">
                💳 Gerenciar Contas
              </Button>
            </Link>
            <Link href="/credit_cards" passHref>
              <Button className="w-full h-16 text-lg" variant="secondary">
                💸 Gerenciar Cartões
              </Button>
            </Link>
            <Link href="/transactions" passHref>
              <Button className="w-full h-16 text-lg" variant="outline">
                📊 Gerenciar Transações
              </Button>
            </Link>
            <Link href="/monthly_overview" passHref>
              <Button className="w-full h-16 text-lg" variant="outline">
                📈 Visão Geral Mensal
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <Button
        onClick={handleLogout}
        variant="destructive"
        size="lg"
      >
        Sair (Logout)
      </Button>
    </div>
  );
};

export default DashboardPage;
