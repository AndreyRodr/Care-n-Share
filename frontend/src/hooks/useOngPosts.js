import { useCallback, useEffect, useState } from 'react';
import { fetchPostsByOng, createPost, updatePost, deletePost } from '../services/postService.js';
import { toast } from '../utils/toast.js';

/**
 * Gerencia os posts (simples e de arrecadação) de uma ONG, 100% via API real:
 * GET/POST/PUT/DELETE /api/posts. A ONG precisa estar com verificationStatus
 * APPROVED (requireApprovedOngMiddleware no back) para criar/editar/excluir.
 */
export default function useOngPosts(ongId) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!ongId) {
      setLoading(false);
      return;
    }
    try {
      const data = await fetchPostsByOng(ongId);
      setPosts(data);
    } catch (error) {
      console.error('Erro ao buscar publicações da ONG:', error);
    } finally {
      setLoading(false);
    }
  }, [ongId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addPost = async (values) => {
    const created = await createPost(values);
    setPosts((current) => [created, ...current]);
    return created;
  };

  const editPost = async (post, values) => {
    try {
      const updated = await updatePost(post.id, values);
      setPosts((current) => current.map((p) => (p.id === post.id ? updated : p)));
      return updated;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao atualizar publicação.');
      throw error;
    }
  };

  const removePost = async (post) => {
    try {
      await deletePost(post.id);
      setPosts((current) => current.filter((p) => p.id !== post.id));
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao excluir publicação.');
      throw error;
    }
  };

  return { posts, loading, addPost, editPost, removePost, refresh };
}
