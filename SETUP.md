# Setup Guide - NutriAthlete AI

## Pré-requisitos

- Node.js 18+ (recomendado 20+)
- PostgreSQL 14+ ou Supabase
- npm, yarn, pnpm, ou bun
- Git

## Instalação Local

### 1. Clone o repositório

```bash
git clone https://github.com/jessicacursoblue/jessicacursoblue.github.io.git
cd jessicacursoblue.github.io
```

### 2. Instale dependências

```bash
npm install
# ou
pnpm install
```

### 3. Configure variáveis de ambiente

Copie `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Preencha os valores:

```env
# Database (use Supabase ou PostgreSQL local)
DATABASE_URL=postgresql://user:password@localhost:5432/nutriathlete

# JWT Secret (gere com: openssl rand -base64 32)
NEXTAUTH_SECRET=seu-secret-de-32-caracteres

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe (obtenha em stripe.com/dashboard)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Setup do Banco de Dados

#### Opção A: Supabase (Recomendado para produção)

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Copie a connection string para `DATABASE_URL`
4. Execute as migrações:

```bash
npm run db:push
```

#### Opção B: PostgreSQL Local

1. Instale PostgreSQL
2. Crie um banco:

```bash
createdb nutriathlete
```

3. Configure `DATABASE_URL` com sua connection string
4. Execute migrações:

```bash
npm run db:push
```

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Estrutura de Pastas

```
/app                    # Next.js App Router
  /(auth)/             # Rotas de autenticação
  /(dashboard)/        # Rotas protegidas do dashboard
  /api                 # API endpoints
/lib
  /auth                # Lógicas de autenticação
  /db                  # Database schema e client
/components            # Componentes React reutilizáveis
/public                # Arquivos estáticos
```

## Scripts Disponíveis

```bash
npm run dev              # Inicia servidor de desenvolvimento
npm run build            # Build para produção
npm run start            # Inicia servidor de produção
npm run lint             # Executa ESLint
npm run db:push          # Sincroniza schema com banco (Drizzle)
npm run db:migrate       # Executa migrações
npm run db:studio        # Abre Drizzle Studio (UI do banco)
```

## Variáveis de Ambiente Explicadas

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | Connection string do PostgreSQL | `postgresql://...` |
| `NEXTAUTH_SECRET` | Secret para JWT (min 32 chars) | `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | URL da aplicação | `http://localhost:3000` |
| `STRIPE_PUBLIC_KEY` | Chave pública Stripe | `pk_test_...` |
| `STRIPE_SECRET_KEY` | Chave secreta Stripe | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Secret do webhook Stripe | `whsec_...` |
| `AI_GATEWAY_API_KEY` | Chave do Vercel AI Gateway (opcional) | `xyz123...` |

## Fluxo de Primeiro Uso

1. Acesse a aplicação: http://localhost:3000
2. Clique em "Começar Agora" ou navegue para `/auth/register`
3. Crie uma conta com email e senha
4. Você será redirecionado para o dashboard
5. Comece a adicionar atletas e gerar dietas

## Debugging

### Habilitando Debug Logs

A aplicação usa `console.log("[v0] ...")` para debug:

```typescript
console.log("[v0] Dados recebidos:", data)
```

Veja logs no terminal durante desenvolvimento.

### Verificando o Banco de Dados

Use Drizzle Studio para visualizar e editar dados:

```bash
npm run db:studio
```

Abre uma UI em http://local.drizzle.studio

### Problemas Comuns

**Erro: "DATABASE_URL is not defined"**
- Verifique se `.env.local` existe e contém `DATABASE_URL`
- Certifique-se de reiniciar o servidor após alterar `.env.local`

**Erro: "NEXTAUTH_SECRET is required"**
- Gere com: `openssl rand -base64 32`
- Ou crie manualmente uma string com 32+ caracteres

**Erro de conexão ao banco**
- Verifique se PostgreSQL está rodando
- Teste a connection string com: `psql <DATABASE_URL>`

## Deployment

### Vercel (Recomendado)

1. Push o código para GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Importe o repositório
4. Configure variáveis de ambiente no Vercel
5. Deploy automaticamente

### Outras Plataformas

Veja [DEPLOYMENT.md](./DEPLOYMENT.md) para Railway, Render, etc.

## Próximas Etapas

- [ ] Implement athlete management CRUD
- [ ] Setup AI diet generation
- [ ] Integrate Stripe billing
- [ ] Add progress tracking
- [ ] Create admin dashboard
- [ ] Write tests
- [ ] Setup CI/CD
- [ ] Deploy to production

## Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Contacte: jessica@nutriathlete.ai
