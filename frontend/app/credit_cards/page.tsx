"use client";

import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { fetchWithAuth } from '@/utils/api';
import { Button } from '@/components/ui/button'; // Importar o componente Button do shadcn/ui

interface CreditCard {
  id: number;
  name: string;
  limit: number;
  current_bill: number;
  owner_id: number;
}

const CreditCardsPage: NextPage = () => {
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [cardName, setCardName] = useState('');
  const [cardLimit, setCardLimit] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedLimit, setEditedLimit] = useState<number>(0);
  const [editedCurrentBill, setEditedCurrentBill] = useState<number>(0);

  const fetchCreditCards = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth('http://localhost:8000/credit_cards');
      if (response.ok) {
        const data: CreditCard[] = await response.json();
        setCreditCards(data);
      } else {
        setError('Erro ao carregar cartões de crédito.');
      }
    } catch (error: unknown) {
      setError((error as Error).message || 'Erro de conexão com o servidor.');
    }
  };

  const handleCreateCreditCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetchWithAuth('http://localhost:8000/credit_cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: cardName,
          limit: cardLimit,
          current_bill: 0, // Saldo inicial da fatura é 0
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Cartão de crédito criado com sucesso!');
        setCardName('');
        setCardLimit(0);
        fetchCreditCards(); // Recarregar a lista de cartões
      } else {
        setError(data.detail || 'Erro ao criar cartão de crédito.');
      }
    } catch (error: unknown) {
      setError((error as Error).message || 'Erro de conexão com o servidor.');
    }
  };

  const handleEditClick = (card: CreditCard) => {
    setEditingCard(card);
    setEditedName(card.name);
    setEditedLimit(card.limit);
    setEditedCurrentBill(card.current_bill);
  };

  const handleUpdateCreditCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!editingCard) return;

    try {
      const response = await fetchWithAuth(`http://localhost:8000/credit_cards/${editingCard.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedName,
          limit: editedLimit,
          current_bill: editedCurrentBill,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Cartão de crédito atualizado com sucesso!');
        setEditingCard(null);
        fetchCreditCards(); // Recarregar a lista de cartões
      } else {
        setError(data.detail || 'Erro ao atualizar cartão de crédito.');
      }
    } catch (error: unknown) {
      setError((error as Error).message || 'Erro de conexão com o servidor.');
    }
  };

  const handleDeleteCreditCard = async (cardId: number) => {
    if (!confirm('Tem certeza que deseja excluir este cartão de crédito?')) {
      return;
    }
    setError(null);

    try {
      const response = await fetchWithAuth(`http://localhost:8000/credit_cards/${cardId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Cartão de crédito excluído com sucesso!');
        fetchCreditCards(); // Recarregar a lista de cartões
      } else {
        const data = await response.json();
        setError(data.detail || 'Erro ao excluir cartão de crédito.');
      }
    } catch (error: unknown) {
      setError((error as Error).message || 'Erro de conexão com o servidor.');
    }
  };

  useEffect(() => {
    fetchCreditCards();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-8">Carregando cartões de crédito...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Meus Cartões de Crédito</h1>

      {error && <p className="mb-4 text-red-500">{error}</p>}

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
          >
            Adicionar Cartão
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
              >
                Salvar Alterações
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
                  >
                    Excluir
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
