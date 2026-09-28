import inventoryRepository from '../repositories/InventoryRepository.js';

class InventoryController {
  async listItems(req, res) {
    try {
      const ongId = req.user.id;
      const { search, category, status } = req.query;
      const items = await inventoryRepository.findAllItems(ongId, { search, category, status });
      return res.status(200).json({ items });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getItem(req, res) {
    try {
      const { id } = req.params;
      const ongId = req.user.id;
      const item = await inventoryRepository.findItemById(id, ongId);
      if (!item) return res.status(404).json({ error: 'Item não encontrado.' });
      return res.status(200).json(item);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async createItem(req, res) {
    try {
      const ongId = req.user.id;
      const { itemName, category, unit, quantity, minimumQuantity } = req.body;

      if (!itemName || !category || !unit) {
        return res.status(400).json({ error: 'Os campos itemName, category e unit são obrigatórios.' });
      }

      const item = await inventoryRepository.createItem(ongId, {
        itemName,
        category,
        unit,
        quantity,
        minimumQuantity
      });

      return res.status(201).json(item);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async updateItem(req, res) {
    try {
      const { id } = req.params;
      const ongId = req.user.id;
      const { itemName, category, unit, minimumQuantity } = req.body;

      const updated = await inventoryRepository.updateItem(id, ongId, {
        itemName,
        category,
        unit,
        minimumQuantity
      });

      if (!updated) return res.status(404).json({ error: 'Item não encontrado.' });
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async deleteItem(req, res) {
    try {
      const { id } = req.params;
      const ongId = req.user.id;
      const result = await inventoryRepository.deleteItem(id, ongId);
      if (result.count === 0) return res.status(404).json({ error: 'Item não encontrado.' });
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async listMovements(req, res) {
    try {
      const { id } = req.params;
      const ongId = req.user.id;
      const { type, startDate, endDate, page, limit } = req.query;

      const data = await inventoryRepository.findMovements(id, ongId, {
        type,
        startDate,
        endDate,
        page,
        limit
      });

      if (!data) return res.status(404).json({ error: 'Item não encontrado.' });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async createMovement(req, res) {
    try {
      const { id } = req.params;
      const ongId = req.user.id;
      const userId = req.user.id;
      const { type, quantity, reason } = req.body;

      if (!type || !['ENTRADA', 'SAIDA'].includes(type)) {
        return res.status(400).json({ error: "O tipo de movimentação deve ser 'ENTRADA' ou 'SAIDA'." });
      }

      if (!quantity || quantity <= 0) {
        return res.status(400).json({ error: 'A quantidade deve ser maior que zero.' });
      }

      if (!reason) {
        return res.status(400).json({ error: 'O motivo da movimentação é obrigatório.' });
      }

      const result = await inventoryRepository.createMovement(ongId, id, userId, { type, quantity, reason });
      return res.status(201).json(result);
    } catch (error) {
      if (error.code) {
        return res.status(error.code).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new InventoryController();