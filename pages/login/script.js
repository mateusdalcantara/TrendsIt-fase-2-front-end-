const form = document.getElementById('authForm');
const formTitle = document.getElementById('formTitle');
const toggleText = document.getElementById('toggleText');
const toggleLink = document.getElementById('toggleLink');
const usernameInput = document.getElementById('username');
const messageDiv = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');

let isLogin = true;

window.onload = function() {
  const token = localStorage.getItem('token');
  if (token) {
    // Se o token estiver no localStorage, redireciona diretamente para a página do usuário
    window.location.href = 'http://localhost:3000/pages/usuario/index.html';
  }
};

function updateFormMode() {
  formTitle.textContent = isLogin ? 'Login' : 'Cadastro';
  toggleText.textContent = isLogin ? 'Não tem uma conta?' : 'Já tem conta?';
  toggleLink.textContent = isLogin ? 'Cadastre-se' : 'Entrar';
  usernameInput.style.display = isLogin ? 'none' : 'block';
  submitBtn.textContent = isLogin ? 'Entrar' : 'Cadastrar';
}

toggleLink.addEventListener('click', () => {
  isLogin = !isLogin;
  updateFormMode();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  messageDiv.textContent = '';
  messageDiv.classList.remove('error');

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const username = document.getElementById('username').value;

  try {
    if (isLogin) {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) throw new Error('Erro no login');

      const data = await response.json();

      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('username', data.username);
      localStorage.setItem('role', data.role);

      messageDiv.textContent = `Bem-vindo, ${data.username}!`;
      console.log('Usuário logado:', data);
      
      // Redireciona para a página do usuário
      window.location.href = 'http://localhost:3000/pages/usuario/index.html';
    } else {
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username })
      });

      const text = await response.text();
      if (!response.ok) throw new Error(text || 'Erro no cadastro');

      messageDiv.textContent = 'Cadastro realizado com sucesso! Faça login.';
      isLogin = true;
      updateFormMode();
    }
  } catch (err) {
    messageDiv.textContent = err.message;
    messageDiv.classList.add('error');
  }
});

// Inicializa a interface
updateFormMode();
