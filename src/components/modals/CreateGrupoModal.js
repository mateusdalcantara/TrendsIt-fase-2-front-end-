import React from 'react';

const CreateGrupoModal = ({ onClose }) => {
  return (
    <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}>
      <h2>Novo Grupo</h2>
      <p>[Formulário de criação de grupo com nome e descrição]</p>
      <button onClick={onClose}>Fechar</button>
    </div>
  );
};

export default CreateGrupoModal;
