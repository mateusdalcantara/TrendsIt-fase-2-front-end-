document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (email === ' ' && password === '') {
        alert('Login realizado com sucesso!');
    
        window.location.href = '../dashboard/dashboard.html';
    } else {
        alert('E-mail ou senha incorretos!');
    }

  
});

