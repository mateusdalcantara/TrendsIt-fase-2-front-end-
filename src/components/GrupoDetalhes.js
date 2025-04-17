import React from 'react';
import { useParams } from 'react-router-dom';

const GrupoDetalhes = () => {
  const { id } = useParams();

  return (
    <div>
      <h2>Detalhes do Grupo {id}</h2>
      <p>Conteúdo, membros e interações específicas do grupo.</p>
    </div>
  );
};

export default GrupoDetalhes;
