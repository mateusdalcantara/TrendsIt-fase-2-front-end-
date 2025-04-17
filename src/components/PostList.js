import React, { useEffect, useState } from 'react';
import ComentarioList from './ComentarioList';
import EditPostModal from './modals/EditPostModal';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';

const PostList = ({ posts, setPosts }) => {
  const [editandoPost, setEditandoPost] = useState(null);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId'); // Salvo no login
  const userRole = localStorage.getItem('role'); // 'USER' ou 'ADMIN'

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/post', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sorted);
      } catch (err) {
        toast.error('Erro ao carregar postagens');
        console.error(err);
      }
    };
  
    fetchPosts();
  }, [token, setPosts]);

  const handleDeletar = async (postId) => {
    if (!window.confirm('Tem certeza que deseja excluir este post?')) return;
    try {
      const response = await fetch(`http://localhost:8080/api/post/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Erro ao deletar post');
      setPosts(posts.filter((p) => p.id !== postId));
      toast.success('Post excluído com sucesso');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <h2>Últimas Postagens</h2>
      {posts.map((post) => (
        <div key={post.id} style={styles.card}>
          <h3>{post.titulo}</h3>
          <p>{post.conteudo}</p>
          <small>
            Autor: {post.autor?.username || 'Desconhecido'} |{' '}
            {new Date(post.createdAt).toLocaleString()}
          </small>
          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem' }}>
            {/* Editar botão visível para autor ou admin */}
            {(post.autor?.id === Number(userId) || userRole === 'ADMIN') && (
              <>
                <button onClick={() => setEditandoPost(post)} style={styles.btn}>
                  <FaEdit /> Editar
                </button>
                <button
                  onClick={() => handleDeletar(post.id)}
                  style={{ ...styles.btn, color: 'red' }}
                >
                  <FaTrash /> Excluir
                </button>
              </>
            )}
          </div>
          <ComentarioList postId={post.id} />
        </div>
      ))}

      {/* Modal de edição */}
      {editandoPost && (
        <EditPostModal
          post={editandoPost}
          onClose={() => setEditandoPost(null)}
          onSave={(atualizado) => {
            setPosts((prev) =>
              prev.map((p) => (p.id === atualizado.id ? atualizado : p))
            );
            setEditandoPost(null);
          }}
        />
      )}
    </div>
  );
};

const styles = {
  card: {
    background: '#f9f9f9',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '1.5rem'
  },
  btn: {
    cursor: 'pointer',
    fontSize: '0.9rem',
    background: 'none',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }
};

export default PostList;
