import React from 'react';

// Card único usado no Feed e no mural da ONG, pra garantir o mesmo visual nos dois lugares.
const PostCard = ({ post, ongName, ongAvatar, compact = false }) => (
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
    </div>
  </article>
);

export default PostCard;
