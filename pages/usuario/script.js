// Função de logout
function sair() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
  window.location.href = '/pages/login/index.html';
}

// Função para carregar o perfil do usuário
function carregarPerfil() {
  const token = localStorage.getItem('token');
  const perfilContent = document.getElementById('perfilContent');

  if (!token) {
    perfilContent.innerHTML = "<p class='text-danger'>Você precisa estar logado para ver o perfil.</p>";
    return;
  }

  perfilContent.innerHTML = "<p class='text-muted'>Carregando perfil...</p>";

  fetch('http://localhost:8080/profiles/meu-perfil', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao carregar perfil.");
      return res.json();
    })
    .then(perfil => {
      console.log("Perfil carregado:", perfil);
      perfilContent.innerHTML = `
        <h5>${perfil.username}</h5>
        <p><strong>ID:</strong> ${perfil.id}</p>
        <p><strong>Idade:</strong> ${perfil.idade}</p>
        <p><strong>Curso:</strong> ${perfil.curso}</p>
        <p><strong>Diretório:</strong> ${perfil.diretorioNome}</p>
        <p><strong>Função:</strong> ${perfil.role}</p>
        <p><strong>Número de Amigos:</strong> ${perfil.friendNumber}</p>
        <p><strong>Imagem do Perfil:</strong> <img src="${perfil.profileImage}" alt="Imagem do Perfil" width="100" /></p>
        <p><strong>Criado em:</strong> ${new Date(perfil.createdAt).toLocaleString()}</p>
      `;
    })
    .catch(() => {
      perfilContent.innerHTML = "<p class='text-danger'>Erro ao carregar perfil.</p>";
    });
}

// Chama a função de carregarPerfil ao abrir o modal
$('#perfilModal').on('shown.bs.modal', function () {
  carregarPerfil();
});

// Função de busca global por pessoas, grupos e eventos
function buscarConteudo() {
  const termo = document.getElementById('campoBusca').value.trim();
  if (!termo) return;

  const feed = document.getElementById('feedConteudo');
  feed.innerHTML = "<p class='text-muted'>Buscando...</p>";

  const token = localStorage.getItem('token');

  fetch(`/api/busca?query=${encodeURIComponent(termo)}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(resultados => {
      feed.innerHTML = `<p class='text-muted'>Resultados para: <strong>${termo}</strong></p>`;

      if (
        resultados.pessoas.length === 0 &&
        resultados.grupos.length === 0 &&
        resultados.eventos.length === 0
      ) {
        feed.innerHTML += "<p class='text-warning'>Nenhum resultado encontrado.</p>";
        return;
      }

      resultados.pessoas.forEach(pessoa => {
        feed.innerHTML += `
          <div class="feed-card">
            <h6>👤 Pessoa: ${pessoa.nome}</h6>
            <p>Email: ${pessoa.email}</p>
          </div>
        `;
      });

      resultados.grupos.forEach(grupo => {
        feed.innerHTML += `
          <div class="feed-card">
            <h6>👥 Grupo: ${grupo.nome}</h6>
            <p>${grupo.descricao}</p>
          </div>
        `;
      });

      resultados.eventos.forEach(evento => {
        feed.innerHTML += `
          <div class="feed-card">
            <h6>📅 Evento: ${evento.titulo}</h6>
            <p>${evento.descricao}</p>
          </div>
        `;
      });
    })
    .catch(() => {
      feed.innerHTML = "<p class='text-danger'>Erro ao realizar a busca.</p>";
    });
}

// Função para carregar o feed inicial com posts, eventos e vagas
function carregarFeed() {
  const feed = document.getElementById('feedConteudo');
  feed.innerHTML = "<p class='text-muted'>Carregando conteúdo...</p>";

  const token = localStorage.getItem('token');

  Promise.all([
    fetch('/api/posts/amigos', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
    fetch('/api/eventos/amigos', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
    fetch('/api/vagas/recentes', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json())
  ])
    .then(([posts, eventos, vagas]) => {
      feed.innerHTML = '';

      posts.forEach(post => {
        feed.innerHTML += `
          <div class="feed-card">
            <h6>${post.autor}</h6>
            <small>${new Date(post.data).toLocaleString()}</small>
            <p>${post.conteudo}</p>
          </div>
        `;
      });

      eventos.forEach(evento => {
        feed.innerHTML += `
          <div class="feed-card">
            <h6>📅 Evento: ${evento.titulo}</h6>
            <small>${new Date(evento.data).toLocaleDateString()}</small>
            <p>${evento.descricao}</p>
          </div>
        `;
      });

      vagas.forEach(vaga => {
        feed.innerHTML += `
          <div class="feed-card">
            <h6>💼 Vaga: ${vaga.titulo}</h6>
            <small>${vaga.empresa} • ${new Date(vaga.publicadaEm).toLocaleDateString()}</small>
            <p>${vaga.descricao}</p>
          </div>
        `;
      });
    })
    .catch(() => {
      feed.innerHTML = "<p class='text-danger'>Erro ao carregar o feed.</p>";
    });
}

// Verifica se o usuário está logado ao carregar a página
window.onload = function() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/pages/login/index.html';
  } else {
    carregarFeed();
  }
};

// Redireciona para o perfil do usuário
function irParaPerfil() {
  window.location.href = '/pages/perfil/index.html';
}
