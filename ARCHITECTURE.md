# NutriAthlete AI - Arquitetura do Sistema

## Visão Geral

NutriAthlete AI é uma plataforma SaaS multi-tenant de gestão de nutrição esportiva e Jiu-Jitsu com inteligência artificial. A plataforma permite que coaches e profissionais de nutrição gerenciem múltiplos atletas, gerem dietas personalizadas com IA e acompanhem a evolução de cada um.

## Pilares Arquiteturais

### 1. Multi-Tenant Architecture
- **Isolamento de Dados**: Cada organização (coach, clínica) tem seu próprio espaço isolado
- **Row-Level Security**: Implementado no banco de dados para garantir segurança em nível de linha
- **Segregação Lógica**: Todas as queries filtram por `organization_id`

### 2. Camadas da Aplicação

```
Frontend (Next.js 15 + React)
    ↓
API Routes (Next.js)
    ↓
Services (Lógica de Negócio)
    ↓
Database (PostgreSQL + Drizzle ORM)
```

### 3. Autenticação e Autorização
- **JWT**: Tokens JWT para autenticação stateless
- **Cookies Seguros**: HTTP-only, Secure, SameSite
- **RBAC**: Role-Based Access Control com roles: Admin, Coach, Athlete, Viewer

### 4. Modelos de Dados Principais

**Users**: Usuários do sistema
**Organizations**: Grupos de trabalho (coaches, clínicas)
**Athletes**: Atletas gerenciados por uma organização
**Diets**: Planos nutricionais gerados por IA
**ProgressRecords**: Histórico de peso e métricas
**Subscriptions**: Informações de faturamento e plano

## Fluxo de Dados

### Registro
1. Usuário acessa `/auth/register`
2. Preenche nome, email, senha
3. POST para `/api/auth/register`
4. Sistema cria usuário + organização padrão
5. JWT token criado e salvo em cookie
6. Redireciona para `/dashboard`

### Login
1. Usuário acessa `/auth/login`
2. Insere credenciais
3. POST para `/api/auth/login`
4. Verifica credenciais com bcrypt
5. JWT token criado se válido
6. Redireciona para `/dashboard`

### Gestão de Atletas
1. Coach acessa `/dashboard/athletes`
2. Pode listar, criar, editar, deletar atletas
3. Todos filtrados por `organization_id`
4. API valida autorização do coach

## Segurança

### Práticas Implementadas
- ✅ Passwords hasheadas com bcrypt
- ✅ JWT tokens com expiração
- ✅ HTTP-only cookies
- ✅ HTTPS enforced em produção
- ✅ SQL injection prevention (Drizzle ORM)
- ✅ CSRF protection (SameSite cookies)
- ✅ Rate limiting em endpoints de auth

### Em Progresso
- 🚧 Two-Factor Authentication (2FA)
- 🚧 Email verification
- 🚧 OAuth integrations

## Escalabilidade

### Curto Prazo (0-6 meses)
- Adicionar Redis para caching
- Implementar connection pooling
- Monitoramento com Sentry

### Médio Prazo (6-12 meses)
- Separar backend em serviço independente
- Message queue para operações assíncronas
- CDN para assets estáticos

### Longo Prazo (12+ meses)
- Microservices para IA/ML
- WebSockets para real-time features
- Data warehouse para analytics

## Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 15, React 19, TypeScript |
| Estilos | Tailwind CSS |
| Backend | Next.js API Routes, Node.js |
| Banco | PostgreSQL com Drizzle ORM |
| Auth | JWT + Cookies |
| Pagamentos | Stripe |
| IA | Vercel AI SDK + providers |
| Deploy | Vercel |

## Próximos Passos

1. ✅ Setup inicial + autenticação básica
2. 🚧 Gestão de atletas (CRUD)
3. 🚧 Geração de dietas com IA
4. 🚧 Integração Stripe
5. 🚧 Dashboard com charts
6. 🚧 Documentação completa
