import React, { useState } from 'react';

const EditComentarioModal = ({ postId, commentId, conteudoAtual, onClose, onSave }) => {
  const [conteudo, setConteudo] = useState(conteudoAtual);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const handleUpdate = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8080/api/post/${postId}/comentario/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ conteudo })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar comentário');
      }

      const atualizado = await response.json();
      onSave(atualizado);  // Atualiza lista no componente pai
      onClose();           // Fecha o modal
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Editar Comentário</h3>

        {error && <p style={styles.error}>{error}</p>}

        <textarea
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          rows={4}
          style={{ width: '100%', marginBottom: '1rem' }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleUpdate} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 999
  },
  modal: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    width: '400px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
  },
  error: {
    color: 'red',
    marginBottom: '1rem'
  }
};

export default EditComentarioModal;
