import prisma from '../config/database.js';

class PostRepository {
  async create(data) {
    return await prisma.post.create({
      data
    });
  }

  async findByOng(ongId) {
    return await prisma.post.findMany({
      where: { ongId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findAll() {
    return await prisma.post.findMany({
      include: {
        ong: {
          select: { name: true, profilePicture: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}

export default new PostRepository();
