"use client";

import { useState } from 'react';
import type { NextPage } from 'next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCreditCards, useCreateCreditCard, useUpdateCreditCard, useDeleteCreditCard } from '@/hooks/useCreditCards';

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
          alert('Cartão de crédito criado com sucesso!');
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
          alert('Cartão de crédito atualizado com sucesso!');
          setEditingCard(null);
        },
      }
    );
  };

  const handleDeleteCreditCard = async (cardId: number) => {
    if (!confirm('Tem certeza que deseja excluir este cartão de crédito?')) {
      return;
    }

    deleteCardMutation.mutate(cardId, {
      onSuccess: () => {
        alert('Cartão de crédito excluído com sucesso!');
      },
    });
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando cartões de crédito...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
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
          <CardTitle>Adicionar Novo Cartão</CardTitle>
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
            >
              {createCardMutation.isPending ? 'Criando...' : 'Adicionar Cartão'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {editingCard && (
        <Card>
          <CardHeader>
            <CardTitle>Editar Cartão</CardTitle>
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
          <CardTitle>Cartões Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          {creditCards.length === 0 ? (
            <p className="text-muted-foreground">Nenhum cartão de crédito cadastrado ainda.</p>
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
                        onClick={() => handleEditClick(card)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteCreditCard(card.id)}
                        disabled={deleteCardMutation.isPending}
                      >
                        {deleteCardMutation.isPending ? 'Excluindo...' : 'Excluir'}
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

export default CreditCardsPage;
