import postRepository from '../repositories/PostRepository.js';

class PostController {
  async create(req, res) {
    try {
      const { title, content, image } = req.body;
      const ongId = req.user.id;
      const userType = req.user.type;

      // Validação: Apenas ONGs podem postar
      if (userType !== 'O') {
        return res.status(403).json({ error: 'Apenas ONGs podem criar publicações.' });
      }

      const post = await postRepository.create({
        title,
        content,
        image,
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
