import projectRepository from '../repositories/ProjectRepository.js';

class ProjectController {
  async create(req, res) {
    try {
      const { title, description, causeIds } = req.body;
      const ongId = req.user.id;

      const project = await projectRepository.create({ title, description, ongId }, causeIds);
      return res.status(201).json(project);
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      return res.status(400).json({ error: 'Erro ao criar projeto.' });
    }
  }

  async getByOng(req, res) {
    try {
      const ongId = req.user.id;
      const projects = await projectRepository.findByOng(ongId);
      return res.status(200).json(projects);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao listar projetos.' });
    }
  }

  async getById(req, res) {
    try {
      const ongId = req.user.id;
      const { id } = req.params;

      const project = await projectRepository.findById(id, ongId);
      if (!project) return res.status(404).json({ error: 'Projeto não encontrado.' });

      return res.status(200).json(project);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao detalhar projeto.' });
    }
  }

  async update(req, res) {
    try {
      const ongId = req.user.id;
      const { id } = req.params;
      const { title, description, causeIds } = req.body;

      const result = await projectRepository.update(id, ongId, { title, description }, causeIds);
      if (result.count === 0) return res.status(404).json({ error: 'Projeto não encontrado.' });

      return res.status(200).json({ message: 'Projeto atualizado com sucesso.' });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar projeto.' });
    }
  }

  async delete(req, res) {
    try {
      const ongId = req.user.id;
      const { id } = req.params;

      const result = await projectRepository.delete(id, ongId);
      if (result.count === 0) return res.status(404).json({ error: 'Projeto não encontrado.' });

      return res.status(200).json({ message: 'Projeto removido com sucesso.' });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao excluir projeto.' });
    }
  }
}

export default new ProjectController();