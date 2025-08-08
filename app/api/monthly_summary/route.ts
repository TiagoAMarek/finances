import { NextRequest } from 'next/server';
import { eq, and, gte, lte, sum } from 'drizzle-orm';
import { db } from '../lib/db';
import { transactions } from '../lib/schema';
import { MonthlySummarySchema } from '../lib/validation';
import { getUserFromRequest, createErrorResponse, createSuccessResponse } from '../lib/auth';

// GET /api/monthly_summary?month=1&year=2024 - Get monthly financial summary
export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  
  if (!user) {
    return createErrorResponse('Unauthorized', 401);
  }

  try {
    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get('month') || '');
    const year = parseInt(searchParams.get('year') || '');

    const validatedData = MonthlySummarySchema.parse({ month, year });

    // Calculate date range for the month
    const startDate = `${validatedData.year}-${String(validatedData.month).padStart(2, '0')}-01`;
    const endDate = new Date(validatedData.year, validatedData.month, 0).toISOString().split('T')[0]; // Last day of month

    // Get all transactions for the month
    const monthlyTransactions = await db.select().from(transactions)
      .where(and(
        eq(transactions.ownerId, user.userId),
        gte(transactions.date, startDate),
        lte(transactions.date, endDate)
      ));

    // Calculate totals
    let totalIncome = 0;
    let totalExpense = 0;

    monthlyTransactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount);
      
      if (transaction.type === 'income') {
        totalIncome += amount;
      } else if (transaction.type === 'expense') {
        totalExpense += amount;
      }
      // Skip 'transfer' as they don't affect net worth
    });

    const balance = totalIncome - totalExpense;

    return createSuccessResponse({
      month: validatedData.month,
      year: validatedData.year,
      total_income: totalIncome,
      total_expense: totalExpense,
      balance: balance,
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return createErrorResponse('Month and year are required', 400);
    }
    
    console.error('Monthly summary error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}