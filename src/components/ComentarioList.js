import React, { useEffect, useState } from 'react';
import EditComentarioModal from './modals/EditComentarioModal';

const ComentarioList = ({ postId }) => {
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [loading, setLoading] = useState(false);
  const [editandoComentario, setEditandoComentario] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/post/${postId}/comentario`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Erro ao buscar comentários');
        const data = await response.json();
        setComentarios(data);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchComentarios();
  }, [postId, token]);


  

  const handleAdicionar = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/post/${postId}/comentario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ conteudo: novoComentario })
      });

      if (!response.ok) throw new Error('Erro ao adicionar comentário');
      const novo = await response.json();
      setComentarios([...comentarios, novo]);
      setNovoComentario('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletar = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/post/${postId}/comentario/${commentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Erro ao deletar');
      setComentarios(comentarios.filter(c => c.id !== commentId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h4>Comentários</h4>
      {comentarios.map(comentario => (
        <div key={comentario.id} style={{ borderBottom: '1px solid #ccc', marginBottom: '0.5rem' }}>
          <p>{comentario.conteudo}</p>
          <small>Autor: {comentario.autor?.username || 'Desconhecido'}</small>
          <br />
          <button onClick={() => setEditandoComentario(comentario)} style={{ fontSize: '0.8rem' }}>
            Editar
          </button>
          <button onClick={() => handleDeletar(comentario.id)} style={{ color: 'red', fontSize: '0.8rem' }}>
            Deletar
          </button>
        </div>
      ))}

      <div style={{ marginTop: '1rem' }}>
        <textarea
          placeholder="Escreva seu comentário..."
          value={novoComentario}
          onChange={(e) => setNovoComentario(e.target.value)}
          rows={3}
          style={{ width: '100%', marginBottom: '0.5rem' }}
        />
        <button onClick={handleAdicionar} disabled={loading}>
          {loading ? 'Enviando...' : 'Comentar'}
        </button>
      </div>

      {/* Modal de edição */}
      {editandoComentario && (
        <EditComentarioModal
          postId={postId}
          commentId={editandoComentario.id}
          conteudoAtual={editandoComentario.conteudo}
          onClose={() => setEditandoComentario(null)}
          onSave={(atualizado) => {
            setComentarios(prev =>
              prev.map(c => (c.id === atualizado.id ? atualizado : c))
            );
          }}
        />
      )}
    </div>
  );
};

export default ComentarioList;
