import { Clock3, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

// Card único usado no Feed e no mural da ONG, pra garantir o mesmo visual nos dois lugares.
const PostCard = ({ post, ongName, ongAvatar, compact = false }) => {
  const [isArrecadation, setIsArrecadation] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);

  function formatDeadline(deadline) {
    if (!deadline) return 'Prazo não definido';

    const deadlineDate = new Date(deadline);

    if (Number.isNaN(deadlineDate.getTime())) {
      return 'Data inválida';
    }

    const now = new Date();

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

    const diffInDays = Math.round(
      (deadlineDay - today) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays < 0) {
      return 'Campanha encerrada';
    }

    if (diffInDays === 0) {
      return 'Encerra hoje';
    }

    if (diffInDays === 1) {
      return 'Encerra amanhã';
    }

    return `Encerra em ${diffInDays} dias`;
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

    if (post.fundraisingGoal > 0) {
      console.log(post);

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
              onClick={() => { console.log('a') }}
            // disabled={campaignClosed}
            >
              <Heart size={18} aria-hidden="true" />

              {/* {campaignClosed
                ? 'Campanha encerrada'
                : 'Quero contribuir'} */}
            </button>
          </div>
        }
      </div>
    </article>
  );
}

export default PostCard;
