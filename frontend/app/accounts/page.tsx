"use client";

import { useState } from 'react';
import type { NextPage } from 'next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useAccounts, useCreateAccount, useUpdateAccount, useDeleteAccount } from '@/hooks/useAccounts';
import { toast } from 'sonner';
import { PlusIcon, EditIcon, TrashIcon, CreditCardIcon, Banknote } from 'lucide-react';

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<BankAccount | null>(null);

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
          toast.success('Conta criada com sucesso!');
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
          toast.success('Conta atualizada com sucesso!');
          setEditingAccount(null);
        },
      }
    );
  };

  const handleDeleteAccount = async () => {
    if (!accountToDelete) return;

    deleteAccountMutation.mutate(accountToDelete.id, {
      onSuccess: () => {
        toast.success('Conta excluída com sucesso!');
        setDeleteDialogOpen(false);
        setAccountToDelete(null);
      },
    });
  };

  const openDeleteDialog = (account: BankAccount) => {
    setAccountToDelete(account);
    setDeleteDialogOpen(true);
  };


  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-32" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          <CardTitle className="flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            Adicionar Nova Conta
          </CardTitle>
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
              className="flex items-center gap-2"
            >
              {createAccountMutation.isPending ? (
                'Criando...'
              ) : (
                <>
                  <PlusIcon className="h-4 w-4" />
                  Adicionar Conta
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {editingAccount && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <EditIcon className="h-5 w-5" />
              Editar Conta
            </CardTitle>
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
          <CardTitle className="flex items-center gap-2">
            <CreditCardIcon className="h-5 w-5" />
            Contas Existentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {accounts.length === 0 ? (
            <div className="text-center py-8">
              <Banknote className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma conta encontrada</h3>
              <p className="text-muted-foreground mb-4">
                Você ainda não cadastrou nenhuma conta bancária.
              </p>
              <Button
                onClick={() => document.getElementById('accountName')?.focus()}
                className="flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Criar primeira conta
              </Button>
            </div>
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
                        size="sm"
                        onClick={() => handleEditClick(account)}
                        className="flex items-center gap-1"
                      >
                        <EditIcon className="h-3 w-3" />
                        Editar
                      </Button>
                      <Dialog open={deleteDialogOpen && accountToDelete?.id === account.id} onOpenChange={setDeleteDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteDialog(account)}
                            className="flex items-center gap-1"
                          >
                            <TrashIcon className="h-3 w-3" />
                            Excluir
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirmar exclusão</DialogTitle>
                            <DialogDescription>
                              Tem certeza que deseja excluir a conta &ldquo;{account.name}&rdquo;? Esta ação não pode ser desfeita.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                              Cancelar
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDeleteAccount}
                              disabled={deleteAccountMutation.isPending}
                              className="flex items-center gap-2"
                            >
                              {deleteAccountMutation.isPending ? (
                                'Excluindo...'
                              ) : (
                                <>
                                  <TrashIcon className="h-4 w-4" />
                                  Excluir
                                </>
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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
