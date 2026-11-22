import React from 'react';
import { Pencil, Trash2, Clock, Target } from 'lucide-react';

const currency = (value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

const daysLeft = (deadline) => Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));

// Card de post usado na tela de gerenciamento (com ações de editar/excluir),
// diferente do PostCard usado no mural público somente para leitura.
const ManagePostCard = ({ post, onEdit, onDelete }) => {
  const isCollection = Number(post.fundraisingGoal) > 0;
  const remaining = isCollection ? daysLeft(post.fundraisingDeadline) : null;
  const progress = isCollection
    ? Math.min(100, Math.round((Number(post.amountRaised) / Number(post.fundraisingGoal)) * 100))
    : 0;

  return (
    <article className="manage-post-card">
      {post.image && (
        <div className="manage-post-image">
          <img src={post.image} alt={post.title} />
        </div>
      )}
      <div className="manage-post-body">
        <div className="manage-post-header">
          <h3>{post.title}</h3>
        </div>
        <p className="manage-post-content">{post.content}</p>

        {isCollection && (
          <>
            <div className="manage-post-goal">
              <span><Target size={14} /> {currency(post.amountRaised)} de {currency(post.fundraisingGoal)}</span>
              <span><Clock size={14} /> {remaining >= 0 ? `${remaining} dia(s) restante(s)` : 'Prazo encerrado'}</span>
            </div>
            <div className="post-progress-bar">
              <div className="post-progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </>
        )}

        <div className="manage-post-actions">
          <button type="button" className="btn-icon-ghost" onClick={() => onEdit(post)}>
            <Pencil size={16} /> Editar
          </button>
          <button type="button" className="btn-icon-ghost btn-icon-ghost--danger" onClick={() => onDelete(post)}>
            <Trash2 size={16} /> Excluir
          </button>
        </div>
      </div>
    </article>
  );
};

export default ManagePostCard;
