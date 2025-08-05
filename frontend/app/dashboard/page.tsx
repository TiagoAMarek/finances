"use client";

import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Importar o componente Button do shadcn/ui

const DashboardPage: NextPage = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 py-8">
      <h1 className="text-4xl font-bold text-gray-800">Bem-vindo ao Dashboard!</h1>
      <p className="mt-2 text-gray-600">Esta é a sua página principal.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/accounts" passHref>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Gerenciar Contas
          </Button>
        </Link>
        <Link href="/credit_cards" passHref>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Gerenciar Cartões
          </Button>
        </Link>
        <Link href="/transactions" passHref>
          <Button className="bg-green-600 hover:bg-green-700">
            Gerenciar Transações
          </Button>
        </Link>
        <Link href="/monthly_overview" passHref>
          <Button className="bg-orange-600 hover:bg-orange-700">
            Visão Geral Mensal
          </Button>
        </Link>
      </div>
      <div className="mt-8">
        <Button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700"
        >
          Sair (Logout)
        </Button>
      </div>
    </div>
  );
};

export default DashboardPage;
