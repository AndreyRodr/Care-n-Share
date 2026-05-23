import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Sparkles, Heart, Users, Search, HeartOff, PlusCircle } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import PostForm from '../components/PostForm.jsx';
import OngModal from '../components/OngModal.jsx';
import PixModal from '../components/PixModal.jsx';

const Feed = () => {
  const [ongs, setOngs] = useState([]);
  const [userSupports, setUserSupports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOng, setSelectedOng] = useState(null);
  const [showPixModal, setShowPixModal] = useState(null); // Armazena a ONG para mostrar o PIX
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchData = async () => {
    try {
      const ongsResponse = await axios.get('http://localhost:3001/api/ongs');
      let ongsData = ongsResponse.data;

      if (user) {
        const profileResponse = await axios.get(`http://localhost:3001/api/users/${user.id}`);
        const supportedIds = profileResponse.data.supportedOngs.map(o => o.id);
        setUserSupports(supportedIds);

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
      }

      setOngs(ongsData);
    } catch (error) {
      console.error('Erro ao buscar dados', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleSupport = async (e, ong, isSupporting) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      const url = `http://localhost:3001/api/ongs/${ong.id}/support`;
      if (isSupporting) {
        await axios.delete(url, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });
        // Se a ONG tiver chave PIX, mostramos o modal de doação
        if (ong.pixKey) {
          setShowPixModal(ong);
        }
      }
      fetchData(); 
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao processar apoio');
    }
  };

  return (
    <div className="min-h-screen bg-cozy-bg text-cozy-text">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-6 py-10">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-4 tracking-tight">Feed Solidário</h1>
            <p className="text-cozy-text/60 max-w-xl font-light leading-relaxed">
              Descubra projetos, acompanhe atualizações e apoie as causas que transformam o mundo.
            </p>
          </div>
          {user?.type === 'U' && (
            <div className="bg-white px-8 py-5 rounded-[2rem] border border-cozy-accent/10 shadow-sm">
              <span className="text-[10px] font-black text-cozy-text/30 uppercase tracking-[0.2em] block mb-1">Impacto Atual</span>
              <span className="text-2xl font-black text-cozy-accent">{userSupports.length} causas apoiadas</span>
            </div>
          )}
        </header>

        {user?.type === 'O' && (
          <div className="max-w-3xl mx-auto">
            <PostForm onPostCreated={fetchData} />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cozy-accent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ongs.map((ong) => {
              const isSupporting = userSupports.includes(ong.id);
              
              return (
                <div 
                  key={ong.id} 
                  onClick={() => setSelectedOng(ong)}
                  className="bg-white rounded-[2.5rem] border border-cozy-accent/5 overflow-hidden shadow-lg shadow-cozy-accent/5 hover:shadow-cozy-accent/10 transition-all cursor-pointer group hover:-translate-y-1"
                >
                  <div className="relative h-48 bg-cozy-bg">
                    {ong.profilePicture ? (
                      <img src={ong.profilePicture} alt={ong.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Heart className="w-12 h-12 text-cozy-accent/10" />
                      </div>
                    )}
                    {ong.matchScore > 0 && user?.type === 'U' && (
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-cozy-accent flex items-center gap-1.5 shadow-sm">
                        <Sparkles className="w-3 h-3 fill-current" /> Recomendado
                      </div>
                    )}
                  </div>

                  <div className="p-8">
                    <h3 className="text-xl font-bold mb-3 truncate group-hover:text-cozy-accent transition-colors">{ong.name}</h3>
                    <p className="text-cozy-text/60 text-sm line-clamp-2 mb-6 min-h-[3rem] leading-relaxed">
                      {ong.description || 'Esta ONG ainda não adicionou uma descrição.'}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-cozy-bg">
                      {user?.type === 'U' ? (
                        <button 
                          onClick={(e) => handleToggleSupport(e, ong, isSupporting)}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all active:scale-95 ${
                            isSupporting 
                            ? 'bg-red-50 text-red-400 border border-red-100 hover:bg-red-100' 
                            : 'bg-cozy-accent text-white hover:bg-cozy-accent/90 shadow-lg shadow-cozy-accent/20'
                          }`}
                        >
                          {isSupporting ? <HeartOff className="w-4 h-4" /> : <Heart className="w-4 h-4 fill-current" />}
                          {isSupporting ? 'Parar Apoio' : 'Apoiar'}
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-cozy-accent uppercase tracking-widest">
                          <PlusCircle className="w-4 h-4" /> Ver Mural
                        </div>
                      )}
                      
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-black text-cozy-text/80 leading-none">
                          {ong.supporters?.length || 0}
                        </span>
                        <span className="text-[9px] text-cozy-text/30 font-black uppercase tracking-widest mt-1">
                          Apoiadores
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && ongs.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-cozy-accent/10">
            <Users className="w-16 h-16 text-cozy-accent/10 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-2 text-cozy-text/70">Opa, está meio vazio por aqui...</h2>
            <p className="text-cozy-text/40 font-light">Seja a primeira ONG a se cadastrar e brilhar!</p>
          </div>
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
    </div>
  );
};

export default Feed;
