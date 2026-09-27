import inventoryRepository from '../repositories/InventoryRepository.js';

class InventoryController {
  async create(req, res) {
    try {
      const { itemName, category, unit, quantity, minimumQuantity } = req.body;
      const ongId = req.user.id;

      const item = await inventoryRepository.create({
        itemName,
        category,
        unit,
        quantity,
        minimumQuantity,
        ongId
      });

      return res.status(201).json(item);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao adicionar item ao estoque.' });
    }
  }

  async getAll(req, res) {
    try {
      const ongId = req.user.id;
      const items = await inventoryRepository.findByOng(ongId);
      return res.status(200).json(items);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao listar itens do estoque.' });
    }
  }

  async getById(req, res) {
    try {
      const ongId = req.user.id;
      const { id } = req.params;

      const item = await inventoryRepository.findById(id, ongId);
      if (!item) return res.status(404).json({ error: 'Item do estoque não encontrado.' });

      return res.status(200).json(item);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao buscar item do estoque.' });
    }
  }

  async update(req, res) {
    try {
      const ongId = req.user.id;
      const { id } = req.params;
      const { itemName, category, unit, quantity, minimumQuantity } = req.body;

      const result = await inventoryRepository.update(id, ongId, { itemName, category, unit, quantity, minimumQuantity });
      if (result.count === 0) return res.status(404).json({ error: 'Item não encontrado.' });

      return res.status(200).json({ message: 'Estoque atualizado com sucesso.' });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar estoque.' });
    }
  }

  async delete(req, res) {
    try {
      const ongId = req.user.id;
      const { id } = req.params;

      const result = await inventoryRepository.delete(id, ongId);
      if (result.count === 0) return res.status(404).json({ error: 'Item não encontrado.' });

      return res.status(200).json({ message: 'Item removido do estoque.' });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao excluir item do estoque.' });
    }
  }
}

export default new InventoryController();