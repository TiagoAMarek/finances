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
import { useCreditCards, useCreateCreditCard, useUpdateCreditCard, useDeleteCreditCard } from '@/hooks/useCreditCards';
import { toast } from 'sonner';
import { PlusIcon, EditIcon, TrashIcon, CreditCard, Wallet } from 'lucide-react';

type CreditCard = {
  id: number;
  name: string;
  limit: number;
  current_bill: number;
  owner_id: number;
};

const CreditCardsPage: NextPage = () => {
  const [cardName, setCardName] = useState('');
  const [cardLimit, setCardLimit] = useState<number>(0);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedLimit, setEditedLimit] = useState<number>(0);
  const [editedCurrentBill, setEditedCurrentBill] = useState<number>(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<CreditCard | null>(null);

  const { data: creditCards = [], isLoading, error } = useCreditCards();
  const createCardMutation = useCreateCreditCard();
  const updateCardMutation = useUpdateCreditCard();
  const deleteCardMutation = useDeleteCreditCard();


  const handleCreateCreditCard = async (e: React.FormEvent) => {
    e.preventDefault();

    createCardMutation.mutate(
      {
        name: cardName,
        limit: cardLimit,
        current_bill: 0,
      },
      {
        onSuccess: () => {
          toast.success('Cartão de crédito criado com sucesso!');
          setCardName('');
          setCardLimit(0);
        },
      }
    );
  };

  const handleEditClick = (card: CreditCard) => {
    setEditingCard(card);
    setEditedName(card.name);
    setEditedLimit(card.limit);
    setEditedCurrentBill(card.current_bill);
  };

  const handleUpdateCreditCard = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingCard) return;

    updateCardMutation.mutate(
      {
        ...editingCard,
        name: editedName,
        limit: editedLimit,
        current_bill: editedCurrentBill,
      },
      {
        onSuccess: () => {
          toast.success('Cartão de crédito atualizado com sucesso!');
          setEditingCard(null);
        },
      }
    );
  };

  const handleDeleteCreditCard = async () => {
    if (!cardToDelete) return;

    deleteCardMutation.mutate(cardToDelete.id, {
      onSuccess: () => {
        toast.success('Cartão de crédito excluído com sucesso!');
        setDeleteDialogOpen(false);
        setCardToDelete(null);
      },
    });
  };

  const openDeleteDialog = (card: CreditCard) => {
    setCardToDelete(card);
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
      <h1 className="text-3xl font-bold">Meus Cartões de Crédito</h1>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      {createCardMutation.error && (
        <Alert variant="destructive">
          <AlertDescription>{createCardMutation.error.message}</AlertDescription>
        </Alert>
      )}
      {updateCardMutation.error && (
        <Alert variant="destructive">
          <AlertDescription>{updateCardMutation.error.message}</AlertDescription>
        </Alert>
      )}
      {deleteCardMutation.error && (
        <Alert variant="destructive">
          <AlertDescription>{deleteCardMutation.error.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            Adicionar Novo Cartão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateCreditCard} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardName">Nome do Cartão</Label>
              <Input
                type="text"
                id="cardName"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardLimit">Limite (R$)</Label>
              <Input
                type="number"
                id="cardLimit"
                value={cardLimit}
                onChange={(e) => setCardLimit(parseFloat(e.target.value))}
                step="0.01"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={createCardMutation.isPending}
              className="flex items-center gap-2"
            >
              {createCardMutation.isPending ? (
                'Criando...'
              ) : (
                <>
                  <PlusIcon className="h-4 w-4" />
                  Adicionar Cartão
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {editingCard && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <EditIcon className="h-5 w-5" />
              Editar Cartão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateCreditCard} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editedName">Nome do Cartão</Label>
                <Input
                  type="text"
                  id="editedName"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editedLimit">Limite (R$)</Label>
                <Input
                  type="number"
                  id="editedLimit"
                  value={editedLimit}
                  onChange={(e) => setEditedLimit(parseFloat(e.target.value))}
                  step="0.01"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editedCurrentBill">Fatura Atual (R$)</Label>
                <Input
                  type="number"
                  id="editedCurrentBill"
                  value={editedCurrentBill}
                  onChange={(e) => setEditedCurrentBill(parseFloat(e.target.value))}
                  step="0.01"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <Button
                  type="submit"
                  disabled={updateCardMutation.isPending}
                >
                  {updateCardMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingCard(null)}
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
            <CreditCard className="h-5 w-5" />
            Cartões Existentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {creditCards.length === 0 ? (
            <div className="text-center py-8">
              <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum cartão encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Você ainda não cadastrou nenhum cartão de crédito.
              </p>
              <Button
                onClick={() => document.getElementById('cardName')?.focus()}
                className="flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Criar primeiro cartão
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {creditCards.map((card) => (
                <Card key={card.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-lg font-medium">{card.name}</p>
                      <p className="text-sm text-muted-foreground">Limite: R$ {card.limit.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Fatura Atual: R$ {card.current_bill.toFixed(2)}</p>
                    </div>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(card)}
                        className="flex items-center gap-1"
                      >
                        <EditIcon className="h-3 w-3" />
                        Editar
                      </Button>
                      <Dialog open={deleteDialogOpen && cardToDelete?.id === card.id} onOpenChange={setDeleteDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteDialog(card)}
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
                              Tem certeza que deseja excluir o cartão &ldquo;{card.name}&rdquo;? Esta ação não pode ser desfeita.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                              Cancelar
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDeleteCreditCard}
                              disabled={deleteCardMutation.isPending}
                              className="flex items-center gap-2"
                            >
                              {deleteCardMutation.isPending ? (
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

export default CreditCardsPage;
