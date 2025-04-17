import React from 'react';

const CreateVagaModal = ({ onClose }) => {
  return (
    <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}>
      <h2>Nova Vaga</h2>
      <p>[Formulário para inserir título, conteúdo, local, salário]</p>
      <button onClick={onClose}>Fechar</button>
    </div>
  );
};

export default CreateVagaModal;
