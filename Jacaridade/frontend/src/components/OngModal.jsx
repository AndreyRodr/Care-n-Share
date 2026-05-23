import React, { useEffect, useState } from 'react';
import { X, Calendar, Heart, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const OngModal = ({ ong, onClose }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/posts/ong/${ong.id}`);
        setPosts(response.data);
      } catch (error) {
        console.error('Erro ao buscar posts da ONG', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [ong.id]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-cozy-text/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
        
        {/* Botão Fechar Modal Principal */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-[110] bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-cozy-text/50 transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Sidebar: Informações da ONG */}
        <div className="w-full md:w-80 bg-cozy-bg p-10 flex flex-col items-center border-r border-cozy-accent/5 overflow-y-auto">
          <img 
            src={ong.profilePicture || 'https://via.placeholder.com/150'} 
            className="w-32 h-32 rounded-[2.5rem] object-cover shadow-lg mb-6 border-4 border-white"
            alt={ong.name}
          />
          <h2 className="text-2xl font-bold text-cozy-text text-center mb-2">{ong.name}</h2>
          <div className="flex items-center gap-2 text-cozy-accent font-bold text-xs uppercase tracking-widest mb-8">
            <Heart className="w-3 h-3 fill-current" /> {ong.supporters?.length || 0} apoiadores
          </div>
          
          <div className="w-full">
            <h4 className="text-[10px] font-black text-cozy-text/30 uppercase tracking-[0.2em] mb-3">Sobre nós</h4>
            <p className="text-sm text-cozy-text/70 leading-relaxed italic">
              "{ong.description || 'Uma ONG dedicada a transformar o mundo.'}"
            </p>
          </div>
        </div>

        {/* Mural de Posts / Detalhe do Post */}
        <div className="flex-1 p-10 overflow-y-auto bg-white relative">
          {selectedPost ? (
            /* VISÃO DETALHADA DO POST */
            <div className="animate-in slide-in-from-right duration-300">
              <button 
                onClick={() => setSelectedPost(null)}
                className="flex items-center gap-2 text-cozy-accent font-bold text-xs uppercase tracking-widest mb-8 hover:translate-x-[-4px] transition-transform"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar para o mural
              </button>

              <div className="rounded-[2rem] overflow-hidden bg-cozy-bg mb-8 shadow-inner">
                {selectedPost.image ? (
                  <img src={selectedPost.image} className="w-full max-h-96 object-contain" alt={selectedPost.title} />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center text-cozy-accent/20 italic">Sem imagem disponível</div>
                )}
              </div>

              <div className="flex items-center gap-2 text-[10px] text-cozy-accent font-black uppercase tracking-[0.2em] mb-3">
                <Calendar className="w-3 h-3" />
                {new Date(selectedPost.createdAt).toLocaleDateString('pt-BR')}
              </div>
              <h3 className="text-3xl font-black text-cozy-text mb-6 leading-tight">{selectedPost.title}</h3>
              <p className="text-cozy-text/70 leading-loose whitespace-pre-wrap text-lg font-light">
                {selectedPost.content}
              </p>
            </div>
          ) : (
            /* VISÃO DO MURAL (GRID) */
            <>
              <h3 className="text-xl font-bold text-cozy-text mb-8">Mural de Atualizações</h3>
              
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cozy-accent"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-10">
                  {posts.map((post) => (
                    <div 
                      key={post.id} 
                      onClick={() => setSelectedPost(post)}
                      className="group cursor-pointer"
                    >
                      <div className="aspect-square rounded-3xl overflow-hidden bg-cozy-bg mb-3 relative shadow-sm border border-cozy-accent/5">
                        {post.image ? (
                          <img src={post.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={post.title} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-cozy-accent/10 italic text-xs">Sem imagem</div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 font-bold text-xs">Ver Detalhes</span>
                        </div>
                      </div>
                      <h5 className="font-bold text-cozy-text text-sm truncate group-hover:text-cozy-accent transition-colors">{post.title}</h5>
                      <div className="flex items-center gap-1.5 text-[10px] text-cozy-text/40 mt-1 font-medium uppercase tracking-wider">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  ))}
                  
                  {posts.length === 0 && (
                    <div className="col-span-full py-20 text-center text-cozy-text/30 border-2 border-dashed border-cozy-accent/10 rounded-[2rem]">
                      <p className="italic text-sm">Esta ONG ainda não publicou nenhuma novidade.</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OngModal;
