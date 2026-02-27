import { VercelRequest, VercelResponse } from '@vercel/node';

// Note: In production, you should verify the webhook signature
// and store the webhook in your database

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body;

    console.log('Webhook received from MisticPay:', payload);

    // Validate webhook payload
    if (!payload.transactionId || !payload.status) {
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }

    // Process webhook based on type
    if (payload.transactionType === 'DEPOSITO') {
      await handleDepositWebhook(payload);
    } else if (payload.transactionType === 'RETIRADA') {
      await handleWithdrawalWebhook(payload);
    }

    // Always return 200 to acknowledge receipt
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handleDepositWebhook(payload: any) {
  console.log('Processing deposit webhook:', {
    transactionId: payload.transactionId,
    status: payload.status,
    amount: payload.value,
    customer: payload.clientName,
  });

  // TODO: Update transaction status in Supabase
  // TODO: Create order if payment is complete
  // TODO: Send email confirmation to customer
}

async function handleWithdrawalWebhook(payload: any) {
  console.log('Processing withdrawal webhook:', {
    transactionId: payload.transactionId,
    status: payload.status,
    amount: payload.value,
  });

  // TODO: Update withdrawal status in Supabase
  // TODO: Send confirmation email
}
