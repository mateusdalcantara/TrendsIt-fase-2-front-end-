import React, { useState } from 'react';
import { toast } from 'react-toastify';

const CreateEventoModal = ({ onClose, onSave }) => {
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [dataEvento, setDataEvento] = useState('');
  const [local, setLocal] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleSalvar = async () => {
    if (!titulo || !conteudo || !dataEvento || !local) {
      toast.error('Preencha todos os campos');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/eventos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo,
          conteudo,
          dataEvento,  // ISO string YYYY-MM-DDTHH:mm:ss ou date
          local
        })
      });
      if (!response.ok) throw new Error('Erro ao criar evento');
      const novoEvento = await response.json();
      toast.success('Evento criado com sucesso!');
      onSave(novoEvento);
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
        <h3>Novo Evento</h3>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="Descrição"
          rows={3}
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          style={styles.textarea}
        />
        <input
          type="datetime-local"
          value={dataEvento}
          onChange={(e) => setDataEvento(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Local"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          style={styles.input}
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
    position: 'fixed', top: 0, left: 0,
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
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  input: {
    width: '100%', padding: '0.5rem', fontSize: '1rem'
  },
  textarea: {
    width: '100%', padding: '0.5rem', fontSize: '1rem'
  },
  actions: {
    display: 'flex', justifyContent: 'flex-end', gap: '1rem'
  }
};

export default CreateEventoModal;
