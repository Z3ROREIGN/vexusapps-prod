/**
 * MisticPay Integration Service
 * Handles payment gateway integration with auto-approval
 * API Base: https://api.misticpay.com/api
 */

const MISTICPAY_API_URL = "https://api.misticpay.com/api";
const CLIENT_ID = "ci_nsq9oxmeym2gp2y";
const CLIENT_SECRET = "cs_qwrpnqcfpi4n8z097p9avl36q";

interface PaymentRequest {
  amount: number;
  description: string;
  customer_email: string;
  customer_name: string;
  product_id: string;
  webhook_url?: string;
}

interface PaymentResponse {
  transaction_id: string;
  qr_code: string;
  pix_key: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  expires_at: string;
}

interface TransactionStatus {
  id: string;
  status: "pending" | "approved" | "rejected" | "expired";
  amount: number;
  created_at: string;
  approved_at?: string;
}

/**
 * Create a new payment transaction
 * Auto-approval is configured on MisticPay dashboard
 */
export async function createPayment(
  request: PaymentRequest
): Promise<PaymentResponse> {
  try {
    const response = await fetch(`${MISTICPAY_API_URL}/gerar-transacao`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-ID": CLIENT_ID,
        "Client-Secret": CLIENT_SECRET,
      },
      body: JSON.stringify({
        valor: request.amount,
        descricao: request.description,
        email_cliente: request.customer_email,
        nome_cliente: request.customer_name,
        id_externo: request.product_id,
        url_webhook: request.webhook_url || `${window.location.origin}/api/webhook/misticpay`,
      }),
    });

    if (!response.ok) {
      throw new Error(`MisticPay API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      transaction_id: data.id,
      qr_code: data.qr_code,
      pix_key: data.chave_pix,
      status: data.status === "pendente" ? "pending" : data.status,
      created_at: data.criado_em,
      expires_at: data.expira_em,
    };
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
}

/**
 * Check payment transaction status
 * Returns current status of the transaction
 */
export async function checkPaymentStatus(
  transactionId: string
): Promise<TransactionStatus> {
  try {
    const response = await fetch(
      `${MISTICPAY_API_URL}/verificar-transacao?id=${transactionId}`,
      {
        method: "GET",
        headers: {
          "Client-ID": CLIENT_ID,
          "Client-Secret": CLIENT_SECRET,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`MisticPay API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: data.id,
      status: data.status === "pendente" ? "pending" : data.status,
      amount: data.valor,
      created_at: data.criado_em,
      approved_at: data.aprovado_em,
    };
  } catch (error) {
    console.error("Error checking payment status:", error);
    throw error;
  }
}

/**
 * Poll payment status with auto-approval handling
 * Checks status every 2 seconds for up to 5 minutes
 */
export async function pollPaymentStatus(
  transactionId: string,
  maxAttempts: number = 150 // 5 minutes at 2-second intervals
): Promise<TransactionStatus> {
  let attempts = 0;

  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      attempts++;

      try {
        const status = await checkPaymentStatus(transactionId);

        if (status.status === "approved") {
          clearInterval(interval);
          resolve(status);
        } else if (status.status === "rejected" || status.status === "expired") {
          clearInterval(interval);
          reject(new Error(`Payment ${status.status}`));
        }

        if (attempts >= maxAttempts) {
          clearInterval(interval);
          reject(new Error("Payment timeout"));
        }
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }
    }, 2000); // Check every 2 seconds
  });
}

/**
 * Format payment amount for display
 */
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}

/**
 * Generate QR Code data URL from string
 * Uses a simple QR code service
 */
export function generateQRCodeURL(data: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    data
  )}`;
}
