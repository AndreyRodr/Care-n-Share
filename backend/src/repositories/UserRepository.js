import prisma from '../config/database.js';

class UserRepository {

  /**
   * Cria um novo usuário ou ONG no banco
   */
  async create(userData) {
    return await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        profilePicture: userData.profilePicture,
        description: userData.description,
        passwordHash: userData.passwordHash,
        type: userData.type
      }
    });
  }

  /**
   * Atualiza os dados de um usuário
   */
  async update(id, updateData) {
    return await prisma.user.update({
      where: { id },
      data: updateData
    });
  }

  /**
   * Busca um usuário pelo ID
   */
  async findById(id) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        supportedOngs: true,
        supporters: true
      }
    });
  }

  /**
   * Busca um usuário pelo e-mail
   */
  async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  /**
   * Busca um usuário pelo nome
   */
  async findByName(name) {
    return await prisma.user.findFirst({
      where: { name }
    });
  }

  /**
   * Lista apenas usuários que são ONGs e inclui seus apoiadores
   */
  async findAllOngs() {
    return await prisma.user.findMany({
      where: { type: 'O' },
      include: {
        supporters: true
      }
    });
  }

  /**
   * Adiciona um apoio: Vincula um Usuário a uma ONG
   */
  async addSupport(userId, ongId) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        supportedOngs: {
          connect: { id: ongId }
        }
      }
    });
  }

  /**
   * Remove um apoio
   */
  async removeSupport(userId, ongId) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        supportedOngs: {
          disconnect: { id: ongId }
        }
      }
    });
  }
}

export default new UserRepository();
