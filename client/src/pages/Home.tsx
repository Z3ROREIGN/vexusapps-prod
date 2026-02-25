import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Zap, Shield, Cpu, CreditCard, ArrowRight } from "lucide-react";
import { useState } from "react";

/**
 * VexusApps Home Page
 * Design: Dark tech aesthetic with neon green accents (Storm Applications inspired)
 * Color Palette: Dark navy/black background (#0f172a) with neon green (#d4ff00)
 * Typography: Poppins for headers, clean and modern
 * Layout: Asymmetric hero with products grid and payment integration showcase
 */

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const products = [
    {
      id: "automation",
      name: "Automação de Vendas",
      description: "Sistema completo de automação para vender produtos digitais 24/7",
      price: "R$ 29,90",
      features: ["Vendas automáticas", "Gestão de estoque", "Entrega instantânea", "Relatórios em tempo real"],
      icon: "⚡"
    },
    {
      id: "gateway",
      name: "Gateway MisticPay",
      description: "Receba pagamentos via PIX com aprovação automática",
      price: "R$ 19,90",
      features: ["PIX integrado", "Auto aprovação", "Webhooks em tempo real", "Suporte 24/7"],
      icon: "💳"
    },
    {
      id: "dashboard",
      name: "Dashboard Inteligente",
      description: "Painel de controle completo para gerenciar seu negócio",
      price: "R$ 39,90",
      features: ["Analytics avançado", "Gráficos em tempo real", "Exportação de dados", "API REST"],
      icon: "📊"
    }
  ];

  const handleCheckout = (productId: string) => {
    setSelectedProduct(productId);
    // Scroll to payment section
    setTimeout(() => {
      const paymentSection = document.getElementById("payment-section");
      paymentSection?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img 
              src="https://private-us-east-1.manuscdn.com/sessionFile/GsS744heNXbVvIqZscrjla/sandbox/KaaKTxIrt5LQUK727e4wQK-img-1_1771980173000_na1fn_dmV4dXNhcHBzLWxvZ28.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvR3NTNzQ0aGVOWGJWdklxWnNjcmpsYS9zYW5kYm94L0thYUtUeElydDVMUVVLNzI3ZTR3UUstaW1nLTFfMTc3MTk4MDE3MzAwMF9uYTFmbl9kbVY0ZFhOaGNIQnpMV3h2WjI4LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Sv3pV3QXxWS8XSAqaA-A5ObcCsMF4EB8fIDCMU8edFDEJQ3Fo0emoRyS9kwfvWTu~Mkhnfda6hWRFuu9vEUwNvxDheNFk9cE8YsrBBTSHCN-hHmtjqS13a8caMnSwDQtZO9f6uTST1UVCEmKeBJoulbQpfg~Wm-1vT1zQXp4niBvzSm9J1B0OpaBW2zhMPqwYUXkx7fmj5PQe6Y5ctQEKObInSYyfDrNUNK7c~n6f2vKzRJO0yETOGXkGydvZL7gkqPig8xoGZtLxVVGof5BccggcWQn7ZiS7SUltkQVFSkr0Vukw5J~cO9OzdtD9mfXrV6XaM~EcjG83qI~h-JONQ__"
              alt="VexusApps"
              className="h-8 w-8"
            />
            <span className="text-lg font-bold gradient-neon">VexusApps</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#products" className="text-sm hover:text-accent transition-colors">Produtos</a>
            <a href="#payment-section" className="text-sm hover:text-accent transition-colors">Pagamento</a>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Começar</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://private-us-east-1.manuscdn.com/sessionFile/GsS744heNXbVvIqZscrjla/sandbox/KaaKTxIrt5LQUK727e4wQK-img-2_1771980176000_na1fn_aGVyby1iYWNrZ3JvdW5k.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvR3NTNzQ0aGVOWGJWdklxWnNjcmpsYS9zYW5kYm94L0thYUtUeElydDVMUVVLNzI3ZTR3UUstaW1nLTJfMTc3MTk4MDE3NjAwMF9uYTFmbl9hR1Z5YnkxaVlXTnJaM0p2ZFc1ay5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=b94v-B3HBh-q6WjezvzwnXNJObmSdrgMN0Ze~83-CmnBw1q52dHkLbi5UecF-ydj-iNlgSidWlKRKrKWllx8HWwhsU66azSR4JRALNgAbGTUqs24XuvnP7lPDx4Yk8HaRV-aT7U8VF5xyYusHTtt81nQ6pGogFfxbizLp6vdgzizBhRELNE6sGhX2F3HuZblUtk5xs~dO8RdJvkTjgdTCam0LEdv-NezMIYObejY~pKm4LL5uT-9OM6dqGlAylfyRMjEDM6dotWnH5LkxJmba0-xf2Php~20kIWMNdkno5LSG7HMzNmVLGpT7rZCCuHC7FzJq9hRu0cO4NVbATVBmw__')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Automação de <span className="gradient-neon">Vendas</span> Inteligente
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Venda produtos digitais 24/7 com automação completa. Sistema de pagamento MisticPay integrado com aprovação automática e gestão inteligente de estoque.
            </p>
            <div className="flex gap-4 flex-wrap">
              <a href="/checkout">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                Começar Agora <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
              <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10">
                Ver Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/50">
        <div className="container">
          <h2 className="text-4xl font-bold mb-12 text-center">Por que escolher VexusApps?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Automação Total", desc: "Configure uma vez e deixe rodar 24/7" },
              { icon: Shield, title: "Segurança", desc: "Criptografia de ponta a ponta" },
              { icon: Cpu, title: "Inteligente", desc: "IA para otimizar suas vendas" }
            ].map((feature, i) => (
              <Card key={i} className="bg-background border-border hover:border-accent/50 transition-colors">
                <CardHeader>
                  <feature.icon className="w-8 h-8 text-accent mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20">
        <div className="container">
          <h2 className="text-4xl font-bold mb-12 text-center">Nossos Produtos</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card 
                key={product.id}
                className={`bg-background border-border hover:border-accent/50 transition-all cursor-pointer ${
                  selectedProduct === product.id ? 'border-accent glow-accent' : ''
                }`}
                onClick={() => setSelectedProduct(product.id)}
              >
                <CardHeader>
                  <div className="text-4xl mb-2">{product.icon}</div>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <p className="text-2xl font-bold text-accent mb-4">{product.price}</p>
                    <ul className="space-y-2">
                      {product.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-accent" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a href="/checkout" className="w-full">
                    <Button 
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      Comprar Agora
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Section */}
      <section id="payment-section" className="py-20 bg-card/50">
        <div className="container">
          <h2 className="text-4xl font-bold mb-12 text-center">Gateway de Pagamento</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">MisticPay - Receba Pagamentos</h3>
              <p className="text-muted-foreground mb-6">
                Integração completa com MisticPay para receber pagamentos via PIX com aprovação automática. 
                Sem necessidade de configurações complexas, tudo funciona automaticamente.
              </p>
              <ul className="space-y-3">
                {[
                  "PIX com aprovação automática",
                  "Webhooks em tempo real",
                  "Suporte 24/7",
                  "Taxa competitiva",
                  "Recebimento em D+1"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-background rounded-lg p-8 border border-border glow-accent-lg">
              <img 
                src="https://private-us-east-1.manuscdn.com/sessionFile/GsS744heNXbVvIqZscrjla/sandbox/KaaKTxIrt5LQUK727e4wQK-img-3_1771980171000_na1fn_cGF5bWVudC1nYXRld2F5LWljb24.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvR3NTNzQ0aGVOWGJWdklxWnNjcmpsYS9zYW5kYm94L0thYUtUeElydDVMUVVLNzI3ZTR3UUstaW1nLTNfMTc3MTk4MDE3MTAwMF9uYTFmbl9jR0Y1YldWdWRDMW5ZWFJsZDJGNUxXbGpiMjQucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=p2v0hAiRXcv3xPXtQrRRmiZIEkuNySzJoKeLcBmZ1Hm6EcHnm4SUJKg5eV4FCKCEV0ML~FBkG9ToxsNoMGqlluDoXuacE6qQiH9fzdat4JPh7PH8wDXN8VsHdfc1CSDUlmjPs57pkV7bPeLBY5h2TnOMOVLqyCJWGS-ukDJavW3zD7cZ5CbgJp8FWwpepVO1C547UMXRha812IH4~aIclyIOHee-0lSeydUSpfahp4fgF0kh2CJXO0jBKyuzTc5GMt5lNnaDkNbmaWSvaU7BA4x9YhYq5L1D7lqwhsDRiL~cBHazXQGUQBS3cxvGENAHR64F4t5B6A-iF9kMIzfH-Q__"
                alt="MisticPay Gateway"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-accent/10 to-accent/5 border-t border-b border-accent/20">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Pronto para começar?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de vendedores que já estão automatizando suas vendas com VexusApps.
          </p>
          <a href="/checkout">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
              Criar Conta Grátis <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">VexusApps</h4>
              <p className="text-sm text-muted-foreground">Automação de vendas inteligente para o seu negócio.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors">Recursos</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Termos</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 VexusApps. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
