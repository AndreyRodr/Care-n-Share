import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import PostTypeModal from './PostTypeModal.jsx';
import SimplePostForm from './SimplePostForm.jsx';
import CollectionPostForm from './CollectionPostForm.jsx';
import { toast } from '../../utils/toast.js';

// Orquestra o fluxo de criação: botão -> modal de seleção de tipo -> formulário correspondente.
const CreatePostFlow = ({ onCreate }) => {
  const [step, setStep] = useState(null); // null | 'TYPE' | 'SIMPLES' | 'ARRECADACAO'

  const close = () => setStep(null);

  const handleSubmit = async (values) => {
    await onCreate(values);
    toast.success('Publicado com sucesso! ✨');
    close();
  };

  return (
    <>
      <button type="button" className="btn-new-post" onClick={() => setStep('TYPE')}>
        <PlusCircle size={18} /> Nova Publicação
      </button>

      {step === 'TYPE' && <PostTypeModal onClose={close} onSelect={setStep} />}

      {step === 'SIMPLES' && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Postagem Simples</h2>
                <p>Compartilhe novidades, fotos e agradecimentos no mural.</p>
              </div>
              <button className="modal-close-btn" onClick={close} aria-label="Fechar">×</button>
            </div>
            <SimplePostForm onSubmit={handleSubmit} onCancel={close} />
          </div>
        </div>
      )}

      {step === 'ARRECADACAO' && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Postagem de Arrecadação</h2>
                <p>Defina a meta e o prazo da sua campanha.</p>
              </div>
              <button className="modal-close-btn" onClick={close} aria-label="Fechar">×</button>
            </div>
            <CollectionPostForm onSubmit={handleSubmit} onCancel={close} />
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePostFlow;
