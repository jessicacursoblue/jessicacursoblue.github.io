# NutriAthlete AI - Plataforma SaaS de Nutrição Esportiva com IA

Uma plataforma completa para gestão de atletas com dietas personalizadas geradas por inteligência artificial, acompanhamento de evolução corporal e otimização de performance esportiva.

![Status](https://img.shields.io/badge/status-development-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

## 🚀 Funcionalidades

- **🤖 Dieta com IA**: Geração automática de planos alimentares baseados em peso, altura e objetivo
- **📊 Relatórios de Evolução**: Acompanhamento gráfico de peso, IMC e desempenho ao longo do tempo
- **👥 Gestão de Atletas**: Cadastro completo com histórico alimentar e acompanhamento individual
- **💳 Gestão Financeira**: Controle de assinaturas e pagamentos integrado com Stripe
- **🔐 Autenticação Segura**: JWT + Cookies HTTP-only com role-based access control
- **📱 Multi-tenant**: Cada organização tem seus dados completamente isolados

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Estilos**: Tailwind CSS
- **Banco de Dados**: PostgreSQL com Drizzle ORM
- **Autenticação**: JWT + Cookies
- **Pagamentos**: Stripe
- **IA**: Vercel AI SDK
- **Deploy**: Vercel

## 📦 Começar

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+ ou Supabase
- npm/pnpm/yarn

### Instalação Rápida

```bash
# 1. Clone
git clone https://github.com/jessicacursoblue/jessicacursoblue.github.io.git
cd jessicacursoblue.github.io

# 2. Instale dependências
npm install

# 3. Configure ambiente
cp .env.example .env.local
# Edite .env.local com suas configurações

# 4. Configure banco de dados
npm run db:push

# 5. Inicie desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📚 Documentação

- [**SETUP.md**](./SETUP.md) - Guia detalhado de instalação e configuração
- [**ARCHITECTURE.md**](./ARCHITECTURE.md) - Arquitetura do sistema e decisões técnicas
- [**API.md**](./API.md) - Documentação completa dos endpoints
- [**DATABASE.md**](./DATABASE.md) - Schema do banco de dados

## 🏗️ Estrutura do Projeto

```
/app
  /(auth)          # Páginas de autenticação (login, registro)
  /(dashboard)     # Dashboard protegido
  /api             # API endpoints
/lib
  /auth            # Funções de autenticação
  /db              # Database schema e utilities
/components        # Componentes React reutilizáveis
/public            # Assets estáticos
```

## 🔐 Segurança

- ✅ Passwords hasheadas com bcrypt
- ✅ JWT tokens com expiração
- ✅ HTTP-only cookies
- ✅ CSRF protection
- ✅ SQL injection prevention
- ✅ Rate limiting em endpoints sensíveis
- ✅ Row-level security no banco de dados

## 📈 Roadmap

### Phase 1: Foundation ✅
- [x] Setup Next.js com TypeScript
- [x] Autenticação básica
- [x] Database schema
- [x] Landing page

### Phase 2: Core Features 🚧
- [ ] CRUD de atletas
- [ ] Integração com IA para gerar dietas
- [ ] Acompanhamento de progresso
- [ ] Dashboard com charts

### Phase 3: Monetização 📋
- [ ] Integração Stripe
- [ ] Planos de subscription
- [ ] Billing page
- [ ] Enforcement de limites por plano

### Phase 4: Production 🎯
- [ ] Testes completos
- [ ] Performance optimization
- [ ] Documentation completa
- [ ] Deploy em produção

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👤 Autor

**Jessica Pereira**
- GitHub: [@jessicacursoblue](https://github.com/jessicacursoblue)
- Email: jessica@nutriathlete.ai

## 📞 Suporte

Para dúvidas ou issues:
- Abra uma issue no [GitHub](https://github.com/jessicacursoblue/jessicacursoblue.github.io/issues)
- Email: jessica@nutriathlete.ai

## 🙏 Agradecimentos

- [Vercel](https://vercel.com) - Deployment e AI SDK
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Drizzle ORM](https://orm.drizzle.team) - Database ORM
- Community Open Source

---

**Desenvolvido com ❤️ para atletas e profissionais de nutrição esportiva**
