import prisma from '../config/database.js';

class InventoryRepository {
  async create(data) {
    return await prisma.ongInventory.create({ data });
  }

  async findByOng(ongId) {
    return await prisma.ongInventory.findMany({
      where: { ongId },
      orderBy: { itemName: 'asc' }
    });
  }

  async findById(id, ongId) {
    return await prisma.ongInventory.findFirst({
      where: { id, ongId }
    });
  }

  async update(id, ongId, data) {
    return await prisma.ongInventory.updateMany({
      where: { id, ongId },
      data
    });
  }

  async delete(id, ongId) {
    return await prisma.ongInventory.deleteMany({
      where: { id, ongId }
    });
  }
}

export default new InventoryRepository();