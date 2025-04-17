import React from 'react';
import { useNavigate } from 'react-router-dom';

import PostList from './PostList';
import ProfileModal from './modals/ProfileModal';
import CreatePostModal from './modals/CreatePostModal';
import CreateEventoModal from './modals/CreateEventoModal';
import CalendarEventos from './CalendarEventos';
import VagasList from './VagasList';
import CreateVagaModal from './modals/CreateVagaModal';
import CreateGrupoModal from './modals/CreateGrupoModal';

const FeedInicial = () => {
  const [posts, setPosts] = React.useState([]);
  const [showProfile, setShowProfile] = React.useState(false);
  const [showCreatePost, setShowCreatePost] = React.useState(false);
  const [showCreateEvento, setShowCreateEvento] = React.useState(false);
  const [showCreateVaga, setShowCreateVaga] = React.useState(false);
  const [showCreateGrupo, setShowCreateGrupo] = React.useState(false);

  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1>Feed de Notícias</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setShowProfile(true)}>Meu Perfil</button>
          <button onClick={() => setShowCreatePost(true)}>Novo Post</button>
          <button onClick={() => setShowCreateEvento(true)}>Novo Evento</button>
          <button onClick={() => navigate('/diretorio')}>Diretório</button>
          <button onClick={() => navigate('/grupos')}>Meus Grupos</button>
          <button onClick={() => setShowCreateGrupo(true)}>Criar Grupo</button>
        </div>
      </header>

      <PostList posts={posts} setPosts={setPosts} />

      <section style={{ marginTop: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Calendário de Eventos</h2>
          <button onClick={() => setShowCreateEvento(true)}>Novo Evento</button>
        </div>
        <CalendarEventos />
      </section>

      <section style={{ marginTop: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>Vagas Disponíveis</h2>
          <button onClick={() => setShowCreateVaga(true)}>Nova Vaga</button>
        </div>
        <VagasList />
      </section>
      

      {/* Modais */}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}

      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          onSave={(novo) => setPosts(prev => [novo, ...prev])}
        />
      )}

      {showCreateEvento && (
        <CreateEventoModal
          onClose={() => setShowCreateEvento(false)}
          onSave={(novoEvento) => { /* ... */ }}
        />
      )}

      {showCreateVaga && (
        <CreateVagaModal
          onClose={() => setShowCreateVaga(false)}
          onSave={(nova) => {
            // Se você mantiver a lista de vagas em estado, adicione aqui:
            // setVagas(prev => [nova, ...prev]);
          }}
        />
      )}

      {showCreateGrupo && <CreateGrupoModal onClose={() => setShowCreateGrupo(false)} />}
      {showCreateVaga && <CreateVagaModal onClose={() => setShowCreateVaga(false)} />}
      {showCreateGrupo && <CreateGrupoModal onClose={() => setShowCreateGrupo(false)} />}
    </div>
  );
};

export default FeedInicial;
