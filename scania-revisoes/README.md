### Scania Revisões

App de agendamento de revisões para caminhões nas concessionárias Scania, com programa de pontos e resgate de brindes.

#### Stack
- Next.js 14 (App Router, Server Actions)
- TypeScript
- Tailwind CSS
- Prisma + SQLite

#### Configuração
1. Copie o arquivo `.env.example` para `.env` e ajuste se necessário.
2. Instale dependências:
   - npm install
3. Crie o banco de dados e gere o cliente Prisma:
   - npm run db:push
4. Rode o seed (opcional, cria concessionárias, brindes e um usuário demo `demo@scania.com`):
   - npm run db:seed
5. Inicie o servidor de desenvolvimento:
   - npm run dev

Abra `http://localhost:3000`.

Faça login com seu nome e e-mail na página `/login`. Cadastre caminhões, agende revisões e resgate brindes.

#### Scripts
- `npm run dev` - Desenvolvimento
- `npm run build` - Build produção
- `npm run start` - Start produção
- `npm run db:push` - Sincroniza schema com SQLite
- `npm run db:seed` - Popula dados iniciais

#### Observações
- Pontos: +50 por agendamento criado. Resgates debitam do saldo.
- Este é um MVP. Em produção, use autenticação robusta (por ex. OAuth/NextAuth) e regras de negócio mais detalhadas (pontos por tipo de serviço, confirmação de agendamento, etc.).