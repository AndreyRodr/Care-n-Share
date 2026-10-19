import { useEffect, useState } from 'react';
import { Check, FileText, ShieldCheck, X } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import api from '../services/api.js';

export default function AdminOngVerifications() {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  
  const loadVerifications = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get(
        '/api/admin/ong-verifications?status=PENDING'
      );

      setVerifications(response.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          'Não foi possível carregar as solicitações.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVerifications();
  }, []);

  
  const openDocument = async (ongId, documentType, title) => {
    try {
        const response = await api.get(
        `/api/admin/ong-verifications/${ongId}/documents/${documentType}`
        );

        setSelectedDocument({
        title,
        downloadUrl: response.data.url,
        previewUrl: api.getUri({ url: response.data.previewUrl })
        });
    } catch (requestError) {
        window.alert(
        requestError.response?.data?.error ||
            'Não foi possível abrir o documento.'
        );
    }
    };
  const review = async (verification, status) => {
    let rejectionReason;

    if (status === 'REJECTED') {
      rejectionReason = window.prompt(
        'Informe o motivo da rejeição (mínimo de 5 caracteres):'
      );

      if (!rejectionReason) return;
    }

    setActionLoadingId(verification.ong.id);

    try {
      await api.patch(
        `/api/admin/ong-verifications/${verification.ong.id}`,
        {
          status,
          ...(status === 'REJECTED' ? { rejectionReason } : {})
        }
      );

      setVerifications((current) =>
        current.filter((item) => item.ong.id !== verification.ong.id)
      );
    } catch (requestError) {
      window.alert(
        requestError.response?.data?.error ||
          'Não foi possível concluir a revisão.'
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="app-wrapper">
      <Navbar />

      <main className="admin-verifications-main">
        <header className="admin-verifications-header">
          <div>
            <p className="admin-verifications-eyebrow">
              Backoffice
            </p>
            <h1>Verificação de ONGs</h1>
            <p>
              Revise o CNPJ e os documentos antes de liberar ações de
              arrecadação.
            </p>
          </div>

          <ShieldCheck size={42} />
        </header>

        {loading && (
          <div className="admin-verifications-feedback">
            Carregando solicitações...
          </div>
        )}

        {!loading && error && (
          <div className="admin-verifications-feedback admin-verifications-error">
            {error}
          </div>
        )}

        {!loading && !error && verifications.length === 0 && (
          <div className="admin-verifications-feedback">
            Não há ONGs pendentes de análise.
          </div>
        )}

        {!loading && !error && verifications.length > 0 && (
          <section className="admin-verifications-list">
            {verifications.map((verification) => {
              const isActing =
                actionLoadingId === verification.ong.id;

              return (
                <article
                  className="admin-verification-card"
                  key={verification.id}
                >
                  <div className="admin-verification-card-header">
                    <div>
                      <h2>{verification.ong.name}</h2>
                      <p>{verification.ong.email}</p>
                    </div>

                    <span className="admin-verification-status">
                      Pendente
                    </span>
                  </div>

                  <dl className="admin-verification-details">
                    <div>
                      <dt>CNPJ</dt>
                      <dd>{verification.cnpj}</dd>
                    </div>

                    <div>
                      <dt>Razão social</dt>
                      <dd>{verification.legalName || 'Não informada'}</dd>
                    </div>

                    <div>
                      <dt>Situação cadastral</dt>
                      <dd>{verification.cnpjSituation || 'Não informada'}</dd>
                    </div>

                    <div>
                      <dt>Fonte da consulta</dt>
                      <dd>{verification.validationProvider || 'Não informada'}</dd>
                    </div>
                  </dl>

                  <div className="admin-verification-documents">
                    <button
                      type="button"
                      onClick={() =>
                        openDocument(
                            verification.ong.id,
                            'statute',
                            'Estatuto social'
                        )
                        }
                    >
                      <FileText size={17} />
                      Abrir estatuto social
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openDocument(
                            verification.ong.id,
                            'addressProof',
                            'Comprovante de endereço'
                        )
                        }
                    >
                      <FileText size={17} />
                      Abrir comprovante de endereço
                    </button>
                  </div>

                  <div className="admin-verification-actions">
                    <button
                      type="button"
                      className="admin-reject-button"
                      disabled={isActing}
                      onClick={() => review(verification, 'REJECTED')}
                    >
                      <X size={17} />
                      Rejeitar
                    </button>

                    <button
                      type="button"
                      className="admin-approve-button"
                      disabled={isActing}
                      onClick={() => review(verification, 'APPROVED')}
                    >
                      <Check size={17} />
                      {isActing ? 'Processando...' : 'Aprovar ONG'}
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {selectedDocument && (
            <div
                className="document-preview-overlay"
                role="dialog"
                aria-modal="true"
                aria-label={selectedDocument.title}
            >
                <section className="document-preview-modal">
                <header className="document-preview-header">
                    <h2>{selectedDocument.title}</h2>

                    <button
                    type="button"
                    onClick={() => setSelectedDocument(null)}
                    aria-label="Fechar visualização"
                    >
                    <X size={20} />
                    </button>
                </header>

                <iframe
                    src={selectedDocument.previewUrl}
                    title={selectedDocument.title}
                    className="document-preview-frame"
                />

                <footer className="document-preview-footer">
                    <button
                    type="button"
                    onClick={() => setSelectedDocument(null)}
                    >
                    Fechar
                    </button>

                    <a
                    href={selectedDocument.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-approve-button"
                    >
                    Baixar PDF
                    </a>
                </footer>
                </section>
            </div>
        )}
      </main>
    </div>
  );
}