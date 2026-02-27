import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { createPayment, checkPaymentStatus, formatAmount, pollPaymentStatus } from "@/lib/misticpay";
import { CheckCircle2, Clock, AlertCircle, Copy, Loader2 } from "lucide-react";

/**
 * Checkout Page with MisticPay Integration
 * Handles payment processing with auto-approval
 */

interface CheckoutState {
  step: "form" | "payment" | "success" | "error";
  transactionId?: string;
  qrCodeUrl?: string;
  copyPaste?: string;
  status?: string;
  error?: string;
}

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    document: "",
    product: "automation",
  });

  const [checkout, setCheckout] = useState<CheckoutState>({ step: "form" });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const products: Record<string, { name: string; price: number }> = {
    automation: { name: "Automação de Vendas", price: 99.9 },
    gateway: { name: "Gateway MisticPay", price: 199.9 },
    dashboard: { name: "Dashboard Inteligente", price: 149.9 },
  };

  const selectedProduct = products[formData.product];

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payment = await createPayment({
        amount: selectedProduct.price,
        payerName: formData.name,
        payerDocument: formData.document,
        transactionId: `order_${Date.now()}`,
        description: selectedProduct.name,
      });

      setCheckout({
        step: "payment",
        transactionId: payment.data.transactionId,
        qrCodeUrl: payment.data.qrcodeUrl,
        copyPaste: payment.data.copyPaste,
        status: payment.data.transactionState,
      });

      // Start polling for payment status
      pollForPayment(payment.data.transactionId);
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
    try {
      const status = await pollPaymentStatus(transactionId);

      if (status.status === "COMPLETO") {
        setCheckout({
          step: "success",
          transactionId: status.id,
          status: "COMPLETO",
        });
      }
    } catch (error) {
      setCheckout({
        step: "error",
        error: error instanceof Error ? error.message : "Erro ao processar pagamento",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Form Step */}
        {checkout.step === "form" && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-neon-green">Checkout - VexusApps</CardTitle>
              <CardDescription>Selecione um produto e complete o pagamento</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Product Selection */}
                <div>
                  <Label className="text-slate-200">Produto</Label>
                  <select
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white mt-2"
                  >
                    <option value="automation">Automação de Vendas - R$ 99,90</option>
                    <option value="gateway">Gateway MisticPay - R$ 199,90</option>
                    <option value="dashboard">Dashboard Inteligente - R$ 149,90</option>
                  </select>
                </div>

                {/* Name */}
                <div>
                  <Label htmlFor="name" className="text-slate-200">Nome Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="João Silva"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-slate-200">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="joao@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                {/* Document */}
                <div>
                  <Label htmlFor="document" className="text-slate-200">CPF</Label>
                  <Input
                    id="document"
                    type="text"
                    placeholder="000.000.000-00"
                    value={formData.document}
                    onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                {/* Price Display */}
                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Total a pagar:</span>
                    <span className="text-2xl font-bold text-neon-green">
                      {formatAmount(selectedProduct.price)}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-neon-green text-slate-900 font-bold hover:bg-opacity-90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Ir para Pagamento"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Payment Step */}
        {checkout.step === "payment" && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="text-yellow-500" />
                <CardTitle className="text-yellow-500">Aguardando Pagamento</CardTitle>
              </div>
              <CardDescription>Escaneie o QR Code ou copie a chave PIX</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* QR Code */}
              {checkout.qrCodeUrl && (
                <div className="flex justify-center">
                  <img
                    src={checkout.qrCodeUrl}
                    alt="QR Code PIX"
                    className="w-64 h-64 border-2 border-neon-green p-2 rounded-lg"
                  />
                </div>
              )}

              {/* Copy Paste Key */}
              {checkout.copyPaste && (
                <div className="space-y-2">
                  <Label className="text-slate-200">Chave PIX (Copia e Cola)</Label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={checkout.copyPaste}
                      readOnly
                      className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm font-mono"
                    />
                    <Button
                      onClick={() => copyToClipboard(checkout.copyPaste!)}
                      className="bg-neon-green text-slate-900 hover:bg-opacity-90"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  {copied && <p className="text-green-400 text-sm">Copiado!</p>}
                </div>
              )}

              {/* Status */}
              <div className="bg-slate-700 p-4 rounded-lg">
                <p className="text-slate-300">Status: <span className="text-yellow-500 font-bold">{checkout.status}</span></p>
                <p className="text-slate-400 text-sm mt-2">Aguardando confirmação do pagamento...</p>
              </div>

              {/* Back Button */}
              <Button
                onClick={() => setCheckout({ step: "form" })}
                variant="outline"
                className="w-full"
              >
                Voltar
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Success Step */}
        {checkout.step === "success" && (
          <Card className="bg-slate-800 border-green-500">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-green-500" />
                <CardTitle className="text-green-500">Pagamento Confirmado!</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-500 bg-opacity-10 border border-green-500 p-4 rounded-lg">
                <p className="text-green-400">Seu pagamento foi processado com sucesso!</p>
                <p className="text-slate-300 mt-2">ID da Transação: <span className="font-mono text-sm">{checkout.transactionId}</span></p>
              </div>

              <Button
                onClick={() => setLocation("/")}
                className="w-full bg-neon-green text-slate-900 font-bold hover:bg-opacity-90"
              >
                Voltar para Home
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Error Step */}
        {checkout.step === "error" && (
          <Card className="bg-slate-800 border-red-500">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="text-red-500" />
                <CardTitle className="text-red-500">Erro no Pagamento</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-red-500 bg-opacity-10 border border-red-500 p-4 rounded-lg">
                <p className="text-red-400">{checkout.error}</p>
              </div>

              <Button
                onClick={() => setCheckout({ step: "form" })}
                className="w-full bg-neon-green text-slate-900 font-bold hover:bg-opacity-90"
              >
                Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
