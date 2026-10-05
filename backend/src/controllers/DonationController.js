import { log } from 'node:console';
import donationRepository from '../repositories/DonationRepository.js';

class DonationController {
  async create(req, res) {
    try {
      const { itemName, category, quantity, type, unit, donorId, projectId } = req.body;
      const ongId = req.user.id;

      const donation = await donationRepository.create({
        itemName,
        category,
        quantity,
        type,
        unit,
        donorId,
        ongId,
        projectId
      });

      return res.status(201).json(donation);
    } catch (error) {
      console.error('Erro ao criar doação:', error);
      return res.status(400).json({ error: 'Erro ao registrar doação.' });
    }
  }

  async getAll(req, res) {
    try {
      const ongId = req.user.id;
      const { search, status, contributionType } = req.validatedQuery;

      const donations = await donationRepository.findAll(ongId, { search, status, contributionType });
      
      return res.status(200).json(donations);
    } catch (error) {
      console.error('Erro ao buscar doações:', error);
      return res.status(400).json({ error: 'Erro ao listar doações.' });
    }
  }

  async getById(req, res) {
    try {
      const ongId = req.user.id;
      const { id } = req.params;

      const donation = await donationRepository.findById(id, ongId);
      if (!donation) return res.status(404).json({ error: 'Doação não encontrada.' });

      return res.status(200).json(donation);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao obter detalhes da doação.' });
    }
  }

  async update(req, res) {
    try {
      const ongId = req.user.id;
      const { id } = req.params;
      const { itemName, category, quantity, unit, type } = req.body;

      const result = await donationRepository.update(id, ongId, { itemName, category, quantity, unit, type });
      if (result.count === 0) return res.status(404).json({ error: 'Doação não encontrada ou sem permissão.' });

      return res.status(200).json({ message: 'Doação atualizada com sucesso.' });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar doação.' });
    }
  }

  async complete(req, res) {
    try {
      const ongId = req.user.id;
      const { id } = req.params;

      const result = await donationRepository.complete(id, ongId);
      return res.status(200).json(result);
    } catch (error) {
      if (error.message === 'NOT_FOUND') return res.status(404).json({ error: 'Doação não encontrada.' });
      if (error.message === 'NOT_PENDING') return res.status(400).json({ error: 'Apenas doações pendentes podem ser concluídas.' });
      return res.status(400).json({ error: 'Erro ao concluir doação.' });
    }
  }

  async cancel(req, res) {
    try {
      const ongId = req.user.id;
      const { id } = req.params;
      const { reason } = req.body;

      const result = await donationRepository.cancel(id, ongId);
      return res.status(200).json({ ...result, reason: reason || 'Sem motivo informado' });
    } catch (error) {
      if (error.message === 'NOT_FOUND') return res.status(404).json({ error: 'Doação não encontrada.' });
      return res.status(400).json({ error: 'Erro ao cancelar doação.' });
    }
  }

  async delete(req, res) {
    try {
      const ongId = req.user.id;
      const { id } = req.params;

      const result = await donationRepository.delete(id, ongId);
      if (result.count === 0) return res.status(404).json({ error: 'Doação não encontrada.' });

      return res.status(200).json({ message: 'Doação removida com sucesso.' });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao deletar doação.' });
    }
  }
}

export default new DonationController();