// Função para carregar o feed inicial com posts, eventos e vagas
function carregarFeed() {
  const feed = document.getElementById('feedConteudo');
  feed.innerHTML = "<p class='text-muted'>Carregando conteúdo...</p>";

  Promise.all([
    fetch('/api/posts/amigos').then(res => res.json()),
    fetch('/api/eventos/amigos').then(res => res.json()),
    fetch('/api/vagas/recentes').then(res => res.json())
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

// Função de busca global por pessoas, grupos e eventos
function buscarConteudo() {
  const termo = document.getElementById('campoBusca').value.trim();
  if (!termo) return;

  const feed = document.getElementById('feedConteudo');
  feed.innerHTML = "<p class='text-muted'>Buscando...</p>";

  fetch(`/api/busca?query=${encodeURIComponent(termo)}`)
    .then(res => res.json())
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

// Carrega o feed assim que a tela for carregada
window.onload = function() {
  const token = localStorage.getItem('token');
  if (!token) {
    // Se o token não existir, redireciona para a página de login
    window.location.href = 'http://localhost:3000/pages/login/index.html';
  } else {
    // Carregar feed, posts, eventos e vagas se o token for encontrado
    carregarFeed();
  }
};
