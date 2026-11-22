import React from 'react';
import { X, FileText, Target } from 'lucide-react';

// Primeiro passo do fluxo de criação de post: a ONG escolhe entre um post
// comum e uma campanha de arrecadação com meta e prazo.
const PostTypeModal = ({ onSelect, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-container" style={{ maxWidth: '32rem' }} onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <div>
          <h2>Nova publicação</h2>
          <p>Escolha o tipo de conteúdo que você quer publicar no mural.</p>
        </div>
        <button className="modal-close-btn" onClick={onClose} aria-label="Fechar">
          <X size={22} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
        <button type="button" className="post-type-option" onClick={() => onSelect('SIMPLES')}>
          <span className="post-type-option-icon">
            <FileText size={22} />
          </span>
          <span className="post-type-option-text">
            <strong>Postagem Simples</strong>
            <small>Anúncios, novidades e agradecimentos com texto e foto.</small>
          </span>
        </button>

        <button type="button" className="post-type-option" onClick={() => onSelect('ARRECADACAO')}>
          <span className="post-type-option-icon post-type-option-icon--accent">
            <Target size={22} />
          </span>
          <span className="post-type-option-text">
            <strong>Postagem de Arrecadação</strong>
            <small>Defina a meta em R$ e o prazo da campanha.</small>
          </span>
        </button>
      </div>
    </div>
  </div>
);

export default PostTypeModal;
