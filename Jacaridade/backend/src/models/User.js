/**
 * Model representativo do Usuário (inclui tanto usuários comuns quanto ONGs)
 * Os campos reais são gerenciados pelo Prisma em schema.prisma e 
 * esta estrutura serve como referência para a aplicação.
 */

export const UserType = {
  USER: 'U',
  ONG: 'O'
};

export class User {
  constructor({
    id,
    name,
    email,
    profilePicture,
    description,
    passwordHash,
    type,
    createdAt,
    supportedOngs = [],
    supporters = []
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.profilePicture = profilePicture;
    this.description = description;
    this.passwordHash = passwordHash;
    this.type = type; // 'U' para Usuário Comum e 'O' para ONG
    this.createdAt = createdAt;
    this.supportedOngs = supportedOngs;
    this.supporters = supporters;
  }
}
