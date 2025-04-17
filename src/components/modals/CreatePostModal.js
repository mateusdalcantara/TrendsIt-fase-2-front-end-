import React from 'react';

const CreatePostModal = ({ onClose }) => {
  return (
    <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}>
      <h2>Novo Post</h2>
      <p>[Formulário de criação de post com título e conteúdo]</p>
      <button onClick={onClose}>Fechar</button>
    </div>
  );
};

export default CreatePostModal;
