# VexusApps - Automação de Vendas e Produtos Digitais

Plataforma completa de automação de vendas com integração MisticPay, design inspirado em Storm Applications e hospedagem em Cloudflare Workers.

## 🎯 Características

- **Automação de Vendas 24/7**: Venda produtos digitais automaticamente
- **Gateway MisticPay**: Receba pagamentos via PIX com aprovação automática
- **Dashboard Inteligente**: Painel de controle completo com analytics
- **Design Moderno**: Interface dark tech com neon verde (Storm Applications inspired)
- **Banco de Dados**: Cloudflare D1 para armazenamento de dados
- **Cache Inteligente**: Cloudflare KV para performance otimizada
- **API RESTful**: Endpoints para integração com terceiros

## 🚀 Quick Start

### Desenvolvimento Local

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev

# Abrir em http://localhost:3000
```

### Build para Produção

```bash
# Compilar projeto
pnpm build

# Testar build localmente
pnpm preview
```

## 📦 Produtos Disponíveis

### 1. Automação de Vendas - R$ 29,90
- Vendas automáticas 24/7
- Gestão de estoque inteligente
- Entrega instantânea de produtos
- Relatórios em tempo real

### 2. Gateway MisticPay - R$ 19,90
- PIX integrado com aprovação automática
- Webhooks em tempo real
- Suporte 24/7
- Taxa competitiva

### 3. Dashboard Inteligente - R$ 39,90
- Analytics avançado
- Gráficos em tempo real
- Exportação de dados
- API REST completa

## 🔐 Integração MisticPay

### Credenciais
- **Client ID**: `ci_nsq9oxmeym2gp2y`
- **Client Secret**: `cs_qwrpnqcfpi4n8z097p9avl36q`

### Fluxo de Pagamento

1. Cliente acessa `/checkout`
2. Preenche formulário com nome, email e produto
3. Sistema cria transação via MisticPay API
4. QR Code e Chave PIX são exibidos
5. Cliente escaneia ou copia a chave
6. Sistema verifica status a cada 2 segundos
7. Pagamento aprovado automaticamente
8. Ordem é criada no banco de dados

### Endpoints MisticPay

**Gerar Transação**
```
POST https://api.misticpay.com/api/gerar-transacao
Headers:
  Client-ID: ci_nsq9oxmeym2gp2y
  Client-Secret: cs_qwrpnqcfpi4n8z097p9avl36q
  Content-Type: application/json
```

**Verificar Transação**
```
GET https://api.misticpay.com/api/verificar-transacao?id={transactionId}
Headers:
  Client-ID: ci_nsq9oxmeym2gp2y
  Client-Secret: cs_qwrpnqcfpi4n8z097p9avl36q
```

## 🗄️ Banco de Dados (Cloudflare D1)

### Tabelas Principais

- **customers**: Informações dos clientes
- **products**: Produtos disponíveis
- **transactions**: Transações MisticPay
- **orders**: Pedidos realizados
- **webhook_logs**: Log de webhooks

### Criar Database

```bash
wrangler d1 create vexusapps
wrangler d1 execute vexusapps --file schema.sql
```

## 📁 Estrutura do Projeto

```
vexusapps-site/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx          # Página inicial
│   │   │   ├── Checkout.tsx      # Página de checkout
│   │   │   └── NotFound.tsx      # 404
│   │   ├── lib/
│   │   │   └── misticpay.ts      # Integração MisticPay
│   │   ├── components/           # Componentes UI
│   │   ├── contexts/             # React contexts
│   │   ├── App.tsx               # App principal
│   │   ├── main.tsx              # Entry point
│   │   └── index.css             # Estilos globais
│   ├── public/                   # Assets estáticos
│   └── index.html                # HTML template
├── server/
│   └── index.ts                  # Express server
├── schema.sql                    # Schema D1
├── wrangler.toml                 # Config Cloudflare
├── CLOUDFLARE_SETUP.md           # Guia de setup
└── package.json
```

## 🎨 Design

### Paleta de Cores
- **Background**: `#0f172a` (Dark Navy)
- **Accent**: `#d4ff00` (Neon Green)
- **Secondary**: `#b8e600` (Green)
- **Text**: `#f1f5f9` (Light Gray)

### Tipografia
- **Headers**: Poppins Bold
- **Body**: Poppins Regular
- **Mono**: Space Mono

### Componentes
- Utiliza shadcn/ui
- Tailwind CSS 4
- Lucide Icons
- Framer Motion

## 📱 Responsividade

- Mobile-first design
- Breakpoints: 640px, 1024px, 1280px
- Touch-friendly interfaces
- Otimizado para todos os dispositivos

## 🔧 Configuração

### Variáveis de Ambiente

```env
# MisticPay
VITE_MISTICPAY_CLIENT_ID=ci_nsq9oxmeym2gp2y
VITE_MISTICPAY_CLIENT_SECRET=cs_qwrpnqcfpi4n8z097p9avl36q

# Cloudflare
CLOUDFLARE_ACCOUNT_ID=seu-account-id
CLOUDFLARE_API_TOKEN=seu-api-token
```

### Secrets do Cloudflare

```bash
wrangler secret put MISTICPAY_CLIENT_ID
wrangler secret put MISTICPAY_CLIENT_SECRET
```

## 🚀 Deploy

### Cloudflare Workers

```bash
# Deploy para produção
wrangler deploy

# Deploy com staging
wrangler deploy --env production

# Verificar status
wrangler deployments list
```

### Custom Domain

1. Configure em `wrangler.toml`:
```toml
route = "vexusapps.shop/*"
zone_id = "seu-zone-id"
```

2. Configure DNS no Cloudflare:
```
CNAME vexusapps.shop → seu-worker.workers.dev
```

## 📊 Monitoramento

### Logs em Tempo Real
```bash
wrangler tail
```

### Verificar Database
```bash
wrangler d1 execute vexusapps --command "SELECT COUNT(*) FROM transactions"
```

### Verificar KV Cache
```bash
wrangler kv:key list --namespace-id=seu-kv-id
```

## 🔄 Webhook MisticPay

Configure no dashboard MisticPay:
- **URL**: `https://vexusapps.shop/api/webhook/misticpay`
- **Eventos**: `payment.approved`, `payment.rejected`, `payment.expired`

## 🛠️ Troubleshooting

### Erro: "MisticPay API error"
- Verifique Client ID e Secret
- Confirme que a transação não expirou
- Verifique se auto-aprovação está ativada

### Erro: "Database not found"
- Execute: `wrangler d1 list`
- Confirme database_id em wrangler.toml

### Erro: "Payment timeout"
- Verifique conexão com MisticPay
- Confirme que o webhook está configurado
- Verifique logs do Worker

## 📝 Licença

Proprietary - VexusApps 2026

## 👥 Suporte

- Documentação: [CLOUDFLARE_SETUP.md](./CLOUDFLARE_SETUP.md)
- MisticPay Docs: https://docs.misticpay.com
- Cloudflare Docs: https://developers.cloudflare.com

## 🎉 Features Futuras

- [ ] Dashboard de admin
- [ ] Autenticação OAuth
- [ ] Relatórios avançados
- [ ] Integração com múltiplos gateways
- [ ] Automação de email
- [ ] API pública
- [ ] Mobile app

---

**VexusApps** - Automação Inteligente de Vendas
