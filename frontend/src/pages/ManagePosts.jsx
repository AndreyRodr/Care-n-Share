import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import usePageTitle from '../hooks/usePageTitle.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import useOngPosts from '../hooks/useOngPosts.js';
import ManagePostCard from '../components/PostComponents/ManagePostCard.jsx';
import SimplePostForm from '../components/PostComponents/SimplePostForm.jsx';
import CollectionPostForm from '../components/PostComponents/CollectionPostForm.jsx';
import CreatePostFlow from '../components/PostComponents/CreatePostFlow.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { toast } from '../utils/toast.js';

// Tela de gerenciamento e edição dos posts da ONG (posts simples e campanhas de arrecadação).
const ManagePosts = () => {
  usePageTitle('Meus Posts');
  const { user } = useAuth();
  const { posts, loading, addPost, editPost, removePost } = useOngPosts(user?.id);
  const [editingPost, setEditingPost] = useState(null);
  const [deletingPost, setDeletingPost] = useState(null);

  const handleEditSubmit = async (values) => {
    await editPost(editingPost, values);
    toast.success('Publicação atualizada!');
    setEditingPost(null);
  };

  const handleConfirmDelete = async () => {
    await removePost(deletingPost);
    toast.success('Publicação removida.');
    setDeletingPost(null);
  };

  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="feed-main">
        <header className="feed-header">
          <div>
            <h1 className="feed-title">Meus Posts</h1>
            <p className="feed-subtitle">Gerencie suas publicações e campanhas de arrecadação.</p>
          </div>
          <CreatePostFlow onCreate={addPost} />
        </header>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <div style={{ width: '3rem', height: '3rem', borderTop: '4px solid var(--cozy-accent)', borderRight: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--cozy-card)', borderRadius: '2.5rem', border: '1px solid rgba(var(--rgb-accent), 0.1)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Você ainda não publicou nada.</h3>
          </div>
        ) : (
          <div className="manage-post-grid">
            {posts.map((post) => (
              <ManagePostCard key={post.id} post={post} onEdit={setEditingPost} onDelete={setDeletingPost} />
            ))}
          </div>
        )}
      </main>

      {editingPost && (
        <div className="modal-overlay" onClick={() => setEditingPost(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Editar publicação</h2>
                <p>Atualize o conteúdo{Number(editingPost.fundraisingGoal) > 0 ? ' e a meta da campanha' : ''}.</p>
              </div>
              <button className="modal-close-btn" onClick={() => setEditingPost(null)} aria-label="Fechar">×</button>
            </div>
            {Number(editingPost.fundraisingGoal) > 0 ? (
              <CollectionPostForm
                initialData={editingPost}
                submitLabel="Salvar Alterações"
                onSubmit={handleEditSubmit}
                onCancel={() => setEditingPost(null)}
              />
            ) : (
              <SimplePostForm
                initialData={editingPost}
                submitLabel="Salvar Alterações"
                onSubmit={handleEditSubmit}
                onCancel={() => setEditingPost(null)}
              />
            )}
          </div>
        </div>
      )}

      {deletingPost && (
        <ConfirmDialog
          title="Excluir publicação?"
          message={`Tem certeza que deseja excluir "${deletingPost.title}"? Essa ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          cancelLabel="Cancelar"
          onCancel={() => setDeletingPost(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default ManagePosts;
