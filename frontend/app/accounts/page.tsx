"use client";

import { useState } from 'react';
import type { NextPage } from 'next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando contas...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Minhas Contas Bancárias</h1>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      {createAccountMutation.error && (
        <Alert variant="destructive">
          <AlertDescription>{createAccountMutation.error.message}</AlertDescription>
        </Alert>
      )}
      {updateAccountMutation.error && (
        <Alert variant="destructive">
          <AlertDescription>{updateAccountMutation.error.message}</AlertDescription>
        </Alert>
      )}
      {deleteAccountMutation.error && (
        <Alert variant="destructive">
          <AlertDescription>{deleteAccountMutation.error.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Nova Conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accountName">Nome da Conta</Label>
              <Input
                type="text"
                id="accountName"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountBalance">Saldo Inicial (R$)</Label>
              <Input
                type="number"
                id="accountBalance"
                value={accountBalance}
                onChange={(e) => setAccountBalance(parseFloat(e.target.value))}
                step="0.01"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={createAccountMutation.isPending}
            >
              {createAccountMutation.isPending ? 'Criando...' : 'Adicionar Conta'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {editingAccount && (
        <Card>
          <CardHeader>
            <CardTitle>Editar Conta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateAccount} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editedName">Nome da Conta</Label>
                <Input
                  type="text"
                  id="editedName"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editedBalance">Saldo (R$)</Label>
                <Input
                  type="number"
                  id="editedBalance"
                  value={editedBalance}
                  onChange={(e) => setEditedBalance(parseFloat(e.target.value))}
                  step="0.01"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <Button
                  type="submit"
                  disabled={updateAccountMutation.isPending}
                >
                  {updateAccountMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingAccount(null)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Contas Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          {accounts.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma conta bancária cadastrada ainda.</p>
          ) : (
            <div className="space-y-4">
              {accounts.map((account) => (
                <Card key={account.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-lg font-medium">{account.name}</p>
                      <p className="text-sm text-muted-foreground">Saldo: R$ {account.balance.toFixed(2)}</p>
                    </div>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handleEditClick(account)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteAccount(account.id)}
                        disabled={deleteAccountMutation.isPending}
                      >
                        {deleteAccountMutation.isPending ? 'Excluindo...' : 'Excluir'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsPage;
