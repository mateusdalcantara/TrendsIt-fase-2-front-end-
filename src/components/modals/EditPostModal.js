import React, { useState } from 'react';

const EditPostModal = ({ post, onClose, onSave }) => {
  const [titulo, setTitulo] = useState(post.titulo);
  const [conteudo, setConteudo] = useState(post.conteudo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const handleSalvar = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/post/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ titulo, conteudo })
      });

      if (!response.ok) throw new Error('Erro ao editar post');
      const atualizado = await response.json();
      onSave(atualizado);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Editar Postagem</h3>
        {error && <p style={styles.error}>{error}</p>}
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título"
          style={styles.input}
        />
        <textarea
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          placeholder="Conteúdo"
          rows={4}
          style={styles.textarea}
        />
        <div style={styles.actions}>
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleSalvar} disabled={loading}>
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
    zIndex: 1000
  },
  modal: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '10px',
    width: '400px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
  },
  input: {
    width: '100%',
    marginBottom: '1rem',
    padding: '0.5rem'
  },
  textarea: {
    width: '100%',
    marginBottom: '1rem',
    padding: '0.5rem'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem'
  },
  error: {
    color: 'red',
    marginBottom: '1rem'
  }
};

export default EditPostModal;
