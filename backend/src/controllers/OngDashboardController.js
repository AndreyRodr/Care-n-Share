import ongDashboardRepository from '../repositories/OngDashboardRepository.js';

class OngDashboardController {
  async getSummary(req, res) {
    try {
      const ongId = req.user.id;
      const data = await ongDashboardRepository.getSummary(ongId);
      return res.status(200).json(data);
    } catch (error) {
      console.error('Erro ao buscar resumo do dashboard:', error);
      return res.status(400).json({ error: 'Erro ao buscar resumo do dashboard' });
    }
  }

  async getDonations(req, res) {
    try {
      const ongId = req.user.id;
      const data = await ongDashboardRepository.getDonationsGraphData(ongId);
      return res.status(200).json(data);
    } catch (error) {
      console.error('Erro ao buscar dados de gráficos:', error);
      return res.status(400).json({ error: 'Erro ao buscar dados de doações' });
    }
  }

  async getGoals(req, res) {
    try {
      const ongId = req.user.id;
      const goals = await ongDashboardRepository.getGoalsProgress(ongId);
      return res.status(200).json(goals);
    } catch (error) {
      console.error('Erro ao buscar progresso das metas:', error);
      return res.status(400).json({ error: 'Erro ao buscar metas' });
    }
  }

  async getVolunteers(req, res) {
    try {
      const ongId = req.user.id;
      const stats = await ongDashboardRepository.getVolunteersStats(ongId);
      return res.status(200).json(stats);
    } catch (error) {
      console.error('Erro ao buscar estatísticas de voluntários:', error);
      return res.status(400).json({ error: 'Erro ao buscar dados de voluntários' });
    }
  }

  async getActivity(req, res) {
    try {
      const ongId = req.user.id;
      const activities = await ongDashboardRepository.getRecentActivity(ongId);
      return res.status(200).json(activities);
    } catch (error) {
      console.error('Erro ao buscar atividades recentes:', error);
      return res.status(400).json({ error: 'Erro ao buscar atividades' });
    }
  }
}

export default new OngDashboardController();