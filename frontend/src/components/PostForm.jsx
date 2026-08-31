import React, { useState } from 'react';
import { ImagePlus, Send, X } from 'lucide-react';
import api from '../services/api.js';
import { toast } from '../utils/toast.js';

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
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('content', formData.content);

      if (formData.image) {
        const fetchReponse = await fetch(formData.image);
        const blob = await fetchReponse.blob();
        submitData.append('image', blob, 'post-image.jpg');
      }

      await api.post('/api/posts', submitData);
      setFormData({ title: '', content: '', image: '' });
      setPreview(null);
      if (onPostCreated) onPostCreated();
      toast.success('Publicado com sucesso! ✨');
    } catch (error) {
      toast.error('Erro ao publicar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-form-card">
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Send size={20} color="var(--cozy-accent)" /> Nova Publicação
      </h2>
      
      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
        <input type="text" placeholder="Título da novidade..." className="form-input" style={{paddingLeft: '1.5rem', fontWeight: 'bold'}}
          value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
        />
        <textarea placeholder="O que está acontecendo na ONG hoje?" rows="3" className="form-input" style={{paddingLeft: '1.5rem', resize: 'none'}}
          value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})}
        ></textarea>

        <div className="post-form-actions">
          <div style={{position: 'relative'}}>
            <button type="button" className="btn-image">
              <ImagePlus size={16} /> Adicionar Foto
            </button>
            <input type="file" accept="image/*" style={{position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer'}} onChange={handleFileChange} />
          </div>
          <button type="submit" disabled={loading} className="btn-publish">
            {loading ? 'Publicando...' : 'Publicar Agora'}
          </button>
        </div>

        {preview && (
          <div style={{position: 'relative', marginTop: '1rem', width: '100%', aspectRatio: '16/9', borderRadius: '1rem', overflow: 'hidden'}}>
            <img src={preview} alt="Preview" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            <button type="button" onClick={() => {setPreview(null); setFormData({...formData, image: ''})}} className="btn-remove-image" aria-label="Remover imagem">
              <X size={16} />
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PostForm;