import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreatePostModal = ({ onClose, onSave }) => {
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleSalvar = async () => {
    if (!titulo || !conteudo) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ titulo, conteudo })
      });

      if (!response.ok) throw new Error('Erro ao criar post');
      const novo = await response.json();
      onSave(novo);
      toast.success('Post criado com sucesso!');
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Novo Post</h3>
        <input
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
            {loading ? 'Salvando...' : 'Publicar'}
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
    width: '400px'
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    marginBottom: '1rem'
  },
  textarea: {
    width: '100%',
    padding: '0.5rem',
    marginBottom: '1rem'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem'
  }
};

export default CreatePostModal;
