# Controle de inventário — check-in de doações

## Task atendida

Modelar as tabelas **Doacoes_Checkin** e **Estoque_ONG**, com uma lógica transacional que aumenta o saldo do inventário somente depois da validação da entrega física de uma doação.

## Arquivos alterados

| Arquivo | Alteração |
| --- | --- |
| [`backend/prisma/schema.prisma`](../backend/prisma/schema.prisma) | Adiciona os modelos `DonationCheckin` e `OngInventory`, o enum de status e seus relacionamentos. |
| [`backend/prisma/migrations/20260922070000_add_inventory_checkin/migration.sql`](../backend/prisma/migrations/20260922070000_add_inventory_checkin/migration.sql) | Cria as tabelas, índices, chaves estrangeiras, função e trigger PostgreSQL. |

## Estrutura criada

### `Doacoes_Checkin`

Representa uma doação física que aguarda ou passou pela conferência da ONG.

Campos relevantes:

- `itemName`, `category`, `quantity` e `unit`: identificação e quantidade física entregue;
- `status`: `PENDING`, `CHECKED_IN` ou `CANCELLED`;
- `checkedInAt`: data/hora em que a entrega foi validada;
- `donorId`: usuário doador;
- `ongId`: ONG que receberá o item;
- `validatedById`: usuário que fez a validação;
- `projectId`: projeto beneficiado, quando aplicável.

### `Estoque_ONG`

Representa o saldo atual de cada item de uma ONG.

Um item é único para a combinação **ONG + nome do item + unidade**. A tabela também mantém a categoria, a quantidade atual, a quantidade mínima e a data da última atualização.

## Relações

```text
Usuário (doador) ──> Doacoes_Checkin ──> ONG receptora
                                    └──> Projeto opcional

Doacoes_Checkin (CHECKED_IN) ── trigger ──> Estoque_ONG
```

Usuários e ONGs continuam usando o modelo `User`; uma ONG é um usuário com `type = 'O'`. A API deve validar esse tipo antes de criar ou confirmar check-ins para uma ONG.

## Regra transacional implementada

A migration cria a função PostgreSQL `apply_validated_checkin_to_inventory` e a trigger `Doacoes_Checkin_apply_inventory`.

Ela executa **antes de inserir ou atualizar** uma doação e segue estas regras:

1. Rejeita quantidade menor ou igual a zero.
2. Não altera o estoque quando o status é `PENDING` ou `CANCELLED`.
3. Ao inserir já como `CHECKED_IN`, ou ao mudar de `PENDING`/`CANCELLED` para `CHECKED_IN`, faz um *upsert* no estoque:
   - cria o item se ainda não existir para aquela ONG;
   - soma a quantidade se o item já existir.
4. Preenche `checkedInAt` automaticamente se a data não tiver sido informada.
5. Impede a alteração de status, item, unidade, quantidade ou ONG de um check-in já validado. Isso evita que uma edição posterior incremente o estoque pela segunda vez ou deixe o saldo inconsistente.

O *upsert* e a mudança do status ocorrem na mesma transação do PostgreSQL. Se qualquer etapa falhar, nem o check-in nem o estoque são confirmados.

## Exemplos de comportamento

| Ação | Resultado no estoque |
| --- | --- |
| Criar doação com status `PENDING` | Não muda. |
| Atualizar `PENDING` para `CHECKED_IN` com 10 kg de arroz | Cria/soma 10 kg de arroz para a ONG. |
| Atualizar novamente o mesmo check-in | A alteração relevante é rejeitada; não soma outra vez. |
| Criar ou atualizar como `CANCELLED` | Não muda. |

## Como aplicar

A migration depende das migrations anteriores de Projetos/Causas e de armazenamento binário. Depois de configurar uma `DATABASE_URL` PostgreSQL válida, execute no diretório `backend`:

```powershell
npx prisma migrate deploy
npx prisma generate
```

A migration habilita a extensão PostgreSQL `pgcrypto`, necessária para gerar o UUID de um item de estoque criado automaticamente pela trigger. O usuário do banco deve ter permissão para criar essa extensão; na maioria das instalações locais do PostgreSQL isso é permitido.

## Validação

Após a alteração do schema, execute:

```powershell
npx prisma format
npx prisma validate
```

O funcionamento completo da trigger deve ser testado depois que houver um banco PostgreSQL configurado, pois ela é executada pelo banco e não pelo Prisma em memória.