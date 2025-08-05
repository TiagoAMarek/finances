"use client";

import { useState } from 'react';
import type { NextPage } from 'next';
import { Button } from '@/components/ui/button';
import { useAccounts, useCreateAccount, useUpdateAccount, useDeleteAccount } from '@/hooks/useAccounts';

type BankAccount = {
  id: number;
  name: string;
  balance: number;
  currency: string;
  owner_id: number;
};

const AccountsPage: NextPage = () => {
  const [accountName, setAccountName] = useState('');
  const [accountBalance, setAccountBalance] = useState<number>(0);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedBalance, setEditedBalance] = useState<number>(0);

  const { data: accounts = [], isLoading, error } = useAccounts();
  const createAccountMutation = useCreateAccount();
  const updateAccountMutation = useUpdateAccount();
  const deleteAccountMutation = useDeleteAccount();


  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    createAccountMutation.mutate(
      {
        name: accountName,
        balance: accountBalance,
        currency: "BRL",
      },
      {
        onSuccess: () => {
          alert('Conta criada com sucesso!');
          setAccountName('');
          setAccountBalance(0);
        },
      }
    );
  };

  const handleEditClick = (account: BankAccount) => {
    setEditingAccount(account);
    setEditedName(account.name);
    setEditedBalance(account.balance);
  };

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingAccount) return;

    updateAccountMutation.mutate(
      {
        ...editingAccount,
        name: editedName,
        balance: editedBalance,
      },
      {
        onSuccess: () => {
          alert('Conta atualizada com sucesso!');
          setEditingAccount(null);
        },
      }
    );
  };

  const handleDeleteAccount = async (accountId: number) => {
    if (!confirm('Tem certeza que deseja excluir esta conta?')) {
      return;
    }

    deleteAccountMutation.mutate(accountId, {
      onSuccess: () => {
        alert('Conta excluída com sucesso!');
      },
    });
  };


  if (isLoading) {
    return <div className="flex items-center justify-center py-8">Carregando contas...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Minhas Contas Bancárias</h1>

      {error && <p className="mb-4 text-red-500">{error.message}</p>}
      {createAccountMutation.error && <p className="mb-4 text-red-500">{createAccountMutation.error.message}</p>}
      {updateAccountMutation.error && <p className="mb-4 text-red-500">{updateAccountMutation.error.message}</p>}
      {deleteAccountMutation.error && <p className="mb-4 text-red-500">{deleteAccountMutation.error.message}</p>}

      <div className="mb-8 rounded-md bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">Adicionar Nova Conta</h2>
        <form onSubmit={handleCreateAccount}>
          <div className="mb-4">
            <label htmlFor="accountName" className="block text-sm font-medium text-gray-600">
              Nome da Conta
            </label>
            <input
              type="text"
              id="accountName"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="accountBalance" className="block text-sm font-medium text-gray-600">
              Saldo Inicial (R$)
            </label>
            <input
              type="number"
              id="accountBalance"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring"
              value={accountBalance}
              onChange={(e) => setAccountBalance(parseFloat(e.target.value))}
              step="0.01"
              required
            />
          </div>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={createAccountMutation.isPending}
          >
            {createAccountMutation.isPending ? 'Criando...' : 'Adicionar Conta'}
          </Button>
        </form>
      </div>

      {editingAccount && (
        <div className="mb-8 rounded-md bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">Editar Conta</h2>
          <form onSubmit={handleUpdateAccount}>
            <div className="mb-4">
              <label htmlFor="editedName" className="block text-sm font-medium text-gray-600">
                Nome da Conta
              </label>
              <input
                type="text"
                id="editedName"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="editedBalance" className="block text-sm font-medium text-gray-600">
                Saldo (R$)
              </label>
              <input
                type="number"
                id="editedBalance"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring"
                value={editedBalance}
                onChange={(e) => setEditedBalance(parseFloat(e.target.value))}
                step="0.01"
                required
              />
            </div>
            <div className="flex space-x-4">
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={updateAccountMutation.isPending}
              >
                {updateAccountMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
              <Button
                type="button"
                onClick={() => setEditingAccount(null)}
                className="bg-gray-400 hover:bg-gray-500"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-md bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">Contas Existentes</h2>
        {accounts.length === 0 ? (
          <p className="text-gray-500">Nenhuma conta bancária cadastrada ainda.</p>
        ) : (
          <ul className="space-y-4">
            {accounts.map((account) => (
              <li key={account.id} className="flex items-center justify-between rounded-md border border-gray-200 p-4">
                <div>
                  <p className="text-lg font-medium text-gray-900">{account.name}</p>
                  <p className="text-sm text-gray-600">Saldo: R$ {account.balance.toFixed(2)}</p>
                </div>
                <div className="space-x-2">
                  <Button
                    onClick={() => handleEditClick(account)}
                    className="bg-yellow-500 hover:bg-yellow-600"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDeleteAccount(account.id)}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={deleteAccountMutation.isPending}
                  >
                    {deleteAccountMutation.isPending ? 'Excluindo...' : 'Excluir'}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AccountsPage;
