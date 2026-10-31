import prisma from '../config/database.js';

class PostRepository {
  async create(data) {
    return await prisma.post.create({
      data,
      include: {
        ong: {
          select: {
            id: true,
            name: true,
            profilePicture: true
          }
        },
        causes: true
      }
    });
  }

  async findAll() {
    return await prisma.post.findMany({
      include: {
        ong: {
          select: {
            id: true,
            name: true,
            profilePicture: true
          }
        },
        causes: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findById(id) {
    return await prisma.post.findUnique({
      where: { id },
      include: {
        ong: {
          select: {
            id: true,
            name: true,
            profilePicture: true
          }
        },
        causes: true
      }
    });
  }

  async findByOng(ongId) {
    return await prisma.post.findMany({
      where: { ongId },
      include: {
        ong: {
          select: {
            id: true,
            name: true,
            profilePicture: true
          }
        },
        causes: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async update(id, data) {
    return await prisma.post.update({
      where: { id },
      data,
      include: {
        ong: {
          select: {
            id: true,
            name: true,
            profilePicture: true
          }
        },
        causes: true
      }
    });
  }

  async delete(id) {
    return await prisma.post.delete({
      where: { id }
    });
  }
}

export default new PostRepository();
