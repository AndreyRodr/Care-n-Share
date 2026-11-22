import React from 'react';
import { X, PackageCheck, Trash2 } from 'lucide-react';

const statusLabel = {
  PENDING: 'Aguardando confirmação da ONG'
};

// Lista as intenções de doação (check-ins) que o doador sinalizou nos posts
// de arrecadação. Dado 100% local — ver aviso em hooks/useDonationCheckins.js.
const MyDonationsModal = ({ checkins, onClose, onRemove }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <div>
          <h2>Minhas Doações</h2>
          <p>Itens que você sinalizou que vai entregar pras ONGs que apoia.</p>
        </div>
        <button className="modal-close-btn" onClick={onClose} aria-label="Fechar">
          <X size={22} />
        </button>
      </div>

      {checkins.length === 0 ? (
        <p style={{ color: 'rgba(var(--rgb-text), 0.5)', textAlign: 'center', padding: '2rem 0' }}>
          Você ainda não sinalizou nenhuma doação.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
          {checkins.map((checkin) => (
            <div key={checkin.id} className="my-donation-item">
              <div className="my-donation-icon">
                <PackageCheck size={18} />
              </div>
              <div className="my-donation-info">
                <strong>{checkin.itemName}</strong>
                <span>{checkin.quantity} unidade(s) {checkin.note ? `— ${checkin.note}` : ''}</span>
                <span className="donation-status-pill">{statusLabel[checkin.status] || checkin.status}</span>
              </div>
              <button type="button" className="btn-icon-ghost btn-icon-ghost--danger" onClick={() => onRemove(checkin.id)} aria-label="Remover">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default MyDonationsModal;
