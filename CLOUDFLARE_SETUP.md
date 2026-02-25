# VexusApps - Cloudflare Setup Guide

Este guia descreve como configurar o VexusApps no Cloudflare Workers com D1 Database e integração MisticPay.

## Pré-requisitos

- Conta Cloudflare com acesso a Workers e D1
- Wrangler CLI instalado (`npm install -g wrangler`)
- Credenciais MisticPay (Client ID e Secret)

## Passos de Setup

### 1. Criar D1 Database

```bash
# Criar novo banco de dados
wrangler d1 create vexusapps

# Aplicar schema SQL
wrangler d1 execute vexusapps --file schema.sql
```

### 2. Criar KV Namespace para Cache

```bash
# Criar namespace
wrangler kv:namespace create "CACHE"

# Copiar o ID para wrangler.toml
```

### 3. Configurar Secrets

```bash
# Adicionar credenciais MisticPay
wrangler secret put MISTICPAY_CLIENT_ID
# Cole: ci_nsq9oxmeym2gp2y

wrangler secret put MISTICPAY_CLIENT_SECRET
# Cole: cs_qwrpnqcfpi4n8z097p9avl36q
```

### 4. Atualizar wrangler.toml

Edite `wrangler.toml` com:

```toml
account_id = "seu-account-id"
zone_id = "seu-zone-id"  # Se usando custom domain

[[d1_databases]]
binding = "DB"
database_name = "vexusapps"
database_id = "seu-database-id"

[[kv_namespaces]]
binding = "CACHE"
id = "seu-kv-id"
preview_id = "seu-preview-id"
```

### 5. Deploy para Cloudflare Workers

```bash
# Build do projeto
npm run build

# Deploy
wrangler deploy

# Ou deploy com staging
wrangler deploy --env production
```

## Estrutura do Projeto

```
vexusapps-site/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas (Home, Checkout)
│   │   ├── lib/
│   │   │   └── misticpay.ts  # Integração MisticPay
│   │   └── components/    # Componentes UI
│   └── public/            # Assets estáticos
├── server/                # Backend Express (placeholder)
├── schema.sql             # Schema D1
├── wrangler.toml          # Configuração Cloudflare
└── package.json
```

## Integração MisticPay

### Fluxo de Pagamento

1. **Cliente preenche formulário** → `/checkout`
2. **Criar transação** → `POST /api/gerar-transacao`
   - Envia: nome, email, valor, descrição
   - Retorna: QR Code, Chave PIX, ID da transação
3. **Cliente escaneia QR ou copia chave PIX**
4. **Sistema verifica status** → `GET /api/verificar-transacao`
   - Polling a cada 2 segundos
   - Auto-aprovação configurada no MisticPay
5. **Pagamento aprovado** → Criar ordem no D1
6. **Webhook recebido** → Atualizar status no D1

### Endpoints da API

#### Gerar Transação
```
POST https://api.misticpay.com/api/gerar-transacao
Headers:
  - Client-ID: ci_nsq9oxmeym2gp2y
  - Client-Secret: cs_qwrpnqcfpi4n8z097p9avl36q
  - Content-Type: application/json

Body:
{
  "valor": 29.90,
  "descricao": "Automação de Vendas",
  "email_cliente": "cliente@email.com",
  "nome_cliente": "João Silva",
  "id_externo": "automation",
  "url_webhook": "https://vexusapps.shop/api/webhook/misticpay"
}

Response:
{
  "id": "txn_abc123",
  "qr_code": "base64_encoded_qr",
  "chave_pix": "00020126580014br.gov.bcb.brcode...",
  "status": "pendente",
  "criado_em": "2026-02-24T19:00:00Z",
  "expira_em": "2026-02-24T20:00:00Z"
}
```

#### Verificar Transação
```
GET https://api.misticpay.com/api/verificar-transacao?id=txn_abc123
Headers:
  - Client-ID: ci_nsq9oxmeym2gp2y
  - Client-Secret: cs_qwrpnqcfpi4n8z097p9avl36q

Response:
{
  "id": "txn_abc123",
  "status": "aprovado",
  "valor": 29.90,
  "criado_em": "2026-02-24T19:00:00Z",
  "aprovado_em": "2026-02-24T19:05:00Z"
}
```

## Webhook MisticPay

Configure no dashboard MisticPay:
- URL: `https://vexusapps.shop/api/webhook/misticpay`
- Eventos: `payment.approved`, `payment.rejected`, `payment.expired`

## Auto-Aprovação

A auto-aprovação é configurada no dashboard MisticPay:
1. Acesse: https://dashboard.misticpay.com
2. Vá para: Configurações → Automação
3. Ative: "Auto-aprovar pagamentos PIX"
4. Defina limite: R$ 10.000,00 (ou conforme necessário)

## Monitoramento

### Verificar logs do D1
```bash
wrangler d1 execute vexusapps --command "SELECT * FROM transactions LIMIT 10"
```

### Verificar KV Cache
```bash
wrangler kv:key list --namespace-id=seu-kv-id
```

### Logs do Worker
```bash
wrangler tail
```

## Troubleshooting

### Erro: "OAuth authentication failed"
- Verifique se está logado: `wrangler login`
- Verifique credenciais do Cloudflare

### Erro: "Database not found"
- Confirme que D1 foi criado: `wrangler d1 list`
- Verifique database_id em wrangler.toml

### Erro: "MisticPay API error"
- Verifique Client ID e Secret
- Confirme que a URL da API está correta
- Verifique se a transação expirou (5 minutos)

## Próximos Passos

1. **Configurar domínio customizado**
   - Adicione em wrangler.toml: `route = "vexusapps.shop/*"`
   - Configure DNS no Cloudflare

2. **Implementar dashboard de admin**
   - Listar transações
   - Exportar relatórios
   - Gerenciar produtos

3. **Adicionar autenticação**
   - OAuth com Cloudflare
   - JWT tokens
   - Sessões seguras

4. **Otimizar performance**
   - Cache com KV
   - Compressão de assets
   - CDN global

## Suporte

Para dúvidas:
- MisticPay: https://docs.misticpay.com
- Cloudflare: https://developers.cloudflare.com
- GitHub Issues: [seu-repositório]
