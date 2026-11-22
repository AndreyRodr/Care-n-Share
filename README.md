# 🐊 Care n' Share — Conectando Corações e Causas

> Uma plataforma que aproxima pessoas de organizações sociais, incentivando a solidariedade por meio de doações físicas, voluntariado e compartilhamento de causas.

## 📖 Sobre o projeto

O **Care n' Share** é uma plataforma desenvolvida para conectar pessoas interessadas em ajudar a organizações não governamentais (ONGs), facilitando a divulgação de causas sociais e a realização de contribuições.

A plataforma busca tornar o processo de ajuda mais acessível e transparente, permitindo que organizações divulguem suas necessidades, recebam apoio da comunidade e acompanhem suas contribuições.

A proposta é criar um ambiente em que doadores possam encontrar organizações alinhadas aos seus interesses e contribuir de diferentes maneiras, como por meio de doações de itens físicos e ações voluntárias.

## 🎯 Objetivos

- Aproximar doadores e organizações sociais.
- Dar visibilidade a causas e projetos sociais.
- Facilitar a divulgação de necessidades de arrecadação.
- Permitir o registro e acompanhamento de contribuições.
- Auxiliar organizações no gerenciamento de itens recebidos.
- Incentivar o voluntariado e o engajamento social.
- Promover maior transparência no acompanhamento das atividades.

## ✨ Funcionalidades

### 👤 Usuários

- Cadastro e autenticação.
- Personalização de perfil.
- Compartilhamento e acompanhamento de organizações.
- Seleção de causas de interesse.
- Descoberta de organizações e projetos.
- Recomendações baseadas em interesses.

### 🏢 Organizações (ONGs)

- Cadastro de organizações.
- Processo de verificação cadastral.
- Perfil institucional.
- Divulgação de causas e projetos.
- Publicação de posts e atualizações.
- Criação e divulgação de metas.
- Dashboard para acompanhamento de atividades e contribuições.

### 📦 Doações físicas

- Registro de contribuições de itens físicos.
- Associação de contribuições a organizações e campanhas.
- Acompanhamento do status das contribuições.
- Confirmação de recebimento pela organização.
- Registro de check-in das doações recebidas.

### 📊 Gerenciamento de estoque

- Cadastro de itens no estoque da organização.
- Controle de quantidade disponível.
- Registro de entradas e saídas.
- Histórico de movimentações.
- Acompanhamento de níveis mínimos de estoque.

### 💚 Causas e engajamento

- Cadastro e seleção de causas de interesse.
- Associação de causas a publicações.
- Descoberta de projetos relacionados aos interesses dos usuários.
- Apoio e acompanhamento de organizações.

---

## 🖥️ Tecnologias utilizadas

### Frontend

| Tecnologia   | Utilização                          |
| ------------ | ----------------------------------- |
| React 19     | Construção da interface             |
| Vite         | Ambiente de desenvolvimento e build |
| React Router | Navegação entre páginas             |
| Axios        | Comunicação com a API               |
| Recharts     | Gráficos e visualização de dados    |
| Lucide React | Ícones                              |
| CSS          | Estilização da interface            |

### Backend

| Tecnologia | Utilização                              |
| ---------- | --------------------------------------- |
| Node.js    | Ambiente de execução                    |
| Express 5  | Construção da API REST                  |
| Prisma ORM | Persistência e acesso ao banco de dados |
| PostgreSQL | Banco de dados relacional               |
| JWT        | Autenticação                            |
| Bcrypt     | Hash de senhas                          |
| Zod        | Validação de dados                      |
| Cloudinary | Armazenamento de imagens e documentos   |
| Swagger    | Documentação da API                     |

---

## 🏗️ Arquitetura

O projeto utiliza uma arquitetura dividida entre frontend e backend, com comunicação por meio de uma API REST.

```text
┌──────────────────────────────┐
│           Frontend           │
│         React + Vite         │
│                              │
│  Páginas, componentes,       │
│  formulários e dashboards    │
└──────────────┬───────────────┘
               │
           HTTP / REST
               │
┌──────────────▼───────────────┐
│            Backend           │
│        Node.js + Express     │
│                              │
│  Routes → Controllers        │
│         → Services           │
│         → Repositories       │
└──────────────┬───────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌──────────────┐ ┌──────────────┐
│  PostgreSQL  │ │  Cloudinary  │
│  Prisma ORM  │ │  Arquivos e  │
│              │ │  imagens     │
└──────────────┘ └──────────────┘
```

### Organização do backend

O backend segue uma organização modular, separando responsabilidades entre:

- **Routes:** definição dos endpoints da API.
- **Controllers:** tratamento das requisições e respostas HTTP.
- **Services:** regras de negócio.
- **Repositories:** operações de persistência.
- **Middlewares:** autenticação, autorização e validações.
- **Schemas:** validação dos dados recebidos.
- **Config:** configurações e integrações.

---

## 📂 Estrutura do projeto

```text
Care-n-Share/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── index.js
│   │
│   ├── prisma.config.ts
│   ├── swagger.yaml
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Como executar o projeto localmente

### 📋 Pré-requisitos

Antes de iniciar, é necessário ter instalado:

- [Node.js](https://nodejs.org/) (versão compatível com as dependências atuais)
- npm
- [PostgreSQL](https://www.postgresql.org/)
- Git
- Uma conta no [Cloudinary](https://cloudinary.com/) para funcionalidades de upload

### 1. Clonar o repositório

```bash
git clone https://github.com/AndreyRodr/Care-n-Share.git
cd Care-n-Share
```

### 2. Configurar o banco de dados

Crie um banco de dados PostgreSQL para o projeto.

Exemplo utilizando o PostgreSQL:

```sql
CREATE DATABASE care_n_share;
```

### 3. Configurar o backend

Acesse a pasta do backend:

```bash
cd backend
npm install
```

Crie um arquivo `.env` dentro da pasta `backend`:

```env
PORT=3001
FRONTEND_URL=http://localhost:5173

DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/care_n_share?schema=public"

JWT_SECRET="uma_chave_secreta_forte"

CLOUDINARY_CLOUD_NAME="seu_cloud_name"
CLOUDINARY_API_KEY="sua_api_key"
CLOUDINARY_API_SECRET="seu_api_secret"
```

Substitua os valores pelas configurações do seu ambiente.

### 4. Preparar o Prisma

Ainda dentro da pasta `backend`, execute:

```bash
npx prisma generate
npx prisma migrate dev
```

Esses comandos geram o Prisma Client e aplicam as migrações necessárias ao banco de dados.

### 5. Iniciar o backend

```bash
npm run dev
```

A API estará disponível em:

```text
http://localhost:3001
```

A documentação Swagger poderá ser acessada em:

```text
http://localhost:3001/api-docs
```

### 6. Configurar o frontend

Em outro terminal, retorne à raiz do projeto e acesse a pasta do frontend:

```bash
cd frontend
npm install
```

### 7. Iniciar o frontend

```bash
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:5173
```

O Vite está configurado para encaminhar as requisições que começam com `/api` para o backend local.

---

## 🔌 API

O backend disponibiliza uma API REST para comunicação com o frontend.

Principais grupos de funcionalidades:

| Recurso   | Descrição                              |
| --------- | -------------------------------------- |
| Users     | Cadastro, login, perfis e apoio a ONGs |
| Posts     | Publicações e campanhas                |
| ONG       | Gestão de contribuições e dashboard    |
| Inventory | Controle de estoque e movimentações    |
| Causes    | Causas de interesse                    |
| Admin     | Funcionalidades administrativas        |

A documentação interativa da API está disponível por meio do Swagger:

**Local:** `http://localhost:3001/api-docs`

---

## 🔐 Segurança

O projeto possui mecanismos de segurança, incluindo:

- Autenticação baseada em JWT.
- Hash de senhas utilizando Bcrypt.
- Middlewares de autenticação e autorização.
- Validação de dados de entrada com Zod.
- Controle de acesso a rotas protegidas.
- Processo de verificação de organizações.
- Configuração de CORS.
- Armazenamento externo de imagens e documentos.

---

## 🗺️ Roadmap

O Care n' Share continua em desenvolvimento. Algumas melhorias planejadas incluem:

- [ ] Revisão e fortalecimento dos controles de autorização.
- [ ] Aprimoramento da proteção de dados públicos e privados.
- [ ] Melhorias no fluxo de confirmação de doações físicas.
- [ ] Evolução do controle de estoque e histórico de movimentações.
- [ ] Aprimoramento dos dashboards e indicadores.
- [ ] Melhorias na experiência de busca e descoberta de ONGs.
- [ ] Implementação e ampliação de testes automatizados.
- [ ] Revisão e melhoria da documentação da API.
- [ ] Melhorias de acessibilidade e responsividade.
- [ ] Preparação para deploy em ambiente de produção.

---

## 🤝 Contribuição

Contribuições, sugestões e feedbacks são bem-vindos!

Para contribuir:

1. Faça um fork do repositório.
2. Crie uma branch para sua alteração.
3. Implemente as mudanças.
4. Faça commits descrevendo suas alterações.
5. Abra um Pull Request.

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT.
Consulte o arquivo [LICENSE](./LICENSE) para mais informações.

---

## 👥 Desenvolvedores

Projeto desenvolvido colaborativamente por:

<table align="center">
  <tr>
    <td align="center">
      <a href="https://github.com/AndreyRod">
        <img src="https://github.com/AndreyRodr.png" width="100px;" alt="AndreyRod"/><br />
        <sub><b>AndreyRodr</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/LucassTeixeiraN">
        <img src="https://github.com/LucassTeixeiraN.png" width="100px;" alt="LucassTeixeiraN"/><br />
        <sub><b>LucassTeixeiraN</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/jpegame">
        <img src="https://github.com/jpegame.png" width="100px;" alt="jpegame"/><br />
        <sub><b>jpegame</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/belleruivo">
        <img src="https://github.com/belleruivo.png" width="100px;" alt="belleruivo"/><br />
        <sub><b>belleruivo</b></sub>
      </a>
    </td>
  </tr>
</table>

---

**Care n' Share — Conectando Corações e Causas.** 💚
