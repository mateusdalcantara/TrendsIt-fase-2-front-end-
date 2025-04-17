import React from 'react';
import { useNavigate } from 'react-router-dom';

// Subcomponentes (que você pode criar aos poucos)
import PostList from './PostList';
import ProfileModal from './modals/ProfileModal';
import CreatePostModal from './modals/CreatePostModal';
import CalendarEventos from './CalendarEventos';
import VagasList from './VagasList';
import CreateVagaModal from './modals/CreateVagaModal';
import CreateGrupoModal from './modals/CreateGrupoModal';



const FeedInicial = () => {
  const [showProfile, setShowProfile] = React.useState(false);
  const [showCreatePost, setShowCreatePost] = React.useState(false);
  const [showCreateVaga, setShowCreateVaga] = React.useState(false);
  const [showCreateGrupo, setShowCreateGrupo] = React.useState(false);
  const [posts, setPosts] = React.useState([]);
  

  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1>Feed de Notícias</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setShowProfile(true)}>Meu Perfil</button>
          <button onClick={() => setShowCreatePost(true)}>Novo Post</button>
          <button onClick={() => navigate('/diretorio')}>Diretório de Alunos</button>
          <button onClick={() => navigate('/grupos')}>Meus Grupos</button>
          <button onClick={() => setShowCreateGrupo(true)}>Criar Grupo</button>
        </div>
      </header>

      <PostList posts={posts} setPosts={setPosts} />

      <section style={{ marginTop: '3rem' }}>
        <h2>Calendário de Eventos</h2>
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
        onSave={(novoPost) => setPosts(prev => [novoPost, ...prev])}
      />
      )}
      {showCreateVaga && <CreateVagaModal onClose={() => setShowCreateVaga(false)} />}
      {showCreateGrupo && <CreateGrupoModal onClose={() => setShowCreateGrupo(false)} />}
    </div>
  );
};

export default FeedInicial;
