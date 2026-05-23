import React, { useState, useEffect } from 'react';
import { Camera, Mail, User, ArrowLeft, Save, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    profilePicture: '',
    pixKey: ''
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        description: user.description || '',
        profilePicture: user.profilePicture || '',
        pixKey: user.pixKey || ''
      });
      setPreview(user.profilePicture);
    }
  }, []);

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
      };
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressedBase64 = await compressImage(file);
      setPreview(compressedBase64);
      setFormData({ ...formData, profilePicture: compressedBase64 });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:3001/api/me', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Atualizar LocalStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso! Redirecionando... ✨' });
      
      // Forçar recarregamento para atualizar Navbar e Feed
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erro ao atualizar o perfil. Tente novamente.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cozy-bg">
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 py-12">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-cozy-text/50 hover:text-cozy-accent mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar para o Feed</span>
        </button>

        <div className="bg-white rounded-[3rem] shadow-xl shadow-cozy-accent/5 p-10 border border-cozy-accent/5">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-cozy-text mb-2">Personalizar Perfil</h1>
            <p className="text-cozy-text/50">Deixe sua marca na comunidade Jacaridade.</p>
          </div>

          {message.text && (
            <div className={`mb-8 p-4 rounded-2xl text-sm text-center border ${
              message.type === 'success' 
              ? 'bg-cozy-pastel-green/30 border-cozy-pastel-green text-green-700' 
              : 'bg-red-50 border-red-100 text-red-600'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Foto de Perfil */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-[2.5rem] bg-cozy-bg border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                  {preview ? (
                    <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-cozy-accent/20" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="text-white w-8 h-8" />
                  </div>
                </div>
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <span className="text-xs font-bold text-cozy-accent mt-4 uppercase tracking-widest">Trocar Foto</span>
            </div>

            <div className="space-y-5">
              <div className="relative">
                <label className="text-xs font-bold text-cozy-text/30 uppercase tracking-widest ml-1 mb-2 block">Seu Nome</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cozy-accent/30" />
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-cozy-bg rounded-2xl border-none focus:ring-2 focus:ring-cozy-accent/20 outline-none transition-all"
                    placeholder="Seu nome"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-xs font-bold text-cozy-text/30 uppercase tracking-widest ml-1 mb-2 block">E-mail de Contato</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cozy-accent/30" />
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-cozy-bg rounded-2xl border-none focus:ring-2 focus:ring-cozy-accent/20 outline-none transition-all"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-xs font-bold text-cozy-text/30 uppercase tracking-widest ml-1 mb-2 block">Bio / Interesses</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="4"
                  className="w-full px-4 py-4 bg-cozy-bg rounded-2xl border-none focus:ring-2 focus:ring-cozy-accent/20 outline-none transition-all resize-none"
                  placeholder="Conte o que te motiva a ajudar..."
                ></textarea>
                <div className="absolute right-4 bottom-4 flex items-center gap-1.5 opacity-30">
                  <Sparkles className="w-4 h-4 text-cozy-accent" />
                  <span className="text-[10px] font-bold">Influencia seu match</span>
                </div>
              </div>

              {JSON.parse(localStorage.getItem('user'))?.type === 'O' && (
                <div className="relative animate-in slide-in-from-top duration-300">
                  <label className="text-xs font-bold text-cozy-text/30 uppercase tracking-widest ml-1 mb-2 block">Chave PIX da ONG</label>
                  <input 
                    type="text" 
                    value={formData.pixKey}
                    onChange={(e) => setFormData({...formData, pixKey: e.target.value})}
                    className="w-full px-4 py-4 bg-cozy-pastel-green/10 border border-cozy-pastel-green/20 rounded-2xl outline-none focus:ring-2 focus:ring-cozy-pastel-green/30 transition-all text-sm font-bold"
                    placeholder="E-mail, CPF, CNPJ ou Chave Aleatória"
                  />
                  <p className="text-[10px] text-cozy-text/40 mt-2 ml-1 italic">Essa chave aparecerá para os apoiadores gerarem o QR Code.</p>
                </div>
              )}
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-cozy-accent text-white font-black rounded-2xl shadow-xl shadow-cozy-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : (
                <> <Save className="w-5 h-5" /> Salvar Alterações </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;
