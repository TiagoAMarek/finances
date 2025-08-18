import { http, HttpResponse } from 'msw';
import { mockCreditCards } from '../data/credit-cards';

export const creditCardHandlers = [
  // GET /api/credit_cards - Fetch all credit cards
  http.get('http://localhost:3000/api/credit_cards', () => {
    return HttpResponse.json(mockCreditCards);
  }),
  // Also handle relative URLs for backward compatibility
  http.get('/api/credit_cards', () => {
    return HttpResponse.json(mockCreditCards);
  }),

  // POST /api/credit_cards - Create new credit card
  http.post('/api/credit_cards', async ({ request }) => {
    const newCard = await request.json() as any;
    const creditCard = {
      id: Math.max(...mockCreditCards.map(c => c.id)) + 1,
      ...newCard,
      userId: 1,
      currentBill: newCard.currentBill || '0.00',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockCreditCards.push(creditCard);
    return HttpResponse.json({ creditCard });
  }),

  // PUT /api/credit_cards/:id - Update credit card
  http.put('/api/credit_cards/:id', async ({ request, params }) => {
    const cardId = parseInt(params.id as string);
    const updatedData = await request.json() as any;
    const cardIndex = mockCreditCards.findIndex(c => c.id === cardId);
    
    if (cardIndex === -1) {
      return HttpResponse.json(
        { detail: 'Cartão de crédito não encontrado.' },
        { status: 404 }
      );
    }
    
    mockCreditCards[cardIndex] = {
      ...mockCreditCards[cardIndex],
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };
    
    return HttpResponse.json({ creditCard: mockCreditCards[cardIndex] });
  }),

  // DELETE /api/credit_cards/:id - Delete credit card
  http.delete('/api/credit_cards/:id', ({ params }) => {
    const cardId = parseInt(params.id as string);
    const cardIndex = mockCreditCards.findIndex(c => c.id === cardId);
    
    if (cardIndex === -1) {
      return HttpResponse.json(
        { detail: 'Cartão de crédito não encontrado.' },
        { status: 404 }
      );
    }
    
    mockCreditCards.splice(cardIndex, 1);
    return HttpResponse.json({ message: 'Cartão excluído com sucesso.' });
  }),
];