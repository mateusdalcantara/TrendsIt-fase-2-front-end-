// Variáveis de elementos da interface
const btnPostar = document.getElementById('btn-postar');
const postTextarea = document.getElementById('post-textarea');
const feedDiv = document.getElementById('feed');
const btnSalvar = document.getElementById('btn-salvar');
const nomeUsuarioInput = document.getElementById('nome-usuario-input');
const emailInput = document.getElementById('email-input');
const listaAmigos = document.getElementById('lista-amigos');
const galeriaFotos = document.getElementById('galeria-fotos');
const perfilAcoes = document.getElementById('perfil-acoes');
const capaImagem = document.getElementById('capa');
const fotoPerfilImagem = document.getElementById('foto-perfil');

// Simula que o perfil é do usuário logado
let souEu = true; // Defina isso dinamicamente conforme o backend
if (!souEu) {
    perfilAcoes.classList.remove('d-none');
} else {
    feedDiv.querySelectorAll('.editar-post').forEach((el) => el.classList.remove('d-none'));
}

// Função para realizar requisições GET
const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao buscar dados');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        alert('Erro ao carregar dados.');
    }
};

// Função para realizar requisições POST ou PUT
const postData = async (url, data, method = 'POST') => {
    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Erro ao salvar dados');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        alert('Erro ao enviar dados.');
    }
};

// Carregar dados do perfil
const carregarPerfil = async () => {
    const data = await fetchData('/api/perfil');
    if (data) {
        document.getElementById('nome-usuario').textContent = data.nome;
        document.getElementById('usuario').textContent = `@${data.usuario}`;
        capaImagem.src = data.capa;
        fotoPerfilImagem.src = data.fotoPerfil;
        nomeUsuarioInput.value = data.nome;
        emailInput.value = data.email;

        // Carregar posts, amigos e fotos
        carregarPosts();
        carregarAmigos();
        carregarFotos();
    }
};

// Carregar posts
const carregarPosts = async () => {
    const posts = await fetchData('/api/posts');
    if (posts) {
        feedDiv.innerHTML = '';
        posts.forEach(post => {
            const postHTML = `
                <div class="card p-3" data-id="${post.id}">
                    <p>${post.conteudo}</p>
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-light">Curtir</button>
                        <button class="btn btn-light">Comentar</button>
                        <span class="editar-post">
                            <button class="btn btn-warning">Editar</button>
                            <button class="btn btn-danger">Excluir</button>
                        </span>
                    </div>
                </div>
            `;
            feedDiv.innerHTML += postHTML;
        });
    }
};

// Carregar amigos
const carregarAmigos = async () => {
    const amigos = await fetchData('/api/amigos');
    if (amigos) {
        listaAmigos.innerHTML = '';
        amigos.forEach(amigo => {
            const amigoHTML = `
                <div class="col-4">
                    <img src="${amigo.foto}" class="img-fluid rounded-circle" width="80" alt="Amigo">
                    <p>${amigo.nome}</p>
                </div>
            `;
            listaAmigos.innerHTML += amigoHTML;
        });
    }
};

// Carregar fotos
const carregarFotos = async () => {
    const fotos = await fetchData('/api/fotos');
    if (fotos) {
        galeriaFotos.innerHTML = '';
        fotos.forEach(foto => {
            const fotoHTML = `
                <div class="col-4">
                    <img src="${foto.url}" class="img-fluid" alt="Foto">
                </div>
            `;
            galeriaFotos.innerHTML += fotoHTML;
        });
    }
};

// Salvar alterações no perfil
btnSalvar.addEventListener('click', async () => {
    const nome = nomeUsuarioInput.value;
    const email = emailInput.value;

    const data = await postData('/api/perfil', { nome, email }, 'PUT');
    if (data) {
        alert('Perfil atualizado com sucesso!');
        carregarPerfil(); // Recarrega o perfil atualizado
    }
});

// Publicar novo post
btnPostar.addEventListener('click', async () => {
    const conteudo = postTextarea.value;

    if (!conteudo) {
        alert('Por favor, escreva algo para postar.');
        return;
    }

    const data = await postData('/api/posts', { conteudo });
    if (data) {
        alert('Post publicado com sucesso!');
        carregarPosts(); // Recarrega os posts
    }
});

// Chama o carregamento do perfil ao carregar a página
carregarPerfil();
