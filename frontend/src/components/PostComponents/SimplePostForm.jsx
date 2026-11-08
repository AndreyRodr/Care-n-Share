import React, { useState } from 'react';
import { ImagePlus, X } from 'lucide-react';

const compressImage = (file) => new Promise((resolve) => {
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

// Formulário de post comum (RF16), usado tanto na criação quanto na edição.
const SimplePostForm = ({ initialData, onSubmit, onCancel, submitLabel = 'Publicar Agora' }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    image: initialData?.image || ''
  });
  const [preview, setPreview] = useState(initialData?.image || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressed = await compressImage(file);
      setPreview(compressed);
      setFormData((current) => ({ ...current, image: compressed }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Preencha título e conteúdo antes de publicar.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar a publicação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input
        type="text"
        placeholder="Título da novidade..."
        className="form-input"
        style={{ paddingLeft: '1.5rem', fontWeight: 'bold' }}
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <textarea
        placeholder="O que está acontecendo na ONG hoje?"
        rows="3"
        className="form-input"
        style={{ paddingLeft: '1.5rem', resize: 'none' }}
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
      ></textarea>

      {error && <p className="form-error-text">{error}</p>}

      <div className="post-form-actions">
        <div style={{ position: 'relative' }}>
          <button type="button" className="btn-image">
            <ImagePlus size={16} /> Adicionar Foto
          </button>
          <input
            type="file"
            accept="image/*"
            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
            onChange={handleFileChange}
          />
        </div>
        {onCancel && (
          <button type="button" className="btn-confirm-cancel" onClick={onCancel}>Cancelar</button>
        )}
        <button type="submit" disabled={loading} className="btn-publish">
          {loading ? 'Salvando...' : submitLabel}
        </button>
      </div>

      {preview && (
        <div style={{ position: 'relative', marginTop: '0.5rem', width: '100%', aspectRatio: '16/9', borderRadius: '1rem', overflow: 'hidden' }}>
          <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <button
            type="button"
            onClick={() => { setPreview(null); setFormData({ ...formData, image: '' }); }}
            className="btn-remove-image"
            aria-label="Remover imagem"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </form>
  );
};

export default SimplePostForm;
