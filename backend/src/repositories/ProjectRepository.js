import prisma from '../config/database.js';

class ProjectRepository {
  async create(data, causeIds = []) {
    return await prisma.project.create({
      data: {
        ...data,
        causes: causeIds.length > 0 ? {
          connect: causeIds.map(id => ({ id }))
        } : undefined
      },
      include: { causes: true }
    });
  }

  async findByOng(ongId) {
    return await prisma.project.findMany({
      where: { ongId },
      include: {
        causes: true,
        donationCheckins: { select: { id: true, quantity: true, status: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id, ongId) {
    return await prisma.project.findFirst({
      where: { id, ongId },
      include: {
        causes: true,
        donationCheckins: true
      }
    });
  }

  async update(id, ongId, data, causeIds) {
    const updateData = { ...data };

    if (causeIds) {
      updateData.causes = {
        set: causeIds.map(cId => ({ id: cId }))
      };
    }

    return await prisma.project.updateMany({
      where: { id, ongId },
      data: updateData
    });
  }

  async delete(id, ongId) {
    return await prisma.project.deleteMany({
      where: { id, ongId }
    });
  }
}

export default new ProjectRepository();