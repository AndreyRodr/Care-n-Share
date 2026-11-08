import React, { useState } from 'react';
import { PackageCheck, X } from 'lucide-react';

// Modal de "check-in" de doação (RF14): o doador sinaliza a intenção de
// entregar um item físico pra uma campanha de arrecadação específica.
// O back ainda não tem endpoint público pra isso — ver aviso em
// hooks/useDonationCheckins.js. Aqui só coletamos os dados e confirmamos.
const DonationCheckinModal = ({ post, onClose, onSubmit }) => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!itemName.trim()) {
      setError('Diga o que você vai doar (ex: ração, agasalho...).');
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      setError('Informe uma quantidade maior que zero.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        postId: post.id,
        ongId: post.ongId,
        itemName,
        quantity: Number(quantity),
        note
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '28rem' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Quero Doar</h2>
            <p>Sinalize que vai entregar um item físico para "{post.title}".</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Fechar">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <input
            type="text"
            placeholder="O que você vai doar? (ex: ração, agasalho...)"
            className="form-input"
            style={{ paddingLeft: '1.5rem' }}
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <input
            type="number"
            min="1"
            placeholder="Quantidade"
            className="form-input"
            style={{ paddingLeft: '1.5rem' }}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <textarea
            placeholder="Alguma observação pra ONG? (opcional)"
            rows="2"
            className="form-input"
            style={{ paddingLeft: '1.5rem', resize: 'none' }}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>

          {error && <p className="form-error-text">{error}</p>}

          <button type="submit" disabled={loading} className="btn-submit">
            <PackageCheck size={20} /> {loading ? 'Enviando...' : 'Confirmar Intenção de Doar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonationCheckinModal;
