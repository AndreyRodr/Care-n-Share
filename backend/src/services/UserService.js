import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/UserRepository.js';

class UserService {
  /**
   * Registra um novo usuário ou ONG
   */
  async register(userData) {
    // 1. Verificar se o e-mail já está em uso
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('E-mail já cadastrado');
    }

    // 2. Criptografar a senha
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);

    // 3. Criar o usuário no banco via repository
    const newUser = await userRepository.create({
      ...userData,
      passwordHash
    });

    // Retornar usuário sem a senha
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  /**
   * Realiza o login e gera um token JWT
   */
  async login(email, password) {
    // 1. Buscar usuário pelo e-mail
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // 2. Comparar a senha enviada com o hash do banco
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    // 3. Gerar Token JWT
    const token = jwt.sign(
      { id: user.id, type: user.type },
      process.env.JWT_SECRET || 'secret_hackathon_jacaridade',
      { expiresIn: '1d' }
    );

    // Retornar dados do usuário (sem senha) e o token
    const { passwordHash: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token
    };
  }

  /**
   * Lógica para um usuário apoiar uma ONG
   */
  async supportOng(userId, ongId) {
    // 1. Verificar se a ONG existe e se é do tipo ONG
    const ong = await userRepository.findById(ongId);
    if (!ong || ong.type !== 'O') {
      throw new Error('ONG não encontrada');
    }

    // 2. Verificar se o usuário existe
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // 3. Adicionar o apoio via repository
    return await userRepository.addSupport(userId, ongId);
  }

  /**
   * Remove o apoio de um usuário a uma ONG
   */
  async stopSupportingOng(userId, ongId) {
    return await userRepository.removeSupport(userId, ongId);
  }

  /**
   * Listar todas as ONGs disponíveis para o feed
   */
  async listAllOngs() {
    return await userRepository.findAllOngs();
  }

  /**
   * Obtém o perfil completo de um usuário ou ONG
   */
  async getUserProfile(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export default new UserService();
