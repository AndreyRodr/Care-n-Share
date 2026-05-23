import React, { useState } from 'react';
import { ImagePlus, Send, X } from 'lucide-react';
import axios from 'axios';

const PostForm = ({ onPostCreated }) => {
  const [formData, setFormData] = useState({ title: '', content: '', image: '' });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1000;
          let width = img.width;
          let height = img.height;
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
      };
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressed = await compressImage(file);
      setPreview(compressed);
      setFormData({ ...formData, image: compressed });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/api/posts', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ title: '', content: '', image: '' });
      setPreview(null);
      if (onPostCreated) onPostCreated();
      alert('Publicado com sucesso! ✨');
    } catch (error) {
      alert('Erro ao publicar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-cozy-accent/5 border border-cozy-accent/5 mb-12">
      <h2 className="text-xl font-bold text-cozy-text mb-6 flex items-center gap-2">
        <Send className="w-5 h-5 text-cozy-accent" />
        Nova Publicação
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          placeholder="Título da novidade..."
          className="w-full px-6 py-4 bg-cozy-bg rounded-2xl border-none outline-none focus:ring-2 focus:ring-cozy-accent/20 transition-all font-bold"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
        />
        
        <textarea 
          placeholder="O que está acontecendo na ONG hoje?"
          rows="3"
          className="w-full px-6 py-4 bg-cozy-bg rounded-2xl border-none outline-none focus:ring-2 focus:ring-cozy-accent/20 transition-all resize-none text-sm"
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
        ></textarea>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button type="button" className="flex items-center gap-2 px-6 py-3 bg-cozy-pastel-green/30 text-green-700 rounded-xl text-sm font-bold hover:bg-cozy-pastel-green/50 transition-all">
              <ImagePlus className="w-4 h-4" />
              Adicionar Foto
            </button>
            <input 
              type="file" 
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-cozy-accent text-white rounded-xl font-bold hover:bg-cozy-accent/90 transition-all disabled:opacity-50"
          >
            {loading ? 'Publicando...' : 'Publicar Agora'}
          </button>
        </div>

        {preview && (
          <div className="relative mt-4 w-full aspect-video rounded-2xl overflow-hidden border border-cozy-bg">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button 
              type="button"
              onClick={() => {setPreview(null); setFormData({...formData, image: ''})}}
              className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full text-white hover:bg-black/70 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PostForm;
