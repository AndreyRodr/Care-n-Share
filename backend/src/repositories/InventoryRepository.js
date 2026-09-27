import prisma from '../config/database.js';

export function calculateStatus(quantity, minimumQuantity) {
  const qty = Number(quantity);
  const minQty = Number(minimumQuantity);

  if (qty <= 0) return 'SEM_ESTOQUE';
  if (qty < minQty) return 'ESTOQUE_BAIXO';
  return 'NORMAL';
}

class InventoryRepository {
  async findAllItems(ongId, { search, category, status }) {
    const where = { ongId };

    if (search) {
      where.itemName = { contains: search, mode: 'insensitive' };
    }
    if (category) {
      where.category = { contains: category, mode: 'insensitive' };
    }

    const items = await prisma.ongInventory.findMany({
      where,
      orderBy: { itemName: 'asc' }
    });

    const formattedItems = items.map((item) => ({
      ...item,
      quantity: Number(item.quantity),
      minimumQuantity: Number(item.minimumQuantity),
      status: calculateStatus(item.quantity, item.minimumQuantity)
    }));

    if (status) {
      return formattedItems.filter((item) => item.status === status);
    }

    return formattedItems;
  }

  async findItemById(id, ongId) {
    const item = await prisma.ongInventory.findFirst({
      where: { id, ongId },
      include: {
        movements: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!item) return null;

    return {
      ...item,
      quantity: Number(item.quantity),
      minimumQuantity: Number(item.minimumQuantity),
      status: calculateStatus(item.quantity, item.minimumQuantity)
    };
  }

  async createItem(ongId, data) {
    const item = await prisma.ongInventory.create({
      data: {
        ongId,
        itemName: data.itemName,
        category: data.category,
        unit: data.unit,
        quantity: data.quantity || 0,
        minimumQuantity: data.minimumQuantity || 0
      }
    });

    return {
      ...item,
      quantity: Number(item.quantity),
      minimumQuantity: Number(item.minimumQuantity),
      status: calculateStatus(item.quantity, item.minimumQuantity)
    };
  }

  async updateItem(id, ongId, data) {
    const item = await prisma.ongInventory.findFirst({ where: { id, ongId } });
    if (!item) return null;

    const updated = await prisma.ongInventory.update({
      where: { id },
      data
    });

    return {
      ...updated,
      quantity: Number(updated.quantity),
      minimumQuantity: Number(updated.minimumQuantity),
      status: calculateStatus(updated.quantity, updated.minimumQuantity)
    };
  }

  async deleteItem(id, ongId) {
    return await prisma.ongInventory.deleteMany({
      where: { id, ongId }
    });
  }

  async createMovement(ongId, itemId, userId, { type, quantity, reason, donationId = null }) {
    return await prisma.$transaction(async (tx) => {
      const item = await tx.ongInventory.findFirst({
        where: { id: itemId, ongId }
      });

      if (!item) {
        throw { code: 404, message: 'Item de inventário não encontrado.' };
      }

      const currentQty = Number(item.quantity);
      const moveQty = Number(quantity);
      let newQuantity = currentQty;

      if (type === 'ENTRADA') {
        newQuantity += moveQty;
      } else if (type === 'SAIDA') {
        if (currentQty < moveQty) {
          throw { code: 409, message: 'Estoque insuficiente para realizar esta saída.' };
        }
        newQuantity -= moveQty;
      }

      const updatedItem = await tx.ongInventory.update({
        where: { id: itemId },
        data: { quantity: newQuantity }
      });

      const movement = await tx.inventoryMovement.create({
        data: {
          inventoryItemId: itemId,
          userId,
          type,
          quantity: moveQty,
          unit: item.unit,
          reason,
          donationId
        }
      });

      return {
        movement: {
          ...movement,
          quantity: Number(movement.quantity)
        },
        item: {
          ...updatedItem,
          quantity: Number(updatedItem.quantity),
          minimumQuantity: Number(updatedItem.minimumQuantity),
          status: calculateStatus(updatedItem.quantity, updatedItem.minimumQuantity)
        }
      };
    });
  }

  async findMovements(itemId, ongId, { type, startDate, endDate, page = 1, limit = 10 }) {
    const item = await prisma.ongInventory.findFirst({
      where: { id: itemId, ongId }
    });

    if (!item) return null;

    const where = { inventoryItemId: itemId };
    if (type) where.type = type;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [movements, total] = await Promise.all([
      prisma.inventoryMovement.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      prisma.inventoryMovement.count({ where })
    ]);

    return {
      movements: movements.map((m) => ({ ...m, quantity: Number(m.quantity) })),
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}

export default new InventoryRepository();