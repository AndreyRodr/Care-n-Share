import React, { useState } from 'react';
import { ImagePlus, Calendar, Coins, X } from 'lucide-react';

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

const todayISO = () => new Date().toISOString().split('T')[0];

// Formulário de post de arrecadação (RF15): reaproveita texto/imagem do post
// simples e adiciona meta em R$ (fundraisingGoal) e prazo (fundraisingDeadline),
// campos reais do modelo Post. No modo de edição, também permite ajustar o
// valor já arrecadado (amountRaised).
const CollectionPostForm = ({ initialData, onSubmit, onCancel, submitLabel = 'Publicar Campanha' }) => {
  const isEditing = Boolean(initialData);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    image: initialData?.image || '',
    fundraisingGoal: initialData?.fundraisingGoal ?? '',
    amountRaised: initialData?.amountRaised ?? '0',
    fundraisingDeadline: initialData?.fundraisingDeadline
      ? initialData.fundraisingDeadline.split('T')[0]
      : ''
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
    if (!formData.fundraisingGoal || Number(formData.fundraisingGoal) <= 0) {
      setError('Informe uma meta de arrecadação maior que zero.');
      return;
    }
    if (!formData.fundraisingDeadline) {
      setError('Defina o prazo limite da campanha.');
      return;
    }
    if (formData.fundraisingDeadline < todayISO()) {
      setError('O prazo não pode ser uma data no passado.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        fundraisingGoal: Number(formData.fundraisingGoal)
      };
      // amountRaised só existe no schema de atualização do back — enviar na
      // criação faz a API rejeitar a requisição (schema é .strict()).
      if (isEditing) {
        payload.amountRaised = Number(formData.amountRaised);
      } else {
        delete payload.amountRaised;
      }
      await onSubmit(payload);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar a campanha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input
        type="text"
        placeholder="Título da campanha..."
        className="form-input"
        style={{ paddingLeft: '1.5rem', fontWeight: 'bold' }}
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <textarea
        placeholder="Conte pra que vai servir essa arrecadação..."
        rows="3"
        className="form-input"
        style={{ paddingLeft: '1.5rem', resize: 'none' }}
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
      ></textarea>

      <div style={{ display: 'grid', gridTemplateColumns: isEditing ? '1fr 1fr 1fr' : '1fr 1fr', gap: '1rem' }}>
        <div className="input-wrapper">
          <Coins size={18} className="input-icon" />
          <input
            type="number"
            min="1"
            step="0.01"
            placeholder="Meta em R$"
            className="form-input"
            value={formData.fundraisingGoal}
            onChange={(e) => setFormData({ ...formData, fundraisingGoal: e.target.value })}
          />
        </div>
        <div className="input-wrapper">
          <Calendar size={18} className="input-icon" />
          <input
            type="date"
            className="form-input"
            min={todayISO()}
            value={formData.fundraisingDeadline}
            onChange={(e) => setFormData({ ...formData, fundraisingDeadline: e.target.value })}
          />
        </div>
        {isEditing && (
          <div className="input-wrapper">
            <Coins size={18} className="input-icon" />
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Já arrecadado (R$)"
              className="form-input"
              value={formData.amountRaised}
              onChange={(e) => setFormData({ ...formData, amountRaised: e.target.value })}
            />
          </div>
        )}
      </div>

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

export default CollectionPostForm;
