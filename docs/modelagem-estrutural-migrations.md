# Modelagem estrutural — migrations de entidades e relações

## Task atendida

Criar as *migrations* para instanciar as entidades principais **Usuários, ONGs, Posts e Projetos**, além das relações de **seguidores** e **causas**.

## Decisão de modelagem

A aplicação já representa ONGs e usuários na mesma tabela/modelo `User`.
O campo `type` define o papel de cada cadastro:

- `U`: usuário comum;
- `O`: ONG.

Por isso, não foi criada uma tabela `Ong` separada: manter essa convenção evita duplicação de dados e preserva os fluxos existentes de cadastro, login e posts.

## Arquivos alterados

| Arquivo | Alteração |
| --- | --- |
| [`backend/prisma/schema.prisma`](../backend/prisma/schema.prisma) | Inclusão dos modelos `Cause` e `Project`, e das relações com `User`. |
| [`backend/prisma/migrations/20260922060000_add_projects_and_causes/migration.sql`](../backend/prisma/migrations/20260922060000_add_projects_and_causes/migration.sql) | Migration SQL que cria as novas tabelas, índices e chaves estrangeiras no PostgreSQL. |

## Entidades e relacionamentos

```text
User (type U ou O) ── publica ──> Post
User (type O / ONG) ── cria ──> Project
User ── segue ──> User (type O / ONG)
User <── interesses ──> Cause
Project <── atende ──> Cause
```

### Usuário e ONG

O modelo `User` existente continua sendo a origem de usuários e ONGs. A relação `SupportRelation`, já presente no projeto, representa seguidores:

- `supportedOngs`: ONGs seguidas por um usuário;
- `supporters`: usuários que seguem uma ONG.

No banco, essa relação usa a tabela de junção `_SupportRelation`.

### Post

O modelo `Post` já existente possui `ongId`, uma chave estrangeira para `User`. Assim, cada post pertence a uma ONG. A aplicação deve garantir que o usuário associado possua `type = 'O'` ao criar posts.

### Projeto

Foi criado o modelo `Project` com os campos `id`, `title`, `description`, `image`, `createdAt`, `updatedAt` e `ongId`.

`ongId` referencia `User`, estabelecendo uma relação de um-para-muitos: uma ONG pode criar vários projetos; cada projeto pertence a uma ONG. O banco impede que o dono do projeto seja removido enquanto houver projetos vinculados (`ON DELETE RESTRICT`). A regra de que esse dono precisa ser uma ONG (`type = 'O'`) deve ser validada pela aplicação, pois uma chave estrangeira não valida o valor de outra coluna.

### Causa

Foi criado o modelo `Cause`, com `id`, `name` único, `description` e `createdAt`.

Há duas relações muitos-para-muitos:

- usuário ↔ causa: interesses de um usuário, para futuros filtros e recomendações;
- projeto ↔ causa: causas atendidas por um projeto.

O Prisma cria essas relações por meio das tabelas de junção `_CauseToUser` e `_CauseToProject`. As chaves estrangeiras dessas tabelas usam `ON DELETE CASCADE`, removendo automaticamente os vínculos caso a causa, usuário ou projeto correspondente seja apagado.

## Como a migration funciona

A migration `20260922060000_add_projects_and_causes` executa, nesta ordem:

1. Cria as tabelas `Cause` e `Project`.
2. Cria as tabelas de associação `_CauseToUser` e `_CauseToProject`.
3. Cria o índice único para o nome da causa e os índices usados nas buscas por ONG e nas relações muitos-para-muitos.
4. Adiciona a chave estrangeira de `Project.ongId` para `User.id` e as chaves estrangeiras das tabelas de associação.

## Aplicação no banco de dados

Antes de aplicar, o arquivo `backend/.env` deve possuir uma `DATABASE_URL` válida para um PostgreSQL existente. Em seguida, no diretório `backend`, execute:

```powershell
npx prisma migrate deploy
npx prisma generate
```

Para desenvolvimento local, também é possível usar:

```powershell
npx prisma migrate dev
npx prisma generate
```

`migrate deploy` apenas aplica migrations já versionadas; `migrate dev` também pode detectar mudanças no schema e criar migrations novas. Para esta task, a migration já está criada, portanto não é necessário gerar outra.

## Validação realizada

O comando abaixo foi executado com sucesso após as alterações:

```powershell
npx prisma validate
```

A migration ainda não foi aplicada neste ambiente, pois a `DATABASE_URL` configurada aponta para o banco de exemplo `NOME_DO_BANCO`, que não está disponível.