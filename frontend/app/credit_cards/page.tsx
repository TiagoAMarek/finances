"use client";

import { useState } from 'react';
import type { NextPage } from 'next';
import { Button } from '@/components/ui/button';
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
    return <div className="flex items-center justify-center py-8">Carregando cartões de crédito...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Meus Cartões de Crédito</h1>

      {error && <p className="mb-4 text-red-500">{error.message}</p>}
      {createCardMutation.error && <p className="mb-4 text-red-500">{createCardMutation.error.message}</p>}
      {updateCardMutation.error && <p className="mb-4 text-red-500">{updateCardMutation.error.message}</p>}
      {deleteCardMutation.error && <p className="mb-4 text-red-500">{deleteCardMutation.error.message}</p>}

      <div className="mb-8 rounded-md bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">Adicionar Novo Cartão</h2>
        <form onSubmit={handleCreateCreditCard}>
          <div className="mb-4">
            <label htmlFor="cardName" className="block text-sm font-medium text-gray-600">
              Nome do Cartão
            </label>
            <input
              type="text"
              id="cardName"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="cardLimit" className="block text-sm font-medium text-gray-600">
              Limite (R$)
            </label>
            <input
              type="number"
              id="cardLimit"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring"
              value={cardLimit}
              onChange={(e) => setCardLimit(parseFloat(e.target.value))}
              step="0.01"
              required
            />
          </div>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={createCardMutation.isPending}
          >
            {createCardMutation.isPending ? 'Criando...' : 'Adicionar Cartão'}
          </Button>
        </form>
      </div>

      {editingCard && (
        <div className="mb-8 rounded-md bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">Editar Cartão</h2>
          <form onSubmit={handleUpdateCreditCard}>
            <div className="mb-4">
              <label htmlFor="editedName" className="block text-sm font-medium text-gray-600">
                Nome do Cartão
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
              <label htmlFor="editedLimit" className="block text-sm font-medium text-gray-600">
                Limite (R$)
              </label>
              <input
                type="number"
                id="editedLimit"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring"
                value={editedLimit}
                onChange={(e) => setEditedLimit(parseFloat(e.target.value))}
                step="0.01"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="editedCurrentBill" className="block text-sm font-medium text-gray-600">
                Fatura Atual (R$)
              </label>
              <input
                type="number"
                id="editedCurrentBill"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring"
                value={editedCurrentBill}
                onChange={(e) => setEditedCurrentBill(parseFloat(e.target.value))}
                step="0.01"
                required
              />
            </div>
            <div className="flex space-x-4">
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={updateCardMutation.isPending}
              >
                {updateCardMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
              <Button
                type="button"
                onClick={() => setEditingCard(null)}
                className="bg-gray-400 hover:bg-gray-500"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-md bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">Cartões Existentes</h2>
        {creditCards.length === 0 ? (
          <p className="text-gray-500">Nenhum cartão de crédito cadastrado ainda.</p>
        ) : (
          <ul className="space-y-4">
            {creditCards.map((card) => (
              <li key={card.id} className="flex items-center justify-between rounded-md border border-gray-200 p-4">
                <div>
                  <p className="text-lg font-medium text-gray-900">{card.name}</p>
                  <p className="text-sm text-gray-600">Limite: R$ {card.limit.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Fatura Atual: R$ {card.current_bill.toFixed(2)}</p>
                </div>
                <div className="space-x-2">
                  <Button
                    onClick={() => handleEditClick(card)}
                    className="bg-yellow-500 hover:bg-yellow-600"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDeleteCreditCard(card.id)}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={deleteCardMutation.isPending}
                  >
                    {deleteCardMutation.isPending ? 'Excluindo...' : 'Excluir'}
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

export default CreditCardsPage;
