/**
 * MisticPay Integration Service
 * Handles payment gateway integration with auto-approval
 * API Base: https://api.misticpay.com/api
 */

const MISTICPAY_API_URL = "https://api.misticpay.com/api";

export interface CreateTransactionRequest {
  amount: number;
  payerName: string;
  payerDocument: string;
  transactionId: string;
  description: string;
}

export interface MisticPayResponse {
  message: string;
  data: {
    transactionId: string;
    payer: {
      name: string;
      document: string;
    };
    transactionFee: number;
    transactionType: string;
    transactionMethod: string;
    transactionAmount: number;
    transactionState: string;
    qrCodeBase64: string;
    qrcodeUrl: string;
    copyPaste: string;
  };
}

export interface TransactionStatus {
  id: string;
  status: "PENDENTE" | "COMPLETO" | "FALHOU";
  amount: number;
  created_at: string;
  completed_at?: string;
}

/**
 * Create a new payment transaction via MisticPay
 * Calls backend proxy to keep Client Secret secure
 */
export async function createPayment(
  request: CreateTransactionRequest
): Promise<MisticPayResponse> {
  try {
    const response = await fetch("/api/misticpay/create-transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao criar transação");
    }

    return await response.json();
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
      `/api/misticpay/check-transaction?id=${transactionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao verificar transação");
    }

    const data = await response.json();
    return data;
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

        if (status.status === "COMPLETO") {
          clearInterval(interval);
          resolve(status);
        } else if (status.status === "FALHOU") {
          clearInterval(interval);
          reject(new Error("Pagamento rejeitado"));
        }

        if (attempts >= maxAttempts) {
          clearInterval(interval);
          reject(new Error("Timeout ao aguardar pagamento"));
        }
      } catch (error) {
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          reject(error);
        }
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
