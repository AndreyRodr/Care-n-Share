import causeRepository from '../repositories/CauseRepository.js';
import PostRepository from '../repositories/PostRepository.js';

class CauseController {
  async create(req, res) {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'O nome da causa é obrigatório.' });
      }

      const existingCause = await causeRepository.findByName(name);
      if (existingCause) {
        return res.status(400).json({ error: 'Já existe uma causa cadastrada com este nome.' });
      }

      const cause = await causeRepository.create({ name, description });
      return res.status(201).json(cause);
    } catch (error) {
      console.error('Erro ao criar causa:', error);
      return res.status(400).json({ error: 'Erro ao cadastrar causa.' });
    }
  }

  async getAll(req, res) {
    try {
      const causes = await causeRepository.findAll();
      return res.status(200).json(causes);
    } catch (error) {
      console.error('Erro ao listar causas:', error);
      return res.status(500).json({ error: 'Erro ao buscar causas.' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const cause = await causeRepository.findById(id);

      if (!cause) {
        return res.status(404).json({ error: 'Causa não encontrada.' });
      }

      return res.status(200).json(cause);
    } catch (error) {
      console.error('Erro ao obter causa:', error);
      return res.status(400).json({ error: 'Erro ao buscar detalhes da causa.' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const causeExists = await causeRepository.findById(id);
      if (!causeExists) {
        return res.status(404).json({ error: 'Causa não encontrada.' });
      }

      if (name && name !== causeExists.name) {
        const nameDuplicate = await causeRepository.findByName(name);
        if (nameDuplicate) {
          return res.status(400).json({ error: 'Já existe outra causa com este nome.' });
        }
      }

      const updatedCause = await causeRepository.update(id, { name, description });
      return res.status(200).json(updatedCause);
    } catch (error) {
      console.error('Erro ao atualizar causa:', error);
      return res.status(400).json({ error: 'Erro ao atualizar causa.' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const causeExists = await causeRepository.findById(id);
      if (!causeExists) {
        return res.status(404).json({ error: 'Causa não encontrada.' });
      }

      await causeRepository.delete(id);
      return res.status(200).json({ message: 'Causa removida com sucesso.' });
    } catch (error) {
      console.error('Erro ao deletar causa:', error);
      return res.status(400).json({ error: 'Erro ao remover causa.' });
    }
  }

  async getUserCauses(req, res) {
    try {
      const userId = req.user.id;

      const result = await causeRepository.findUserCauses(userId);

      if (!result) {
        return res.status(404).json({
          error: 'Usuário não encontrado.'
        });
      }

      return res.status(200).json(result.interestedCauses);
    } catch (error) {
      console.error('Erro ao buscar causas do usuário:', error);

      return res.status(500).json({
        error: 'Erro ao buscar causas de interesse.'
      });
    }
  }

  async addUserCauses(req, res) {
    try {
      const userId = req.user.id;
      const { causeIds } = req.body;

      const result = await causeRepository.addUserCauses(
        userId,
        causeIds
      );

      return res.status(200).json({
        message: 'Causas adicionadas com sucesso.',
        causes: result.interestedCauses
      });
    } catch (error) {
      console.error('Erro ao adicionar causas do usuário:', error);

      return res.status(400).json({
        error: 'Não foi possível adicionar as causas. Verifique os IDs informados.'
      });
    }
  }

  async setUserCauses(req, res) {
    try {
      const userId = req.user.id;
      const { causeIds } = req.body;

      const result = await causeRepository.setUserCauses(
        userId,
        causeIds
      );

      return res.status(200).json({
        message: 'Causas de interesse atualizadas com sucesso.',
        causes: result.interestedCauses
      });
    } catch (error) {
      console.error('Erro ao atualizar causas do usuário:', error);

      return res.status(400).json({
        error: 'Não foi possível atualizar as causas. Verifique os IDs informados.'
      });
    }
  }

  async removeUserCause(req, res) {
    try {
      const userId = req.user.id;
      const { causeId } = req.params;

      const result = await causeRepository.removeUserCause(
        userId,
        causeId
      );

      return res.status(200).json({
        message: 'Causa removida das preferências com sucesso.',
        causes: result.interestedCauses
      });
    } catch (error) {
      console.error('Erro ao remover causa do usuário:', error);

      return res.status(400).json({
        error: 'Não foi possível remover a causa.'
      });
    }
  }

  async getPostCauses(req, res) {
    try {
      const { postId } = req.params;

      const result = await causeRepository.findPostCauses(postId);

      if (!result) {
        return res.status(404).json({
          error: 'Publicação não encontrada.'
        });
      }

      return res.status(200).json(result.causes);
    } catch (error) {
      console.error('Erro ao buscar causas da publicação:', error);

      return res.status(500).json({
        error: 'Erro ao buscar causas da publicação.'
      });
    }
  }

  async addPostCauses(req, res) {
    try {
      const { postId } = req.params;
      const { causeIds } = req.body;

      const post = await PostRepository.findById(postId);

      if (!post) {
        return res.status(404).json({
          error: 'Publicação não encontrada.'
        });
      }

      if (post.ongId !== req.user.id) {
        return res.status(403).json({
          error: 'Você não tem permissão para modificar esta publicação.'
        });
      }

      const result = await causeRepository.addPostCauses(
        postId,
        causeIds
      );

      return res.status(200).json({
        message: 'Causas adicionadas à publicação com sucesso.',
        causes: result.causes
      });
    } catch (error) {
      console.error('Erro ao adicionar causas à publicação:', error);

      return res.status(400).json({
        error: 'Não foi possível adicionar as causas. Verifique os IDs informados.'
      });
    }
  }

  async setPostCauses(req, res) {
    try {
      const { postId } = req.params;
      const { causeIds } = req.body;

      const post = await PostRepository.findById(postId);

      if (!post) {
        return res.status(404).json({
          error: 'Publicação não encontrada.'
        });
      }

      if (post.ongId !== req.user.id) {
        return res.status(403).json({
          error: 'Você não tem permissão para modificar esta publicação.'
        });
      }

      const result = await causeRepository.setPostCauses(
        postId,
        causeIds
      );

      return res.status(200).json({
        message: 'Causas da publicação atualizadas com sucesso.',
        causes: result.causes
      });
    } catch (error) {
      console.error('Erro ao atualizar causas da publicação:', error);

      return res.status(400).json({
        error: 'Não foi possível atualizar as causas.'
      });
    }
  }

  async removePostCause(req, res) {
    try {
      const { postId, causeId } = req.params;

      const post = await PostRepository.findById(postId);

      if (!post) {
        return res.status(404).json({
          error: 'Publicação não encontrada.'
        });
      }

      if (post.ongId !== req.user.id) {
        return res.status(403).json({
          error: 'Você não tem permissão para modificar esta publicação.'
        });
      }

      const result = await causeRepository.removePostCause(
        postId,
        causeId
      );

      return res.status(200).json({
        message: 'Causa removida da publicação com sucesso.',
        causes: result.causes
      });
    } catch (error) {
      console.error('Erro ao remover causa da publicação:', error);

      return res.status(400).json({
        error: 'Não foi possível remover a causa.'
      });
    }
  }
}

export default new CauseController();