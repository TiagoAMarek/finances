"use client";

import { useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';

const RegisterPage: NextPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Usuário registrado com sucesso!');
        router.push('/login');
      } else {
        setError(data.detail || 'Erro ao registrar usuário.');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-md bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-700">
          Criar sua conta
        </h1>
        <form onSubmit={handleSubmit}>
          {error && <p className="mb-4 text-center text-red-500">{error}</p>}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              Nome
            </label>
            <input
              type="text"
              id="name"
              className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring"
              placeholder="Seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
          <div className="mb-4">
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
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              Confirmar Senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
          >
            Criar conta
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="/login" className="text-sm text-blue-600 hover:underline">
            Já tem uma conta? Entrar
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
