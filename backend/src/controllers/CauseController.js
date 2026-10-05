import causeRepository from '../repositories/CauseRepository.js';

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
}

export default new CauseController();