# Essencial - E-commerce de Produtos de Beleza

Um e-commerce moderno e profissional especializado em produtos de beleza e cosméticos, desenvolvido com as melhores práticas e tecnologias atuais.

![Status do Projeto](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![Licença](https://img.shields.io/badge/Licença-MIT-green)

## 🚀 Funcionalidades

- 🛍️ Catálogo de produtos com filtros avançados
- 🛒 Carrinho de compras
- 💳 Sistema de pagamento integrado com Mercado Pago
- 👤 Autenticação de usuários (Email/Senha, Google)
- 📊 Painel administrativo
- ⭐ Sistema de avaliações
- 📱 Design responsivo
- 🔍 SEO otimizado

## 🛠️ Tecnologias Utilizadas

- [Next.js 14](https://nextjs.org/) - Framework React com SSR
- [TypeScript](https://www.typescriptlang.org/) - Superset JavaScript
- [TailwindCSS](https://tailwindcss.com/) - Framework CSS
- [Prisma](https://www.prisma.io/) - ORM
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados
- [NextAuth.js](https://next-auth.js.org/) - Autenticação
- [Redux Toolkit](https://redux-toolkit.js.org/) - Gerenciamento de estado
- [Mercado Pago](https://www.mercadopago.com.br/) - Gateway de pagamento

## 📋 Pré-requisitos

- Node.js 18.17 ou superior
- NPM ou Yarn
- PostgreSQL
- Git

## 🚀 Instalação e Execução

1. Clone o repositório
```bash
git clone [URL_DO_REPOSITÓRIO]
cd essencial
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Execute as migrações do banco de dados
```bash
npx prisma migrate dev
```

5. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

## 🗂️ Estrutura do Projeto

```
src/
  ├── app/           # Rotas e layouts da aplicação
  ├── components/    # Componentes React reutilizáveis
  ├── lib/          # Utilitários e configurações
  ├── store/        # Configuração do Redux
  ├── types/        # Definições de tipos TypeScript
  ├── hooks/        # Hooks personalizados
  ├── services/     # Serviços e integrações
  ├── utils/        # Funções utilitárias
  └── styles/       # Estilos globais
```

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm start` - Inicia o servidor de produção
- `npm test` - Executa os testes
- `npm run lint` - Executa o linter

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📫 Contato

Wendell Bernini

Link do Projeto: [https://github.com/wendellbernini/essencial](https://github.com/wendellbernini/essencial)
