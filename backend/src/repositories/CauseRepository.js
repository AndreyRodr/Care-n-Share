import prisma from '../config/database.js';

class CauseRepository {
  async create(data) {
    return await prisma.cause.create({
      data
    });
  }

  async findAll() {
    return await prisma.cause.findMany({
      include: {
        _count: {
          select: {
            interestedUsers: true,
            projects: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  async findById(id) {
    return await prisma.cause.findUnique({
      where: { id },
      include: {
        projects: {
          select: {
            id: true,
            title: true,
            description: true,
            ong: { select: { id: true, name: true } }
          }
        },
        _count: {
          select: { interestedUsers: true }
        }
      }
    });
  }

  async findByName(name) {
    return await prisma.cause.findUnique({
      where: { name }
    });
  }

  async update(id, data) {
    return await prisma.cause.update({
      where: { id },
      data
    });
  }

  async delete(id) {
    return await prisma.cause.delete({
      where: { id }
    });
  }
}

export default new CauseRepository();