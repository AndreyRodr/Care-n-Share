import postRepository from '../repositories/PostRepository.js';
import { uploadImage } from '../config/cloudinary.js';


class PostController {
  async create(req, res) {
    try {
      const { title, content } = req.body;
      const ongId = req.user.id;
      const userType = req.user.type;

      // Validação: Apenas ONGs podem postar
      if (userType !== 'O') {
        return res.status(403).json({ error: 'Apenas ONGs podem criar publicações.' });
      }

      let imageUrl = null;

      if (req.file) {
        const uploadResult = await uploadImage(req.file.buffer, 'cns_posts');
        imageUrl = uploadResult.secure_url;
      }

      const post = await postRepository.create({
        title,
        content,
        image: imageUrl,
        ongId
      });

      return res.status(201).json(post);
    } catch (error) {
      console.error('Erro ao criar post:', error);
      return res.status(400).json({ error: 'Erro ao criar publicação' });
    }
  }

  async getByOng(req, res) {
    try {
      const { ongId } = req.params;
      const posts = await postRepository.findByOng(ongId);
      return res.status(200).json(posts);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao buscar publicações' });
    }
  }

  async getAll(req, res) {
    try {
      const posts = await postRepository.findAll();
      return res.status(200).json(posts);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao buscar feed de posts' });
    }
  }
}

export default new PostController();
