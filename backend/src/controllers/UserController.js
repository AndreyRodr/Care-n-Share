import userService from '../services/UserService.js';
import userRepository from '../repositories/UserRepository.js';
import {
  uploadImage,
  uploadPrivateDocument
} from '../config/cloudinary.js';import {
  AUTH_COOKIE_BASE_OPTIONS,
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTIONS
} from '../config/auth.js';
import cnpjValidationService from '../services/CnpjValidationService.js';

class UserController {
  /**
   * Endpoint de Registro
   */
  async register(req, res) {
    try {
      const files = req.files ?? {};
      const profilePictureFile = files.profilePicture?.[0];

      let imageUrl = null;
      let verification = undefined;

      if (req.body.type === 'O') {
        const cnpjValidation = await cnpjValidationService.validate(
          req.body.cnpj
        );

        if (!cnpjValidation.valid) {
          return res.status(400).json({
            error: cnpjValidation.reason
          });
        }

        const statuteFile = files.statuteDocument?.[0];
        const addressProofFile = files.addressProofDocument?.[0];

        const [statuteUpload, addressProofUpload] = await Promise.all([
          uploadPrivateDocument(
            statuteFile.buffer,
            'care_n_share/ong_documents/statutes'
          ),
          uploadPrivateDocument(
            addressProofFile.buffer,
            'care_n_share/ong_documents/address_proofs'
          )
        ]);

        verification = {
          cnpj: cnpjValidation.cnpj,
          legalName: cnpjValidation.legalName,
          cnpjSituation: cnpjValidation.situation,
          cnpjCheckedAt: cnpjValidation.checkedAt,
          validationProvider: cnpjValidation.provider,

          statuteDocumentUrl: statuteUpload.secure_url,
          statuteDocumentPublicId: statuteUpload.public_id,

          addressProofDocumentUrl: addressProofUpload.secure_url,
          addressProofDocumentPublicId: addressProofUpload.public_id
        };
      }

      if (profilePictureFile) {
        const imageUpload = await uploadImage(
          profilePictureFile.buffer,
          'jacaridade_users'
        );

        imageUrl = imageUpload.secure_url;
      }

      const userData = {   
        ...req.body,
        profilePicture: imageUrl,
        verification
      };

      const user = await userService.register(userData);
      return res.status(201).json(user);
      } catch (error) {
        console.error('Erro no cadastro:', error);
        return res.status(400).json({ error: error.message });
      }
  }

  /**
   * Endpoint de Login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { token, user } = await userService.login(email, password);

      res.cookie(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);

      return res.status(200).json({ user });
    } catch (error) {
      console.error("Erro no login: ", error)
      return res.status(401).json({ error: error.message });
    }
  }

  async logout(req, res) {
    try {
      await userService.logout(req.user.id);

      res.clearCookie(AUTH_COOKIE_NAME, AUTH_COOKIE_BASE_OPTIONS);

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: error.message });
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
      console.error("ERRO NA ROTA DO FEED:", error);
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
      if (req.file) {
        const uploadResult = await uploadImage(req.file.buffer, 'jacaridade_users');
        cleanData.profilePicture = uploadResult.secure_url;
      }

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

  async getMe(req, res) {
    try {
      const { id } = req.user;
      const user = await userService.getUserProfile(id);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }
}

export default new UserController();
