import prisma from '../config/database.js';

class OngVerificationRepository {
  async findAll(status) {
    return prisma.ongVerification.findMany({
      where: status
        ? {
            ong: {
              verificationStatus: status
            }
          }
        : undefined,
      select: {
        id: true,
        cnpj: true,
        legalName: true,
        cnpjSituation: true,
        cnpjCheckedAt: true,
        validationProvider: true,
        rejectionReason: true,
        reviewedAt: true,
        createdAt: true,
        updatedAt: true,
        ong: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
            verificationStatus: true
          }
        },
        reviewedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
  }

  async findByOngId(ongId) {
    return prisma.ongVerification.findUnique({
      where: { ongId },
      select: {
        id: true,
        ongId: true,
        cnpj: true,
        legalName: true,
        cnpjSituation: true,
        cnpjCheckedAt: true,
        validationProvider: true,
        statuteDocumentPublicId: true,
        addressProofDocumentPublicId: true,
        rejectionReason: true,
        reviewedAt: true,
        ong: {
          select: {
            id: true,
            name: true,
            email: true,
            verificationStatus: true
          }
        }
      }
    });
  }

  async review({ ongId, status, rejectionReason, reviewedById }) {
    return prisma.$transaction(async (transaction) => {
      const verification = await transaction.ongVerification.findUnique({
        where: { ongId },
        select: { ongId: true }
      });

      if (!verification) {
        throw new Error('Solicitação de verificação não encontrada.');
      }

      await transaction.ongVerification.update({
        where: { ongId },
        data: {
          rejectionReason:
            status === 'REJECTED' ? rejectionReason : null,
          reviewedAt: new Date(),
          reviewedById
        }
      });

      return transaction.user.update({
        where: { id: ongId },
        data: {
          verificationStatus: status
        },
        select: {
          id: true,
          name: true,
          email: true,
          verificationStatus: true
        }
      });
    });
  }
}

export default new OngVerificationRepository();