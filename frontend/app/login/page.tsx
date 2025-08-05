"use client";

import { useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useLogin } from '@/hooks/useAuth';

const LoginPage: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          localStorage.setItem('access_token', data.access_token);
          alert('Login bem-sucedido!');
          router.push('/dashboard');
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 py-8">
      <div className="w-full max-w-md rounded-md bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-700">
          Entrar na sua conta
        </h1>
        <form onSubmit={handleSubmit}>
          {loginMutation.error && <p className="mb-4 text-center text-red-500">{loginMutation.error.message}</p>}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              E-mail
            </label>
            <input
              type="email"
              id="email"
              className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        <div className="mt-4 flex items-center justify-between">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            Esqueceu a senha?
          </a>
          <a href="/register" className="text-sm text-blue-600 hover:underline">
            Criar uma conta
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
