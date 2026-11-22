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
import { Clock3, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import ContributionModal from './ContributionModal';

// Card único usado no Feed e no mural da ONG, pra garantir o mesmo visual nos dois lugares.
const PostCard = ({ post, ongName, ongAvatar, compact = false }) => {
  const [isArrecadation, setIsArrecadation] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [campaignClosed, setCampaignClosed] = useState(true)
  const [isArrecadationModalOpened, setIsArrecadationModalOpened] = useState(false)

  function diffInDays(deadline) {
    if(!deadline) return 0

    const now = new Date();
    const deadlineDate = new Date(deadline);

    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const deadlineDay = new Date(
      deadlineDate.getFullYear(),
      deadlineDate.getMonth(),
      deadlineDate.getDate()
    );

    return Math.round(
      (deadlineDay - today) / (1000 * 60 * 60 * 24)
    );

  }

  function formatDeadline(deadline) {
    if (!deadline) return 'Prazo não definido';

    const diff = diffInDays(deadline)

    if (diff < 0) {
      return 'Campanha encerrada';
    }

    if (diff === 0) {
      return 'Encerra hoje';
    }

    if (diff === 1) {
      return 'Encerra amanhã';
    }

    return `Encerra em ${diff} dias`;
  }

  function formatDeadlineDate(deadline) {
    if (!deadline) return 'Prazo não definido';

    const date = new Date(deadline);

    if (Number.isNaN(date.getTime())) {
      return 'Data inválida';
    }

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  useEffect(() => {
    const percentage = post.fundraisingGoal > 0 ? Math.min(
      100,
      Math.round((post.amountRaised / post.fundraisingGoal) * 100)
    ) : 0;

    if(diffInDays(post.fundraisingDeadline) >= 0) {
      setCampaignClosed(false)
    } else {
      setCampaignClosed(true)
    }

    if (post.fundraisingGoal > 0) {

      setIsArrecadation(true);

      setProgressPercentage(percentage);
    }

  }, [post])

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

        {isArrecadation && //aaaaaaaaaaaaaaaaaaaaaaaaa
          <div className="arrecadation-container">
            <section
              className="post-card-fundraising"
              aria-label="Progresso da arrecadação"
            >
              <div className="post-card-progress-header">
                <div>
                  <span className="post-card-progress-label">
                    Arrecadação atual:
                  </span>

                  <strong>
                    {post.amountRaised} de {post.fundraisingGoal}
                  </strong> arrecados
                </div>

                <span className="post-card-progress-percentage">
                  {progressPercentage}%
                </span>
              </div>

              <div
                className="post-card-progress-track"
                role="progressbar"
                aria-label="Meta de arrecadação"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progressPercentage}
              >
                <div
                  className="post-card-progress-fill"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <span className="post-card-progress-caption">
                {parseFloat(post.amountRaised) >= parseFloat(post.fundraisingGoal)
                  ? 'Meta alcançada!'
                  : `Faltam ${Math.max(0, post.fundraisingGoal - post.amountRaised)}`}
              </span>
            </section>
            <div className="post-card-deadline">
              <Clock3 size={18} aria-hidden="true" />

              <div>
                <strong>{formatDeadline(post.fundraisingDeadline)}</strong>
                <span>Prazo final: {formatDeadlineDate(post.fundraisingDeadline)}</span>
              </div>
            </div>
            <button
              type="button"
              className="post-card-donate-button"
              onClick={() => {setIsArrecadationModalOpened(true)
              }}
              disabled={campaignClosed}
            >
              <Heart size={18} aria-hidden="true" />

              {campaignClosed
                ? 'Campanha encerrada'
                : 'Quero contribuir'}
            </button>
          </div>
        }
      </div>

        {isArrecadationModalOpened && (<ContributionModal 
          post={post}
          onClose={() => setIsArrecadationModalOpened(false)}
          onConfirm={() => {}}
          // loading={}
        />)}
    </article>
  );
}

export default PostCard;
