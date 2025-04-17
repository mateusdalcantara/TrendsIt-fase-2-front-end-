import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const menuItems = [
    { path: '/vagas', label: 'Vagas' },
    { path: '/eventos', label: 'Eventos' },
    { path: '/postagens', label: 'Postagens' },
    { path: '/comentarios', label: 'Comentários' },
    { path: '/diretorios', label: 'Diretórios' },
    { path: '/usuarios', label: 'Perfis' },
    { path: '/amizades', label: 'Amizades' },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Bem-vindo ao Painel Central</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {menuItems.map((item) => (
          <li key={item.path} style={{ marginBottom: '1rem' }}>
            <Link to={item.path} style={{ fontSize: '1.2rem', color: '#3182ce' }}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
