import React, { useState } from 'react';
import { Target, Clock, PackageCheck, Heart, Clock3 } from 'lucide-react';
import ContributionModal from './ContributionModal';

const currency = (value) =>
  `R$ ${Number(value || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const diffInDays = (deadline) => {
  if (!deadline) return null;

  const deadlineDate = new Date(deadline);

  if (Number.isNaN(deadlineDate.getTime())) return null;

  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const deadlineDay = new Date(
    deadlineDate.getFullYear(),
    deadlineDate.getMonth(),
    deadlineDate.getDate()
  );

  return Math.round(
    (deadlineDay - today) / (1000 * 60 * 60 * 24)
  );
};

const formatDeadline = (deadline) => {
  const days = diffInDays(deadline);

  if (days === null) return 'Prazo não definido';
  if (days < 0) return 'Campanha encerrada';
  if (days === 0) return 'Encerra hoje';
  if (days === 1) return 'Encerra amanhã';

  return `Encerra em ${days} dias`;
};

const formatDeadlineDate = (deadline) => {
  if (!deadline) return 'Prazo não definido';

  const date = new Date(deadline);

  if (Number.isNaN(date.getTime())) return 'Data inválida';

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const PostCard = ({
  post,
  ongName,
  ongAvatar,
  compact = false,
  onCheckin,
  onConfirmContribution,
}) => {
  const [isContributionModalOpen, setIsContributionModalOpen] =
    useState(false);

  const fundraisingGoal = Number(post.fundraisingGoal) || 0;
  const amountRaised = Number(post.amountRaised) || 0;

  const isCollection = fundraisingGoal > 0;

  const remaining = diffInDays(post.fundraisingDeadline);

  const campaignClosed =
    remaining !== null && remaining < 0;

  const progress = isCollection
    ? Math.min(
        100,
        Math.max(0, Math.round((amountRaised / fundraisingGoal) * 100))
      )
    : 0;

  const amountRemaining = Math.max(
    0,
    fundraisingGoal - amountRaised
  );

  const handleContribution = () => {
    if (campaignClosed) return;

    if (onCheckin) {
      onCheckin(post);
      return;
    }

    setIsContributionModalOpen(true);
  };

  return (
    <article className={`post-card ${compact ? 'post-card--compact' : ''}`}>
      {ongName && (
        <header className="post-card-header">
          <img
            src={
              ongAvatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                ongName
              )}&background=random&size=150`
            }
            alt={ongName}
            className="post-card-avatar"
          />

          <div>
            <h4 className="post-card-ong">{ongName}</h4>

            <time className="post-card-date">
              {new Date(post.createdAt).toLocaleDateString('pt-BR')}
            </time>
          </div>
        </header>
      )}

      {post.image && (
        <div className="post-card-media">
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
          />
        </div>
      )}

      <div className="post-card-body">
        {!ongName && (
          <time className="post-card-date">
            {new Date(post.createdAt).toLocaleDateString('pt-BR')}
          </time>
        )}

        <h3 className="post-card-title">{post.title}</h3>

        <p className="post-card-content">{post.content}</p>

        {isCollection && (
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
                    {currency(amountRaised)} de {currency(fundraisingGoal)}
                  </strong>
                </div>

                <span className="post-card-progress-percentage">
                  {progress}%
                </span>
              </div>

              <div
                className="post-card-progress-track"
                role="progressbar"
                aria-label="Meta de arrecadação"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <div
                  className="post-card-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <span className="post-card-progress-caption">
                {progress >= 100
                  ? 'Meta alcançada!'
                  : `Faltam ${currency(amountRemaining)}`}
              </span>
            </section>

            <div className="post-card-goal">
              <span>
                <Target size={14} />
                {currency(amountRaised)} de {currency(fundraisingGoal)}
              </span>

              <span>
                <Clock size={14} />
                {remaining === null
                  ? 'Prazo não definido'
                  : remaining >= 0
                    ? `${remaining} dia(s) restante(s)`
                    : 'Prazo encerrado'}
              </span>
            </div>

            <div className="post-card-deadline">
              <Clock3 size={18} aria-hidden="true" />

              <div>
                <strong>{formatDeadline(post.fundraisingDeadline)}</strong>

                <span>
                  Prazo final: {formatDeadlineDate(post.fundraisingDeadline)}
                </span>
              </div>
            </div>

            <button
              type="button"
              className={
                onCheckin
                  ? 'btn-checkin'
                  : 'post-card-donate-button'
              }
              onClick={handleContribution}
              disabled={campaignClosed}
            >
              {onCheckin ? (
                <>
                  <PackageCheck size={16} />
                  Quero Doar
                </>
              ) : (
                <>
                  <Heart size={18} aria-hidden="true" />
                  {campaignClosed
                    ? 'Campanha encerrada'
                    : 'Quero contribuir'}
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {isContributionModalOpen && (
        <ContributionModal
          post={post}
          onClose={() => setIsContributionModalOpen(false)}
          onConfirm={onConfirmContribution}
        />
      )}
    </article>
  );
};

export default PostCard;