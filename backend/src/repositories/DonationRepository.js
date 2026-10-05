import { log } from "node:console";
import prisma from "../config/database.js";

class DonationRepository {
  async create(data) {
    return await prisma.donationCheckin.create({
      data,
      include: {
        donor: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, title: true } },
      },
    });
  }

  async findAll(ongId, { search, status, contributionType }) {
    const whereCondition = { ongId };

    // Busca por nome do doador ou item
    if (search) {
      whereCondition.OR = [
        {
          donor: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          itemName: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Filtro por status
    if (
      status &&
      status.toUpperCase() !== "TODOS" &&
      status.toUpperCase() !== "ALL"
    ) {
      const statusMap = {
        PENDENTE: "PENDING",
        PENDING: "PENDING",

        CONCLUIDA: "CHECKED_IN",
        CONCLUÍDA: "CHECKED_IN",
        CHECKED_IN: "CHECKED_IN",

        CANCELADO: "CANCELLED",
        CANCELADA: "CANCELLED",
        CANCELLED: "CANCELLED",
      };

      const normalizedStatus = status.toUpperCase();
      const mappedStatus = statusMap[normalizedStatus];

      if (mappedStatus) {
        whereCondition.status = mappedStatus;
      }
    }

    // Filtro por tipo de contribuição
    if (
      contributionType &&
      contributionType.toUpperCase() !== "TODOS" &&
      contributionType.toUpperCase() !== "ALL"
    ) {
      whereCondition.type = contributionType.toUpperCase();
    }

    return await prisma.donationCheckin.findMany({
      where: whereCondition,
      include: {
        donor: {
          select: {
            id: true,
            name: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id, ongId) {
    return await prisma.donationCheckin.findFirst({
      where: { id, ongId },
      include: {
        donor: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, title: true } },
        validatedBy: { select: { id: true, name: true } },
      },
    });
  }

  async update(id, ongId, data) {
    return await prisma.donationCheckin.updateMany({
      where: { id, ongId },
      data,
    });
  }

  async complete(id, ongId) {
    const donation = await prisma.donationCheckin.findFirst({
      where: { id, ongId },
    });
    if (!donation) throw new Error("NOT_FOUND");
    if (donation.status !== "PENDING") throw new Error("NOT_PENDING");

    return await prisma.$transaction(async (tx) => {
      const updated = await tx.donationCheckin.update({
        where: { id },
        data: {
          status: "CHECKED_IN",
          checkedInAt: new Date(),
          validatedById: ongId,
        },
      });

      await tx.ongInventory.upsert({
        where: {
          ongId_itemName_unit: {
            ongId: donation.ongId,
            itemName: donation.itemName,
            unit: donation.unit,
          },
        },
        update: {
          quantity: { increment: donation.quantity },
        },
        create: {
          ongId: donation.ongId,
          itemName: donation.itemName,
          category: donation.category,
          unit: donation.unit,
          quantity: donation.quantity,
        },
      });

      return updated;
    });
  }

  async cancel(id, ongId) {
    const donation = await prisma.donationCheckin.findFirst({
      where: { id, ongId },
    });
    if (!donation) throw new Error("NOT_FOUND");

    return await prisma.donationCheckin.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
  }

  async delete(id, ongId) {
    return await prisma.donationCheckin.deleteMany({
      where: { id, ongId },
    });
  }
}

export default new DonationRepository();
