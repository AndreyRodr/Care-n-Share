import userService from '../services/UserService.js';
import userRepository from '../repositories/UserRepository.js';

class UserController {
  /**
   * Endpoint de Registro
   */
  async register(req, res) {
    try {
      const user = await userService.register(req.body);
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * Endpoint de Login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await userService.login(email, password);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }

  /**
   * Endpoint para listar todas as ONGs
   */
  async listOngs(req, res) {
    try {
      const ongs = await userService.listAllOngs();
      return res.status(200).json(ongs);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Endpoint para apoiar uma ONG
   * Nota: O userId virá do token JWT (middleware de auth)
   */
  async support(req, res) {
    try {
      const { id: ongId } = req.params;
      const userId = req.user.id; // Preenchido pelo middleware de autenticação

      const result = await userService.supportOng(userId, ongId);
      return res.status(200).json({ message: 'Apoio registrado com sucesso!', result });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * Endpoint para deixar de apoiar uma ONG
   */
  async removeSupport(req, res) {
    try {
      const { id: ongId } = req.params;
      const userId = req.user.id;

      const result = await userService.stopSupportingOng(userId, ongId);
      return res.status(200).json({ message: 'Apoio removido.', result });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * Endpoint para atualizar o perfil do usuário logado
   */
  async update(req, res) {
    try {
      const userId = req.user.id;
      const { name, email, description, profilePicture, pixKey } = req.body;

      // Montar apenas os campos permitidos
      const cleanData = {};
      if (name) cleanData.name = name;
      if (email) cleanData.email = email;
      if (description !== undefined) cleanData.description = description;
      if (profilePicture !== undefined) cleanData.profilePicture = profilePicture;
      if (pixKey !== undefined) cleanData.pixKey = pixKey;

      const updatedUser = await userRepository.update(userId, cleanData);

      const { passwordHash: _, ...userWithoutPassword } = updatedUser;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      return res.status(400).json({ error: 'Erro ao atualizar perfil: ' + error.message });
    }
  }

  /**
   * Obter perfil de um usuário/ONG específico
   */
  async getProfile(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getUserProfile(id);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }
}

export default new UserController();
