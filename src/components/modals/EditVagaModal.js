import React, { useState } from 'react';
import { toast } from 'react-toastify';

const EditVagaModal = ({ vaga, onClose, onSave }) => {
  const [titulo, setTitulo] = useState(vaga.titulo);
  const [conteudo, setConteudo] = useState(vaga.conteudo);
  const [salario, setSalario] = useState(vaga.salario);
  const [local, setLocal] = useState(vaga.local);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleUpdate = async () => {
    if (!titulo || !conteudo || !salario || !local) {
      toast.error('Preencha todos os campos');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8080/api/vagas/${vaga.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ titulo, conteudo, salario, local })
        }
      );
      if (!res.ok) throw new Error('Erro ao atualizar vaga');
      const updated = await res.json();
      toast.success('Vaga atualizada com sucesso!');
      onSave(updated);
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
        <h3>Editar Vaga</h3>
        <input
          placeholder="Título"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="Descrição"
          value={conteudo}
          onChange={e => setConteudo(e.target.value)}
          rows={3}
          style={styles.textarea}
        />
        <input
          placeholder="Salário"
          value={salario}
          onChange={e => setSalario(e.target.value)}
          style={styles.input}
        />
        <input
          placeholder="Local"
          value={local}
          onChange={e => setLocal(e.target.value)}
          style={styles.input}
        />
        <div style={styles.actions}>
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
    position: 'fixed', top: 0, left: 0,
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    background: '#fff', borderRadius: '8px',
    padding: '1.5rem', width: '400px',
    display: 'flex', flexDirection: 'column', gap: '0.75rem'
  },
  input: { width: '100%', padding: '0.5rem' },
  textarea: { width: '100%', padding: '0.5rem' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '1rem' }
};

export default EditVagaModal;
