import { VercelRequest, VercelResponse } from '@vercel/node';

const MISTICPAY_API_URL = 'https://api.misticpay.com/api';
const CLIENT_ID = process.env.MISTICPAY_CLIENT_ID || 'ci_nsq9oxmeym2gp2y';
const CLIENT_SECRET = process.env.MISTICPAY_CLIENT_SECRET || 'cs_qwrpnqcfpi4n8z097p9avl36q';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Transaction ID is required' });
    }

    // Call MisticPay API to verify transaction
    const response = await fetch(`${MISTICPAY_API_URL}/transactions/verify?id=${id}`, {
      method: 'GET',
      headers: {
        'ci': CLIENT_ID,
        'cs': CLIENT_SECRET,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('MisticPay API error:', error);
      return res.status(response.status).json({ 
        error: 'Failed to verify transaction',
        details: error 
      });
    }

    const data = await response.json();
    
    // Map MisticPay response to our format
    const mappedData = {
      id: data.data?.transactionId || id,
      status: data.data?.transactionState || 'PENDENTE',
      amount: data.data?.transactionAmount || 0,
      created_at: new Date().toISOString(),
    };

    return res.status(200).json(mappedData);
  } catch (error) {
    console.error('Error checking transaction:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
