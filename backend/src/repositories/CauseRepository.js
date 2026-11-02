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
            posts: true
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
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            image: true,
            ong: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        _count: {
          select: {
            interestedUsers: true,
            posts: true
          }
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

  async findUserCauses(userId) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        interestedCauses: true
      }
    });
  }

  async addUserCauses(userId, causeIds) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        interestedCauses: {
          connect: causeIds.map(id => ({ id }))
        }
      },
      include: {
        interestedCauses: true
      }
    });
  }

  async setUserCauses(userId, causeIds) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        interestedCauses: {
          set: causeIds.map(id => ({ id }))
        }
      },
      include: {
        interestedCauses: true
      }
    });
  }

  async removeUserCause(userId, causeId) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        interestedCauses: {
          disconnect: { id: causeId }
        }
      },
      include: {
        interestedCauses: true
      }
    });
  }

  async findPostCauses(postId) {
    return prisma.post.findUnique({
      where: { id: postId },
      select: {
        causes: true
      }
    });
  }

  async addPostCauses(postId, causeIds) {
    return prisma.post.update({
      where: { id: postId },
      data: {
        causes: {
          connect: causeIds.map(id => ({ id }))
        }
      },
      include: {
        causes: true
      }
    });
  }

  async setPostCauses(postId, causeIds) {
    return prisma.post.update({
      where: { id: postId },
      data: {
        causes: {
          set: causeIds.map(id => ({ id }))
        }
      },
      include: {
        causes: true
      }
    });
  }

  async removePostCause(postId, causeId) {
    return prisma.post.update({
      where: { id: postId },
      data: {
        causes: {
          disconnect: { id: causeId }
        }
      },
      include: {
        causes: true
      }
    });
  }
}

export default new CauseRepository();