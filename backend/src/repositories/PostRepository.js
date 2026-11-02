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

  async findMatchedPosts(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        interestedCauses: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!user) {
      return null;
    }

    const causeIds = user.interestedCauses.map(cause => cause.id);

    if (causeIds.length === 0) {
      return {
        totalInterests: 0,
        posts: []
      };
    }

    const posts = await prisma.post.findMany({
      where: {
        causes: {
          some: {
            id: {
              in: causeIds
            }
          }
        }
      },
      include: {
        causes: true,
        ong: {
          select: {
            id: true,
            name: true,
            profilePicture: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const matchedPosts = posts.map(post => {
      const matchedCauses = post.causes.filter(cause =>
        causeIds.includes(cause.id)
      );

      const matchPercentage = Math.round(
        (matchedCauses.length / causeIds.length) * 100
      );

      return {
        ...post,
        matchScore: matchedCauses.length,
        matchPercentage,
        matchedCauses
      };
    });

    matchedPosts.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return {
      totalInterests: causeIds.length,
      posts: matchedPosts
    };
  }
}

export default new PostRepository();
