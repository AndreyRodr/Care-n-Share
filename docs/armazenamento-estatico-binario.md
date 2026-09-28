# Armazenamento estático — mídias binárias no PostgreSQL

## Task atendida

Definir as colunas de mídia, incluindo fotos de perfil, como dados binários (`bytea`) no PostgreSQL, centralizando o armazenamento no banco local.

## Arquivos alterados

| Arquivo | Alteração |
| --- | --- |
| [`backend/prisma/schema.prisma`](../backend/prisma/schema.prisma) | Converte os campos de mídia para `Bytes @db.ByteA` e adiciona os tipos MIME. |
| [`backend/prisma/migrations/20260922063000_store_media_as_binary/migration.sql`](../backend/prisma/migrations/20260922063000_store_media_as_binary/migration.sql) | Altera as colunas já existentes no PostgreSQL e inclui as colunas de tipo MIME. |
| [`backend/src/config/mediaStorage.js`](../backend/src/config/mediaStorage.js) | Configura o recebimento temporário de uploads em memória, sem serviço externo. |
| [`backend/src/utils/media.js`](../backend/src/utils/media.js) | Converte os bytes do banco em Data URLs para a resposta da API. |
| [`backend/src/controllers/UserController.js`](../backend/src/controllers/UserController.js) | Salva fotos de perfil em binário e serializa as respostas de usuário/ONG. |
| [`backend/src/controllers/PostController.js`](../backend/src/controllers/PostController.js) | Salva imagens de posts em binário e serializa as respostas de posts. |
| [`backend/src/routes/userRoutes.js`](../backend/src/routes/userRoutes.js) | Passa a usar o armazenamento local de mídia. |
| [`backend/src/routes/postRoutes.js`](../backend/src/routes/postRoutes.js) | Passa a usar o armazenamento local de mídia. |
| [`backend/src/repositories/UserRepository.js`](../backend/src/repositories/UserRepository.js) | Persiste o tipo MIME da foto de perfil. |
| [`backend/src/services/UserService.js`](../backend/src/services/UserService.js) | Serializa a foto binária na resposta de login. |

## Colunas convertidas

| Entidade | Coluna binária | Coluna de tipo MIME |
| --- | --- | --- |
| `User` | `profilePicture BYTEA` | `profilePictureMimeType TEXT` |
| `Post` | `image BYTEA` | `imageMimeType TEXT` |
| `Project` | `image BYTEA` | `imageMimeType TEXT` |

As colunas de tipo MIME são necessárias porque `bytea` armazena somente os bytes. Elas informam ao cliente se o conteúdo é, por exemplo, `image/jpeg` ou `image/png`.

## Como funciona

1. O frontend envia uma imagem por `multipart/form-data`.
2. O Multer mantém o arquivo em memória apenas durante a requisição.
3. O backend grava `file.buffer` na coluna `BYTEA` e `file.mimetype` na coluna correspondente de tipo MIME.
4. Ao consultar usuário, ONG ou post, o backend converte os bytes para uma Data URL (`data:image/...;base64,...`).
5. O frontend continua usando a propriedade de imagem como `src` de uma tag `<img>`, sem mudança no formato consumido pela interface.

Nenhuma imagem nova é enviada ao Cloudinary nesse fluxo. O arquivo fica centralizado no PostgreSQL.

## Migration e dados existentes

A migration converte valores textuais que já existiam nas colunas de imagem para bytes UTF-8 para não descartá-los silenciosamente. Como os valores legados eram URLs do Cloudinary, eles não são imagens binárias válidas após a conversão e não possuem tipo MIME. Eles devem ser substituídos por um novo upload ou migrados por uma rotina específica antes da remoção definitiva do serviço externo.

## Como aplicar

Após configurar uma `DATABASE_URL` válida, execute no diretório `backend`:

```powershell
npx prisma migrate deploy
npx prisma generate
```

Em desenvolvimento local, use `npx prisma migrate dev` no lugar de `migrate deploy` quando precisar criar migrations novas.

## Validação

O schema Prisma deve ser validado com:

```powershell
npx prisma format
npx prisma validate
```

> A migration depende da migration anterior de Projetos e Causas, pois também converte `Project.image`.