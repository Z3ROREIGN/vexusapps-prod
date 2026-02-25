import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { createPayment, checkPaymentStatus, formatAmount } from "@/lib/misticpay";
import { CheckCircle2, Clock, AlertCircle, Copy } from "lucide-react";

/**
 * Checkout Page with MisticPay Integration
 * Handles payment processing with auto-approval
 */

interface CheckoutState {
  step: "form" | "payment" | "success" | "error";
  transactionId?: string;
  qrCode?: string;
  pixKey?: string;
  status?: string;
  error?: string;
}

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    product: "automation",
  });

  const [checkout, setCheckout] = useState<CheckoutState>({ step: "form" });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const products: Record<string, { name: string; price: number }> = {
    automation: { name: "Automação de Vendas", price: 29.9 },
    gateway: { name: "Gateway MisticPay", price: 19.9 },
    dashboard: { name: "Dashboard Inteligente", price: 39.9 },
  };

  const selectedProduct = products[formData.product];

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payment = await createPayment({
        amount: selectedProduct.price,
        description: selectedProduct.name,
        customer_email: formData.email,
        customer_name: formData.name,
        product_id: formData.product,
      });

      setCheckout({
        step: "payment",
        transactionId: payment.transaction_id,
        qrCode: payment.qr_code,
        pixKey: payment.pix_key,
        status: payment.status,
      });

      // Start polling for payment status
      pollForPayment(payment.transaction_id);
    } catch (error) {
      setCheckout({
        step: "error",
        error: error instanceof Error ? error.message : "Erro ao criar pagamento",
      });
    } finally {
      setLoading(false);
    }
  };

  const pollForPayment = async (transactionId: string) => {
    let attempts = 0;
    const maxAttempts = 150; // 5 minutes

    const interval = setInterval(async () => {
      attempts++;

      try {
        const status = await checkPaymentStatus(transactionId);

        if (status.status === "approved") {
          clearInterval(interval);
          setCheckout({
            step: "success",
            transactionId: status.id,
            status: "approved",
          });
        } else if (status.status === "rejected" || status.status === "expired") {
          clearInterval(interval);
          setCheckout({
            step: "error",
            error: `Pagamento ${status.status === "rejected" ? "rejeitado" : "expirado"}`,
          });
        }

        if (attempts >= maxAttempts) {
          clearInterval(interval);
          setCheckout({
            step: "error",
            error: "Tempo limite para pagamento excedido",
          });
        }
      } catch (error) {
        console.error("Error polling payment:", error);
      }
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-20">
      <div className="container max-w-2xl">
        {checkout.step === "form" && (
          <Card className="bg-background border-border">
            <CardHeader>
              <CardTitle>Checkout - VexusApps</CardTitle>
              <CardDescription>
                Preencha seus dados para continuar com o pagamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="product">Produto</Label>
                  <select
                    id="product"
                    value={formData.product}
                    onChange={(e) =>
                      setFormData({ ...formData, product: e.target.value })
                    }
                    className="w-full mt-2 px-3 py-2 bg-input border border-border rounded-md text-foreground"
                  >
                    {Object.entries(products).map(([key, product]) => (
                      <option key={key} value={key}>
                        {product.name} - {formatAmount(product.price)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="mt-2"
                  />
                </div>

                <div className="bg-card p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-2">Total a pagar:</p>
                  <p className="text-3xl font-bold text-accent">
                    {formatAmount(selectedProduct.price)}
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {loading ? "Processando..." : "Continuar para Pagamento"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setLocation("/")}
                >
                  Voltar
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {checkout.step === "payment" && (
          <Card className="bg-background border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                Aguardando Pagamento
              </CardTitle>
              <CardDescription>
                Escaneie o QR Code ou copie a chave PIX para pagar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-card p-6 rounded-lg border border-border text-center">
                {checkout.qrCode && (
                  <img
                    src={checkout.qrCode}
                    alt="QR Code PIX"
                    className="w-64 h-64 mx-auto mb-4"
                  />
                )}
                <p className="text-sm text-muted-foreground mb-4">
                  Escaneie com seu app bancário
                </p>
              </div>

              <div>
                <Label className="text-sm">Chave PIX (Copia e Cola)</Label>
                <div className="flex gap-2 mt-2">
                  <code className="flex-1 bg-input p-3 rounded-md border border-border text-sm break-all">
                    {checkout.pixKey}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => checkout.pixKey && copyToClipboard(checkout.pixKey)}
                    className="flex-shrink-0"
                  >
                    {copied ? "Copiado!" : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                <p className="text-sm text-foreground">
                  <strong>ID da Transação:</strong> {checkout.transactionId}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  O pagamento será verificado automaticamente em tempo real
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setLocation("/")}
              >
                Voltar para Home
              </Button>
            </CardContent>
          </Card>
        )}

        {checkout.step === "success" && (
          <Card className="bg-background border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                Pagamento Aprovado!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                <p className="text-foreground mb-2">
                  Seu pagamento foi processado com sucesso!
                </p>
                <p className="text-sm text-muted-foreground">
                  Você receberá um email de confirmação em breve com os detalhes do seu pedido.
                </p>
              </div>

              <div className="bg-card p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">ID da Transação:</p>
                <p className="font-mono text-sm">{checkout.transactionId}</p>
              </div>

              <Button
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => setLocation("/")}
              >
                Voltar para Home
              </Button>
            </CardContent>
          </Card>
        )}

        {checkout.step === "error" && (
          <Card className="bg-background border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                Erro no Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                <p className="text-foreground">{checkout.error}</p>
              </div>

              <Button
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => setCheckout({ step: "form" })}
              >
                Tentar Novamente
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setLocation("/")}
              >
                Voltar para Home
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
