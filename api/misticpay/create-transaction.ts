import { VercelRequest, VercelResponse } from '@vercel/node';

const MISTICPAY_API_URL = 'https://api.misticpay.com/api';
const CLIENT_ID = process.env.MISTICPAY_CLIENT_ID || 'ci_nsq9oxmeym2gp2y';
const CLIENT_SECRET = process.env.MISTICPAY_CLIENT_SECRET || 'cs_qwrpnqcfpi4n8z097p9avl36q';

interface CreateTransactionRequest {
  amount: number;
  payerName: string;
  payerDocument: string;
  transactionId: string;
  description: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, payerName, payerDocument, transactionId, description } = req.body as CreateTransactionRequest;

    // Validate required fields
    if (!amount || !payerName || !payerDocument || !transactionId || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Call MisticPay API
    const response = await fetch(`${MISTICPAY_API_URL}/transactions/create`, {
      method: 'POST',
      headers: {
        'ci': CLIENT_ID,
        'cs': CLIENT_SECRET,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100) / 100, // Ensure 2 decimal places
        payerName,
        payerDocument,
        transactionId,
        description,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('MisticPay API error:', error);
      return res.status(response.status).json({ 
        error: 'Failed to create transaction',
        details: error 
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error creating transaction:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
