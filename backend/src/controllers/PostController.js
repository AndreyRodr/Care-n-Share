import postRepository from '../repositories/PostRepository.js';
import { uploadImage } from '../config/cloudinary.js';

class PostController {
  async create(req, res) {
    try {
      const {
        title,
        content,
        fundraisingGoal = 0,
        fundraisingDeadline = null
      } = req.body;

      const ongId = req.user.id;

      let imageUrl = null;

      if (req.file) {
        const uploadResult = await uploadImage(
          req.file.buffer,
          'cns_posts'
        );

        imageUrl = uploadResult.secure_url;
      }

      const post = await postRepository.create({
        title,
        content,
        image: imageUrl,
        ongId,
        fundraisingGoal: fundraisingGoal,
        amountRaised: 0,
        fundraisingDeadline: fundraisingDeadline
      });

      return res.status(201).json({
        message: 'Publicação criada com sucesso.',
        post
      });

    } catch (error) {
      console.error('Erro ao criar publicação:', error);

      return res.status(500).json({
        error: 'Erro ao criar publicação.'
      });
    }
  }

  async getAll(req, res) {
    try {
      const posts = await postRepository.findAll();

      return res.status(200).json(posts);

    } catch (error) {
      console.error('Erro ao buscar publicações:', error);

      return res.status(500).json({
        error: 'Erro ao buscar feed de publicações.'
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;

      const post = await postRepository.findById(id);

      if (!post) {
        return res.status(404).json({
          error: 'Publicação não encontrada.'
        });
      }

      return res.status(200).json(post);

    } catch (error) {
      console.error('Erro ao buscar publicação:', error);

      return res.status(500).json({
        error: 'Erro ao buscar publicação.'
      });
    }
  }

  async getByOng(req, res) {
    try {
      const { ongId } = req.params;

      const posts = await postRepository.findByOng(ongId);

      return res.status(200).json(posts);

    } catch (error) {
      console.error('Erro ao buscar publicações da ONG:', error);

      return res.status(500).json({
        error: 'Erro ao buscar publicações da ONG.'
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const ongId = req.user.id;

      const existingPost = await postRepository.findById(id);

      if (!existingPost) {
        return res.status(404).json({
          error: 'Publicação não encontrada.'
        });
      }

      if (existingPost.ongId !== ongId) {
        return res.status(403).json({
          error: 'Você não tem permissão para editar esta publicação.'
        });
      }

      const {
        title,
        content,
        fundraisingGoal,
        fundraisingDeadline,
        amountRaised
      } = req.body;

      const updateData = {};

      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;

      if (fundraisingGoal !== undefined) {
        updateData.fundraisingGoal = fundraisingGoal;
      }

      if (amountRaised !== undefined) {
        updateData.amountRaised = amountRaised;
      }

      if (fundraisingDeadline !== undefined) {
        updateData.fundraisingDeadline = fundraisingDeadline;
      }

      if (req.file) {
        const uploadResult = await uploadImage(
          req.file.buffer,
          'cns_posts'
        );

        updateData.image = uploadResult.secure_url;
      }

      const updatedPost = await postRepository.update(
        id,
        updateData
      );

      return res.status(200).json({
        message: 'Publicação atualizada com sucesso.',
        post: updatedPost
      });

    } catch (error) {
      console.error('Erro ao atualizar publicação:', error);

      return res.status(500).json({
        error: 'Erro ao atualizar publicação.'
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const ongId = req.user.id;

      const existingPost = await postRepository.findById(id);

      if (!existingPost) {
        return res.status(404).json({
          error: 'Publicação não encontrada.'
        });
      }

      // Verifica se a publicação pertence à ONG autenticada
      if (existingPost.ongId !== ongId) {
        return res.status(403).json({
          error: 'Você não tem permissão para excluir esta publicação.'
        });
      }

      await postRepository.delete(id);

      return res.status(200).json({
        message: 'Publicação excluída com sucesso.'
      });

    } catch (error) {
      console.error('Erro ao excluir publicação:', error);

      return res.status(500).json({
        error: 'Erro ao excluir publicação.'
      });
    }
  }
}

export default new PostController();
