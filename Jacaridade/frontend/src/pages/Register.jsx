import React, { useState } from 'react';
import { Heart, Mail, Lock, User, Camera, ArrowRight, Building2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    description: '',
    type: 'U', // Default: Usuário
    profilePicture: '',
    pixKey: ''
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
          resolve(canvas.toDataURL('image/jpeg', 0.7)); // Salva como JPEG com 70% de qualidade
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
    setError('');
    setLoading(true);
    try {
      await axios.post('http://localhost:3001/api/register', formData);
      navigate('/login'); // Redirecionar para login após sucesso
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao cadastrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-cozy-bg">
      <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-xl shadow-cozy-accent/10 p-10 border border-cozy-accent/5">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cozy-text mb-2">Criar conta</h1>
          <p className="text-cozy-text/60 font-light">Junte-se à nossa comunidade de solidariedade.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seletor de Tipo */}
          <div className="flex gap-4 p-1 bg-cozy-bg rounded-2xl">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'U' })}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-medium ${
                formData.type === 'U' ? 'bg-white shadow-sm text-cozy-accent' : 'text-cozy-text/40'
              }`}
            >
              <User className="w-4 h-4" /> Sou Usuário
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'O' })}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-medium ${
                formData.type === 'O' ? 'bg-white shadow-sm text-cozy-accent' : 'text-cozy-text/40'
              }`}
            >
              <Building2 className="w-4 h-4" /> Sou ONG
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Foto de Perfil */}
            <div className="flex flex-col items-center justify-center md:border-r border-cozy-bg pr-0 md:pr-6">
              <div className="relative group cursor-pointer">
                <div className="w-32 h-32 bg-cozy-bg rounded-3xl overflow-hidden border-2 border-dashed border-cozy-accent/20 flex items-center justify-center transition-all group-hover:border-cozy-accent/40">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-cozy-accent/30" />
                  )}
                </div>
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  accept="image/*"
                />
                <div className="mt-4 text-xs text-center text-cozy-text/40">
                  Foto de {formData.type === 'O' ? 'Logo' : 'Perfil'}
                </div>
              </div>
            </div>

            {/* Campos de Texto */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cozy-text/70 mb-1.5 ml-1">
                  Nome {formData.type === 'O' ? 'da ONG' : 'Completo'}
                </label>
                <input 
                  type="text" 
                  required
                  placeholder={formData.type === 'O' ? 'Nome Institucional' : 'Como quer ser chamado'}
                  className="w-full px-4 py-3 bg-cozy-bg rounded-2xl border-none outline-none focus:ring-2 focus:ring-cozy-accent/20 transition-all text-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cozy-text/70 mb-1.5 ml-1">E-mail</label>
                <input 
                  type="email" 
                  required
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 bg-cozy-bg rounded-2xl border-none outline-none focus:ring-2 focus:ring-cozy-accent/20 transition-all text-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cozy-text/70 mb-1.5 ml-1">Senha</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-cozy-bg rounded-2xl border-none outline-none focus:ring-2 focus:ring-cozy-accent/20 transition-all text-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-cozy-text/70 mb-1.5 ml-1">
              {formData.type === 'O' ? 'Descrição da ONG' : 'Seus Interesses'}
            </label>
            <textarea 
              rows="3"
              placeholder={formData.type === 'O' ? 'Conte um pouco sobre o trabalho de vocês...' : 'Quais causas você quer apoiar?'}
              className="w-full px-4 py-3 bg-cozy-bg rounded-2xl border-none outline-none focus:ring-2 focus:ring-cozy-accent/20 transition-all text-sm resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          {formData.type === 'O' && (
            <div className="animate-in slide-in-from-top duration-300">
              <label className="block text-sm font-medium text-cozy-text/70 mb-1.5 ml-1">Chave PIX da ONG</label>
              <input 
                type="text" 
                placeholder="E-mail, CPF, CNPJ ou Chave Aleatória"
                className="w-full px-4 py-3 bg-cozy-pastel-green/10 border border-cozy-pastel-green/20 rounded-2xl outline-none focus:ring-2 focus:ring-cozy-pastel-green/30 transition-all text-sm"
                value={formData.pixKey}
                onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
              />
              <p className="text-[10px] text-cozy-text/40 mt-2 ml-1 italic">* Esta chave será usada para gerar o QR Code de doação.</p>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-cozy-accent text-white font-bold rounded-2xl shadow-lg shadow-cozy-accent/20 hover:bg-cozy-accent/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-cozy-text/50">
          Já tem conta?{' '}
          <button onClick={() => navigate('/login')} className="text-cozy-accent font-bold hover:underline">
            Faça Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
