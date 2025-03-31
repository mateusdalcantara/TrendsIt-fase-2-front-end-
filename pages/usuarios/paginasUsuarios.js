// Função para seguir um usuário
const seguirUsuario = (usuarioId) => {
    // Envia uma requisição POST para o back-end para seguir o usuário
    fetch(`/api/seguir/${usuarioId}`, {
        method: 'POST', // Método HTTP, neste caso POST
        headers: {
            'Content-Type': 'application/json', // Enviar o conteúdo como JSON
        },
        body: JSON.stringify({ usuarioId: usuarioId }) // Corpo da requisição, passando o ID do usuário
    })
    .then(response => response.json()) // Espera pela resposta do back-end em formato JSON
    .then(data => {
        if (data.status === 'sucesso') {
            // Se a resposta for sucesso, altere o texto e a classe do botão para "Seguindo"
            document.getElementById('btnSeguir').textContent = 'Seguindo';
            document.getElementById('btnSeguir').classList.replace('btn-primary', 'btn-secondary');
        } else {
            alert('Erro ao tentar seguir o usuário.');
        }
    })
    .catch(error => console.error('Erro:', error)); // Tratamento de erro
};

// Função para deixar de seguir um usuário
const deixarDeSeguirUsuario = (usuarioId) => {
    // Envia uma requisição DELETE para o back-end para deixar de seguir o usuário
    fetch(`/api/deixarDeSeguir/${usuarioId}`, {
        method: 'DELETE', // Método HTTP, neste caso DELETE
        headers: {
            'Content-Type': 'application/json', // Enviar o conteúdo como JSON
        },
        body: JSON.stringify({ usuarioId: usuarioId }) // Corpo da requisição, passando o ID do usuário
    })
    .then(response => response.json()) // Espera pela resposta do back-end em formato JSON
    .then(data => {
        if (data.status === 'sucesso') {
            // Se a resposta for sucesso, altere o texto e a classe do botão para "Seguir"
            document.getElementById('btnSeguir').textContent = 'Seguir';
            document.getElementById('btnSeguir').classList.replace('btn-secondary', 'btn-primary');
        } else {
            alert('Erro ao tentar deixar de seguir o usuário.');
        }
    })
    .catch(error => console.error('Erro:', error)); // Tratamento de erro
};

// Função para adicionar um amigo
const adicionarAmigo = (usuarioId) => {
    // Envia uma requisição POST para o back-end para adicionar o usuário como amigo
    fetch(`/api/adicionarAmigo/${usuarioId}`, {
        method: 'POST', // Método HTTP, neste caso POST
        headers: {
            'Content-Type': 'application/json', // Enviar o conteúdo como JSON
        },
        body: JSON.stringify({ usuarioId: usuarioId }) // Corpo da requisição, passando o ID do usuário
    })
    .then(response => response.json()) // Espera pela resposta do back-end em formato JSON
    .then(data => {
        if (data.status === 'sucesso') {
            // Se a resposta for sucesso, altere o texto e a classe do botão para "Amigo"
            document.getElementById('btnAmigo').textContent = 'Amigo';
            document.getElementById('btnAmigo').classList.replace('btn-success', 'btn-secondary');
        } else {
            alert('Erro ao adicionar amigo.');
        }
    })
    .catch(error => console.error('Erro:', error)); // Tratamento de erro
};

// Função para remover amigo
const removerAmigo = (usuarioId) => {
    // Envia uma requisição DELETE para o back-end para remover o amigo
    fetch(`/api/removerAmigo/${usuarioId}`, {
        method: 'DELETE', // Método HTTP, neste caso DELETE
        headers: {
            'Content-Type': 'application/json', // Enviar o conteúdo como JSON
        },
        body: JSON.stringify({ usuarioId: usuarioId }) // Corpo da requisição, passando o ID do usuário
    })
    .then(response => response.json()) // Espera pela resposta do back-end em formato JSON
    .then(data => {
        if (data.status === 'sucesso') {
            // Se a resposta for sucesso, altere o texto e a classe do botão para "Adicionar Amigo"
            document.getElementById('btnAmigo').textContent = 'Adicionar Amigo';
            document.getElementById('btnAmigo').classList.replace('btn-secondary', 'btn-success');
        } else {
            alert('Erro ao remover amigo.');
        }
    })
    .catch(error => console.error('Erro:', error)); // Tratamento de erro
};

// Função para comentar em um post
const comentarPost = (postId, comentario) => {
    // Envia uma requisição POST para o back-end para adicionar um comentário a um post
    fetch(`/api/comentar/${postId}`, {
        method: 'POST', // Método HTTP, neste caso POST
        headers: {
            'Content-Type': 'application/json', // Enviar o conteúdo como JSON
        },
        body: JSON.stringify({ comentario: comentario }) // Corpo da requisição, passando o comentário
    })
    .then(response => response.json()) // Espera pela resposta do back-end em formato JSON
    .then(data => {
        if (data.status === 'sucesso') {
            alert('Comentário adicionado com sucesso!');
            // Atualiza o UI com o novo comentário, pode ser feito de acordo com a estrutura do seu HTML
        } else {
            alert('Erro ao comentar no post.');
        }
    })
    .catch(error => console.error('Erro:', error)); // Tratamento de erro
};

// Função para curtir um post
const curtirPost = (postId) => {
    // Envia uma requisição POST para o back-end para curtir o post
    fetch(`/api/curtir/${postId}`, {
        method: 'POST', // Método HTTP, neste caso POST
        headers: {
            'Content-Type': 'application/json', // Enviar o conteúdo como JSON
        },
    })
    .then(response => response.json()) // Espera pela resposta do back-end em formato JSON
    .then(data => {
        if (data.status === 'sucesso') {
            // Atualiza o contador de curtidas no botão
            const likeCount = document.querySelector(`#post-${postId} .like-count`);
            likeCount.textContent = parseInt(likeCount.textContent) + 1;
        } else {
            alert('Erro ao curtir o post.');
        }
    })
    .catch(error => console.error('Erro:', error)); // Tratamento de erro
};

// Função para descurtir um post
const descurtirPost = (postId) => {
    // Envia uma requisição DELETE para o back-end para descurtir o post
    fetch(`/api/descurtir/${postId}`, {
        method: 'DELETE', // Método HTTP, neste caso DELETE
        headers: {
            'Content-Type': 'application/json', // Enviar o conteúdo como JSON
        },
    })
    .then(response => response.json()) // Espera pela resposta do back-end em formato JSON
    .then(data => {
        if (data.status === 'sucesso') {
            // Atualiza o contador de descurtidas no botão
            const dislikeCount = document.querySelector(`#post-${postId} .dislike-count`);
            dislikeCount.textContent = parseInt(dislikeCount.textContent) + 1;
        } else {
            alert('Erro ao descurtir o post.');
        }
    })
    .catch(error => console.error('Erro:', error)); // Tratamento de erro
};
