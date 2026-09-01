# 🐊 Care n' Share - Conectando Corações e Causas

O **Care n' Share** é uma plataforma desenvolvida para facilitar a conexão entre doadores e ONGs, permitindo que causas sociais ganhem visibilidade e apoio financeiro de forma rápida e intuitiva.

## Relatório e documentação
https://docs.google.com/document/d/139URQLGsATwxHRrrnv2ibY2nFECOGS-K-7CqcdkDqoE/edit?usp=sharing

## ✨ Funcionalidades Principais
- **Match de Interesses**: Algoritmo que recomenda ONGs com base nos interesses do usuário.
- **Mural de Posts**: ONGs podem publicar atualizações e fotos (estilo rede social).
- **Apoio Direto (PIX)**: Geração automática de QR Code PIX para doações instantâneas.
- **Perfis Personalizáveis**: Edição completa de perfil com compressão automática de imagens.
- **Autenticação Segura**: Sistema de Login/Cadastro com JWT e criptografia de senhas.

---

## 🛠️ Tecnologias Utilizadas
- **Frontend**: React.js, Vite, Tailwind CSS, Lucide React, Axios.
- **Backend**: Node.js, Express, Prisma ORM.
- **Banco de Dados**: SQLite (Fácil portabilidade para Hackathons).

---

## 🚀 Como Rodar o Projeto

### 1. Pré-requisitos
- Node.js instalado (v18 ou superior)
- NPM ou Yarn

### 2. Configuração do Backend
Entre na pasta do backend e instale as dependências:
```bash
cd backend
npm install
```

Crie um arquivo `.env` na raiz da pasta `backend` com as seguintes variáveis:
```env
JWT_SECRET="sua_chave_secreta_aqui"
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/NOME_DO_BANCO?schema=public"

CLOUDINARY_CLOUD_NAME="o_seu_cloud_name"
CLOUDINARY_API_KEY="a_sua_api_key"
CLOUDINARY_API_SECRET="o_seu_api_secret"
```

Prepare o banco de dados e gere o cliente do Prisma:
```bash
npx prisma generate
npx prisma migrate dev
```

Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

### 3. Configuração do Frontend
Em um novo terminal, entre na pasta do frontend:
```bash
cd frontend
npm install
```

Inicie o servidor do React:
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173` e a API em `http://localhost:3001`.

---

## 🌍 Como subir em um Servidor (Deploy)

Para colocar o projeto online, você pode usar serviços como **Render**, **Railway** ou uma **VPS**:

1. **Suba o código para o GitHub**.
2. **Backend**: 
   - No servidor, rode `npm install`.
   - Execute as migrações: `npx prisma migrate deploy`.
   - Use um gerenciador de processos como o **PM2** para manter o servidor rodando: `pm2 start src/index.js`.
3. **Frontend**:
   - Rode `npm run build` para gerar a pasta `dist`.
   - Você pode servir essa pasta estática usando o **Nginx** ou subir em serviços como **Vercel/Netlify**.

---

## 📝 Licença
Desenvolvido para fins de Hackathon. Sinta-se à vontade para colaborar!
