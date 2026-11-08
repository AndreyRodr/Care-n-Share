import React from 'react';
import { Target, Clock, PackageCheck } from 'lucide-react';

const currency = (value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

const daysLeft = (deadline) => Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));

// Card único usado no Feed e no mural da ONG, pra garantir o mesmo visual nos dois lugares.
const PostCard = ({ post, ongName, ongAvatar, compact = false, onCheckin }) => {
  const isCollection = Number(post.fundraisingGoal) > 0;
  const remaining = isCollection ? daysLeft(post.fundraisingDeadline) : null;
  const progress = isCollection
    ? Math.min(100, Math.round((Number(post.amountRaised) / Number(post.fundraisingGoal)) * 100))
    : 0;

  return (
    <article className={`post-card ${compact ? 'post-card--compact' : ''}`}>
      {ongName && (
        <header className="post-card-header">
          <img
            src={ongAvatar || `https://ui-avatars.com/api/?name=${ongName}&background=random&size=150`}
            alt={ongName}
            className="post-card-avatar"
          />
          <div>
            <h4 className="post-card-ong">{ongName}</h4>
            <time className="post-card-date">{new Date(post.createdAt).toLocaleDateString('pt-BR')}</time>
          </div>
        </header>
      )}

      {post.image && (
        <div className="post-card-media">
          <img src={post.image} alt={post.title} loading="lazy" />
        </div>
      )}

      <div className="post-card-body">
        {!ongName && (
          <time className="post-card-date">{new Date(post.createdAt).toLocaleDateString('pt-BR')}</time>
        )}
        <h3 className="post-card-title">{post.title}</h3>
        <p className="post-card-content">{post.content}</p>

        {isCollection && (
          <>
            <div className="post-card-goal">
              <span><Target size={14} /> {currency(post.amountRaised)} de {currency(post.fundraisingGoal)}</span>
              <span><Clock size={14} /> {remaining >= 0 ? `${remaining} dia(s) restante(s)` : 'Prazo encerrado'}</span>
            </div>
            <div className="post-progress-bar">
              <div className="post-progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </>
        )}

        {onCheckin && isCollection && remaining >= 0 && (
          <button type="button" className="btn-checkin" onClick={() => onCheckin(post)}>
            <PackageCheck size={16} /> Quero Doar
          </button>
        )}
      </div>
    </article>
  );
};

export default PostCard;
