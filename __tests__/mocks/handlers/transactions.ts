import { http, HttpResponse } from 'msw';
import { mockTransactions } from '../data/transactions';

export const transactionHandlers = [
  // GET /api/transactions - Fetch all transactions
  http.get('/api/transactions', () => {
    return HttpResponse.json(mockTransactions);
  }),

  // POST /api/transactions - Create new transaction
  http.post('/api/transactions', async ({ request }) => {
    const newTransaction = await request.json();
    const transaction = {
      id: Math.max(...mockTransactions.map(t => t.id)) + 1,
      ...newTransaction,
      userId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockTransactions.push(transaction);
    return HttpResponse.json({ transaction });
  }),

  // PUT /api/transactions/:id - Update transaction
  http.put('/api/transactions/:id', async ({ request, params }) => {
    const transactionId = parseInt(params.id as string);
    const updatedData = await request.json();
    const transactionIndex = mockTransactions.findIndex(t => t.id === transactionId);
    
    if (transactionIndex === -1) {
      return HttpResponse.json(
        { detail: 'Transação não encontrada.' },
        { status: 404 }
      );
    }
    
    mockTransactions[transactionIndex] = {
      ...mockTransactions[transactionIndex],
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };
    
    return HttpResponse.json({ transaction: mockTransactions[transactionIndex] });
  }),

  // DELETE /api/transactions/:id - Delete transaction
  http.delete('/api/transactions/:id', ({ params }) => {
    const transactionId = parseInt(params.id as string);
    const transactionIndex = mockTransactions.findIndex(t => t.id === transactionId);
    
    if (transactionIndex === -1) {
      return HttpResponse.json(
        { detail: 'Transação não encontrada.' },
        { status: 404 }
      );
    }
    
    mockTransactions.splice(transactionIndex, 1);
    return HttpResponse.json({ message: 'Transação excluída com sucesso.' });
  }),
];