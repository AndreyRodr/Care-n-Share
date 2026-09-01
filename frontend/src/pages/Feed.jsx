import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import { Sparkles, Heart, Users, HeartOff, PlusCircle, Compass, LayoutList } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import PostForm from '../components/PostForm.jsx';
import PostCard from '../components/PostCard.jsx';
import OngModal from '../components/OngModal.jsx';
import PixModal from '../components/PixModal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import usePageTitle from '../hooks/usePageTitle.js';
import { toast } from '../utils/toast.js';

const Feed = () => {
  usePageTitle('Feed Solidário');
  const [ongs, setOngs] = useState([]);
  const [userSupports, setUserSupports] = useState([]);
  const [feedPosts, setFeedPosts] = useState([]); // Guarda os posts do feed do usuário
  const user = JSON.parse(localStorage.getItem('user'));
  // 'explore' (Descobrir ONGs) ou 'feed' (Meu Feed/Meu Mural, dependendo do tipo de conta)
  const [activeTab, setActiveTab] = useState(user?.type === 'O' ? 'feed' : 'explore');
  const [loading, setLoading] = useState(true);
  const [selectedOng, setSelectedOng] = useState(null);
  const [showPixModal, setShowPixModal] = useState(null);
  const [confirmStopOng, setConfirmStopOng] = useState(null);
  const [supportingId, setSupportingId] = useState(null);

  const fetchData = async () => {
    try {
      if (!user) {
        setLoading(false);
        return;
      }

      // 1. Execução isolada para usuário ONG
      if (user.type === 'O') {
        const [postsRes, ongsRes] = await Promise.all([
          api.get(`/api/posts/ong/${user.id}`),
          api.get('/api/ongs'),
        ]);

        const myPosts = postsRes.data.map(post => ({ ...post, ong: user }));
        myPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setFeedPosts(myPosts);

        // Mostra as outras ONGs na aba "Descobrir" (sem contar a própria conta)
        setOngs(ongsRes.data.filter(ong => ong.id !== user.id));

        setLoading(false);
        return;
      }

      // 2. Execução exclusiva para usuário Doador (Tipo 'U')
      const ongsResponse = await api.get('/api/ongs');
      let ongsData = ongsResponse.data;
      
      const profileResponse = await api.get(`/api/users/${user.id}`);
      const supportedIds = profileResponse.data.supportedOngs?.map(o => o.id) || [];
      setUserSupports(supportedIds);

      if (supportedIds.length > 0) {
        const postPromises = supportedIds.map(id => api.get(`/api/posts/ong/${id}`));
        const postResponses = await Promise.all(postPromises);
        
        let posts = postResponses.flatMap((res, index) => {
          const ongId = supportedIds[index];
          const ongInfo = ongsData.find(o => o.id === ongId);
          return res.data.map(post => ({ ...post, ong: ongInfo }));
        });
        
        posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setFeedPosts(posts);
      } else {
        setFeedPosts([]);
      }

      if (user.description) {
        const userInterests = user.description.toLowerCase().split(/\W+/).filter(w => w.length > 3);
        ongsData = ongsData.map(ong => {
          let score = 0;
          const ongDesc = (ong.description || '').toLowerCase();
          userInterests.forEach(interest => {
            if (ongDesc.includes(interest)) score++;
          });
          return { ...ong, matchScore: score };
        });
        ongsData.sort((a, b) => b.matchScore - a.matchScore);
      }
      
      setOngs(ongsData);
      setLoading(false);

    } catch (error) {
      console.error('Falha na execução do fetchData:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const requestToggleSupport = (e, ong, isSupporting) => {
    e.stopPropagation();
    if (isSupporting) {
      setConfirmStopOng(ong);
      return;
    }
    performToggleSupport(ong, false);
  };

  const performToggleSupport = async (ong, isSupporting) => {
    setSupportingId(ong.id);
    try {
      const url = `/api/ongs/${ong.id}/support`;
      if (isSupporting) {
        await api.delete(url);
        toast.success(`Você deixou de apoiar ${ong.name}.`);
      } else {
        await api.post(url, {});
        toast.success(`Agora você apoia ${ong.name}! 💚`);
        if (ong.pixKey) {
          setShowPixModal(ong);
        }
      }
      fetchData(); // Recarrega os dados (incluindo o feed de posts)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao processar apoio');
    } finally {
      setSupportingId(null);
    }
  };

  return (
    <div className="app-wrapper">
      <Navbar />
      
      <main className="feed-main">
        <header className="feed-header">
          <div>
            <h1 className="feed-title">Feed Solidário</h1>
            <p className="feed-subtitle">
              Descubra projetos, acompanhe atualizações e apoie as causas que transformam o mundo.
            </p>
          </div>
          {user?.type === 'U' && (
            <div className="impact-card">
              <span style={{fontSize: '10px', fontWeight: 900, color: 'rgba(var(--rgb-text),0.3)', textTransform: 'uppercase', display: 'block', marginBottom: '4px'}}>Impacto Atual</span>
              <span style={{fontSize: '1.5rem', fontWeight: 900, color: 'var(--cozy-accent)'}}>{userSupports.length} causas apoiadas</span>
            </div>
          )}
        </header>

        {user?.type === 'O' && activeTab === 'feed' && (
          <PostForm onPostCreated={fetchData} />
        )}

        {/* NAVEGAÇÃO DE ABAS (rótulos diferentes para Doador e ONG) */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', borderBottom: '2px solid rgba(var(--rgb-accent), 0.1)', paddingBottom: '1rem' }}>
          <button 
            onClick={() => setActiveTab('explore')}
            style={{
              padding: '0.75rem 1.5rem', borderRadius: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer', transition: 'all 0.3s',
              backgroundColor: activeTab === 'explore' ? 'var(--cozy-accent)' : 'transparent',
              color: activeTab === 'explore' ? 'white' : 'rgba(var(--rgb-text), 0.5)'
            }}
          >
            <Compass size={18} /> Descobrir ONGs
          </button>
          <button 
            onClick={() => setActiveTab('feed')}
            style={{
              padding: '0.75rem 1.5rem', borderRadius: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer', transition: 'all 0.3s',
              backgroundColor: activeTab === 'feed' ? 'var(--cozy-accent)' : 'transparent',
              color: activeTab === 'feed' ? 'white' : 'rgba(var(--rgb-text), 0.5)'
            }}
          >
            <LayoutList size={18} /> {user?.type === 'O' ? 'Meu Mural' : 'Meu Feed'}
          </button>
        </div>

        {loading ? (
          <div style={{display: 'flex', justifyContent: 'center', padding: '4rem'}}>
            <div style={{ width: '3rem', height: '3rem', borderTop: '4px solid var(--cozy-accent)', borderRight: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
        ) : (
          <>
            {/* ABA: DESCOBRIR (Mostra o grid de ONGs) */}
            {activeTab === 'explore' && (
              <div className="ong-grid">
                {ongs.map((ong) => {
                  const isSupporting = userSupports.includes(ong.id);
                  const isProcessing = supportingId === ong.id;
                  return (
                    <div key={ong.id} onClick={() => setSelectedOng(ong)} className="ong-card">
                      <div className="ong-card-image">
                        {ong.profilePicture ? (
                          <img src={ong.profilePicture} alt={ong.name} />
                        ) : (
                          <Heart size={48} color="rgba(var(--rgb-accent), 0.1)" />
                        )}
                        {ong.matchScore > 0 && user?.type === 'U' && (
                          <div className="ong-badge">
                            <Sparkles size={12} /> Recomendado
                          </div>
                        )}
                      </div>

                      <div className="ong-card-content">
                        <h3 className="ong-card-title">{ong.name}</h3>
                        <p className="ong-card-desc">{ong.description || 'Esta ONG ainda não adicionou uma descrição.'}</p>

                        <div className="ong-card-footer">
                          {user?.type === 'U' ? (
                            <button 
                              onClick={(e) => requestToggleSupport(e, ong, isSupporting)} 
                              className={`btn-support ${isSupporting ? 'active' : 'inactive'}`}
                              disabled={isProcessing}
                            >
                              {isSupporting ? <HeartOff size={16} /> : <Heart size={16} fill="currentColor" />}
                              {isProcessing ? 'Processando...' : (isSupporting ? 'Parar Apoio' : 'Apoiar')}
                            </button>
                          ) : (
                            <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', fontWeight: 'bold', color: 'var(--cozy-accent)', textTransform: 'uppercase'}}>
                              <PlusCircle size={16} /> Ver Mural
                            </div>
                          )}
                          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                            <span style={{fontSize: '1.125rem', fontWeight: 900}}>{ong.supporters?.length || 0}</span>
                            <span style={{fontSize: '9px', fontWeight: 900, color: 'rgba(var(--rgb-text),0.3)', textTransform: 'uppercase', marginTop: '4px'}}>Apoiadores</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ABA: MEU FEED / MEU MURAL */}
            {activeTab === 'feed' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '42rem', margin: '0 auto' }}>
                {feedPosts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--cozy-card)', borderRadius: '2.5rem', border: '1px solid rgba(var(--rgb-accent), 0.1)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Nenhuma novidade ainda</h3>
                  </div>
                ) : (
                  feedPosts.map(post => (
                    <PostCard key={post.id} post={post} ongName={user?.type === 'U' ? post.ong?.name : undefined} ongAvatar={post.ong?.profilePicture} />
                  ))
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal de Detalhes da ONG */}
      {selectedOng && (
        <OngModal 
          ong={selectedOng} 
          onClose={() => setSelectedOng(null)} 
        />
      )}

      {/* Modal de PIX (Doação) */}
      {showPixModal && (
        <PixModal 
          ong={showPixModal} 
          onClose={() => setShowPixModal(null)} 
        />
      )}

      {/* Confirmação antes de parar de apoiar */}
      {confirmStopOng && (
        <ConfirmDialog
          title="Parar de apoiar?"
          message={`Você vai deixar de apoiar ${confirmStopOng.name} e parar de receber as atualizações dessa causa no seu feed.`}
          confirmLabel="Parar apoio"
          cancelLabel="Continuar apoiando"
          onCancel={() => setConfirmStopOng(null)}
          onConfirm={() => {
            const ong = confirmStopOng;
            setConfirmStopOng(null);
            performToggleSupport(ong, true);
          }}
        />
      )}
    </div>
  );
};

export default Feed;