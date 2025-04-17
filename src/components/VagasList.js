import React, { useEffect, useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import EditVagaModal from './modals/EditVagaModal';

const VagasList = () => {
  const [vagas, setVagas] = useState([]);
  const [editandoVaga, setEditandoVaga] = useState(null);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:8080/api/vagas', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Erro ao buscar vagas');
        const json = await res.json();
        // Se vier um objeto com lista em alguma propriedade (ex: { content: [...] })
        const list = Array.isArray(json)
          ? json
          : Array.isArray(json.content)
          ? json.content
          : [];
        setVagas(list);
      } catch (err) {
        toast.error(err.message);
      }
    })();
  }, [token]);

  const handleDeletar = async (id) => {
    if (!window.confirm('Excluir vaga?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/vagas/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Erro ao excluir vaga');
      setVagas((prev) => prev.filter((v) => v.id !== id));
      toast.success('Vaga excluída');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Se não for array, evita o crash
  if (!Array.isArray(vagas)) {
    return <p>Carregando vagas...</p>;
  }

  return (
    <div>
      {vagas.map((vaga) => (
        <div key={vaga.id} style={styles.card}>
          <h4>{vaga.titulo}</h4>
          <p>{vaga.conteudo}</p>
          <small>
            {vaga.salario} — {vaga.local}
          </small>
          <div style={styles.actions}>
            {(vaga.autor?.id === Number(userId) || userRole === 'ADMIN') && (
              <>
                <button
                  onClick={() => setEditandoVaga(vaga)}
                  style={styles.btn}
                >
                  <FaEdit /> Editar
                </button>
                <button
                  onClick={() => handleDeletar(vaga.id)}
                  style={{ ...styles.btn, color: 'red' }}
                >
                  <FaTrash /> Excluir
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      {editandoVaga && (
        <EditVagaModal
          vaga={editandoVaga}
          onClose={() => setEditandoVaga(null)}
          onSave={(updated) => {
            setVagas((prev) =>
              prev.map((v) => (v.id === updated.id ? updated : v))
            );
            setEditandoVaga(null);
          }}
        />
      )}
    </div>
  );
};

const styles = {
  card: {
    background: '#f0f0f0',
    padding: '1rem',
    borderRadius: '6px',
    marginBottom: '1rem'
  },
  actions: { marginTop: '0.5rem', display: 'flex', gap: '0.5rem' },
  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    cursor: 'pointer',
    border: 'none',
    background: 'none'
  }
};

export default VagasList;
