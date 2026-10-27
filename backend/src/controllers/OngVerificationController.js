import ongVerificationRepository from '../repositories/OngVerificationRepository.js';
import { createPrivateDocumentAccessUrl } from '../config/cloudinary.js';

class OngVerificationController {
  async list(req, res) {
    try {
      const { status } = req.validatedQuery;

      const verifications = await ongVerificationRepository.findAll(status);
      return res.status(200).json(verifications);
    } catch (error) {
      console.error('Erro ao listar verificações:', error);
      return res.status(500).json({
        error: 'Não foi possível listar as solicitações de verificação.'
      });
    }
  }

  async review(req, res) {
    try {
      const ongId = req.params.id;
      const { status, rejectionReason } = req.body;

      const updatedOng = await ongVerificationRepository.review({
        ongId,
        status,
        rejectionReason,
        reviewedById: req.user.id
      });

      return res.status(200).json({
        message:
          status === 'APPROVED'
            ? 'ONG aprovada com sucesso.'
            : 'ONG rejeitada com sucesso.',
        ong: updatedOng
      });
    } catch (error) {
      if (error.message === 'Solicitação de verificação não encontrada.') {
        return res.status(404).json({ error: error.message });
      }

      console.error('Erro ao revisar ONG:', error);
      return res.status(500).json({
        error: 'Não foi possível revisar a ONG.'
      });
    }
  }

    async getDocumentAccessUrl(req, res) {
    try {
      const ongId = req.params.id;
      const documentType = req.params.documentType;

      const verification =
        await ongVerificationRepository.findByOngId(ongId);

      if (!verification) {
        return res.status(404).json({
          error: 'Solicitação de verificação não encontrada.'
        });
      }

      const documents = {
        statute: {
          publicId: verification.statuteDocumentPublicId,
          fileName: 'estatuto-social.pdf'
        },
        addressProof: {
          publicId: verification.addressProofDocumentPublicId,
          fileName: 'comprovante-de-endereco.pdf'
        }
      };

      const document = documents[documentType];

      if (!document?.publicId) {
        return res.status(400).json({
          error: 'Tipo de documento inválido.'
        });
      }

      const basePath =
        `/api/admin/ong-verifications/${ongId}/documents/${documentType}`;

      return res.status(200).json({
        url: createPrivateDocumentAccessUrl(
          document.publicId,
          document.fileName
        ),
        previewUrl: `${basePath}/preview`,
        expiresInSeconds: 300
      });
    } catch (error) {
      console.error('Erro ao gerar acesso ao documento:', error);

      return res.status(500).json({
        error: 'Não foi possível abrir o documento.'
      });
    }
  }

  async previewDocument(req, res) {
    try {
      const ongId = req.params.id;
      const documentType = req.params.documentType;

      const verification =
        await ongVerificationRepository.findByOngId(ongId);

      if (!verification) {
        return res.status(404).json({
          error: 'Solicitação de verificação não encontrada.'
        });
      }

      const documents = {
        statute: {
          publicId: verification.statuteDocumentPublicId,
          fileName: 'estatuto-social.pdf'
        },
        addressProof: {
          publicId: verification.addressProofDocumentPublicId,
          fileName: 'comprovante-de-endereco.pdf'
        }
      };

      const document = documents[documentType];

      if (!document?.publicId) {
        return res.status(400).json({
          error: 'Tipo de documento inválido.'
        });
      }

      const cloudinaryResponse = await fetch(
        createPrivateDocumentAccessUrl(
          document.publicId,
          document.fileName
        )
      );

      if (!cloudinaryResponse.ok) {
        throw new Error(
          `Cloudinary respondeu com status ${cloudinaryResponse.status}.`
        );
      }

      const documentBuffer = Buffer.from(
        await cloudinaryResponse.arrayBuffer()
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${document.fileName}"`
      );

      return res.status(200).send(documentBuffer);
    } catch (error) {
      console.error('Erro ao pré-visualizar documento:', error);

      return res.status(500).json({
        error: 'Não foi possível carregar a pré-visualização do documento.'
      });
    }
  }
}

export default new OngVerificationController();