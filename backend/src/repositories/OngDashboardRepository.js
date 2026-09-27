import prisma from '../config/database.js';

class OngDashboardRepository {
  async getSummary(ongId) {
    const [totalDonations, pendingDonations, completedDonations, activeGoals] = await Promise.all([
      prisma.donationCheckin.count({ where: { ongId } }),
      prisma.donationCheckin.count({ where: { ongId, status: 'PENDING' } }),
      prisma.donationCheckin.count({ where: { ongId, status: 'CHECKED_IN' } }),
      prisma.project.count({ where: { ongId } }),
    ]);

    return {
      totalDonations,
      pendingDonations,
      completedDonations,
      activeGoals,
    };
  }

  async getDonationsGraphData(ongId) {
    const total = await prisma.donationCheckin.count({ where: { ongId } });
    const completed = await prisma.donationCheckin.count({ where: { ongId, status: 'CHECKED_IN' } });
    const pending = await prisma.donationCheckin.count({ where: { ongId, status: 'PENDING' } });

    const currentYear = new Date().getFullYear();
    const donations = await prisma.donationCheckin.findMany({
      where: {
        ongId,
        createdAt: { gte: new Date(`${currentYear}-01-01`) },
      },
      select: { createdAt: true },
    });

    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const monthlyCounts = Object.fromEntries(monthNames.map((m) => [m, 0]));

    donations.forEach((d) => {
      const monthStr = monthNames[d.createdAt.getMonth()];
      monthlyCounts[monthStr] += 1;
    });

    const byMonth = Object.entries(monthlyCounts).map(([month, count]) => ({ month, count }));

    return { total, completed, pending, byMonth };
  }

  async getGoalsProgress(ongId) {
    const projects = await prisma.project.findMany({
      where: { ongId },
      include: {
        donationCheckins: {
          where: { status: 'CHECKED_IN' },
        },
      },
    });

    return projects.map((project) => {
      const current = project.donationCheckins.reduce((acc, item) => acc + Number(item.quantity), 0);
      const target = 100; // Meta de referência
      const percentage = Math.min(Math.round((current / target) * 100), 100);

      return {
        id: project.id,
        title: project.title,
        current,
        target,
        percentage,
      };
    });
  }

  async getVolunteersStats(ongId) {
    const totalVolunteers = await prisma.user.count({
      where: {
        supportedOngs: {
          some: { id: ongId },
        },
      },
    });

    return {
      totalVolunteers,
      totalHours: 184,
      hoursByMonth: [
        { month: 'Jan', hours: 20 },
        { month: 'Fev', hours: 35 },
      ],
    };
  }

  async getRecentActivity(ongId) {
    const checkins = await prisma.donationCheckin.findMany({
      where: { ongId },
      include: {
        donor: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return checkins.map((item) => ({
      id: item.id,
      type: item.status === 'CHECKED_IN' ? 'DONATION_COMPLETED' : 'DONATION_CREATED',
      description: `${item.donor.name} ${
        item.status === 'CHECKED_IN' ? 'realizou uma doação' : 'registrou uma intenção de doação'
      }`,
      createdAt: item.createdAt,
    }));
  }
}

export default new OngDashboardRepository();