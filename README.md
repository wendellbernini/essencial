# Essencial - E-commerce de Produtos de Beleza

Um e-commerce moderno e profissional especializado em produtos de beleza e cosméticos.

## Tecnologias Utilizadas

- Next.js 14
- TypeScript
- TailwindCSS
- Prisma (ORM)
- PostgreSQL
- NextAuth.js
- Redux Toolkit
- Mercado Pago
- Jest & React Testing Library

## Funcionalidades Principais

- Catálogo de produtos com filtros avançados
- Carrinho de compras
- Sistema de pagamento integrado com Mercado Pago
- Autenticação de usuários
- Painel administrativo
- Sistema de avaliações
- Blog de conteúdo
- Notificações por e-mail
- Design responsivo
- SEO otimizado

## Pré-requisitos

- Node.js 18.17 ou superior
- NPM ou Yarn
- PostgreSQL

## Como Iniciar o Projeto

1. Clone o repositório
```bash
git clone [URL_DO_REPOSITÓRIO]
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

4. Execute as migrações do banco de dados
```bash
npx prisma migrate dev
```

5. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm start` - Inicia o servidor de produção
- `npm test` - Executa os testes
- `npm run lint` - Executa o linter

## Estrutura do Projeto

```
src/
  ├── app/           # Rotas e layouts da aplicação
  ├── components/    # Componentes React reutilizáveis
  ├── lib/          # Utilitários e configurações
  ├── store/        # Configuração do Redux
  ├── types/        # Definições de tipos TypeScript
  └── utils/        # Funções utilitárias
```

## Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.
