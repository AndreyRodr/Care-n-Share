import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { X, LayoutList } from 'lucide-react';
import PostCard from './PostCard.jsx';

const OngModal = ({ ong, onClose }) => {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Busca os posts da ONG específica assim que o modal é aberto
  useEffect(() => {
    const fetchOngPosts = async () => {
      try {
        const res = await api.get(`/api/posts/ong/${ong.id}`);
        const sortedPosts = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
      } catch (error) {
        console.error('Erro ao buscar publicações da ONG:', error);
      } finally {
        setLoadingPosts(false);
      }
    };

    if (ong?.id) {
      fetchOngPosts();
    }
  }, [ong]);

  if (!ong) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000, padding: '1rem'
    }} onClick={onClose}>
      
      <div style={{
        backgroundColor: 'var(--cozy-bg)', width: '100%', maxWidth: '42rem',
        maxHeight: '90vh', borderRadius: '2rem', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        position: 'relative'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Botão Fechar */}
        <button 
          onClick={onClose}
          aria-label="Fechar"
          style={{
            position: 'absolute', top: '1rem', right: '1rem', zIndex: 10,
            background: 'var(--cozy-card)', border: 'none', borderRadius: '50%',
            width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
          }}
        >
          <X size={20} color="var(--cozy-text)" />
        </button>

        <div style={{ overflowY: 'auto', flex: 1, padding: '2rem' }}>
          
          {/* Cabeçalho da ONG */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img 
              src={ong.profilePicture || `https://ui-avatars.com/api/?name=${ong.name}&background=random&size=150`} 
              alt={ong.name} 
              style={{
                width: '8rem', height: '8rem', borderRadius: '2.5rem', objectFit: 'cover',
                marginBottom: '1.5rem', border: '4px solid var(--cozy-card)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
              }} 
            />
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--cozy-text)', marginBottom: '0.5rem' }}>{ong.name}</h2>
            {ong.pixKey && (
              <div style={{ display: 'inline-block', backgroundColor: 'var(--cozy-card)', padding: '0.5rem 1rem', borderRadius: '1rem', fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--cozy-accent)', marginBottom: '1rem' }}>
                Chave PIX: {ong.pixKey}
              </div>
            )}
          </div>

          {/* Descrição */}
          <div style={{ backgroundColor: 'var(--cozy-card)', padding: '1.5rem', borderRadius: '1.5rem', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.75rem', color: 'var(--cozy-text)' }}>Sobre o projeto</h3>
            <p style={{ color: 'rgba(var(--rgb-text), 0.8)', lineHeight: '1.8' }}>
              {ong.description || 'Esta ONG ainda não adicionou uma descrição detalhada.'}
            </p>
          </div>

          <hr style={{ border: 'none', borderTop: '2px solid rgba(var(--rgb-accent), 0.1)', margin: '2rem 0' }} />

          {/* Seção de Publicações */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--cozy-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LayoutList size={20} />
              Últimas Publicações
            </h3>

            {loadingPosts ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                <div style={{ width: '2rem', height: '2rem', borderTop: '3px solid var(--cozy-accent)', borderRight: '3px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              </div>
            ) : posts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--cozy-card)', borderRadius: '1.5rem' }}>
                <p style={{ color: 'rgba(var(--rgb-text), 0.5)', fontWeight: 'bold' }}>Nenhuma publicação encontrada.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {posts.map(post => (
                  <PostCard key={post.id} post={post} compact />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default OngModal;