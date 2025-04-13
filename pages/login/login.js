
let logged = sessionStorage.getItem('logged');
const session = localStorage.getItem('session');



document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    
    const accont = getAccount(email);

    if(!accont){
      alert('Ops, verifiqe o seu usuario e senha!');
      return;
    }
      if(accont){
        if(accont.password !== password){
          alert('Ops, verifiqe o seu usuario e senha!');
          return;
      }
      saveSession(email, checkSession );
      window.location.href = './pages/perfil/perfil.html';
  }
 
  console.log(email)
  handleLogin(event);
  
});

// Criar conta

document.getElementById('form-create').addEventListener('submit', function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if(email.length < 5) {
      alert('Preencha o compo com um e-amil valido');
      return;
  }if(password.length < 4) {
      alert('A senha deve ter no minimo 6 caracteres');
      return;
  }

  alert("Conta criada com sucesso");
});



// checa se ta logado
function checkLogged(){
  if(session){
      sessionStorage.setItem('logged', session);
      logged = session;
  }
  if(logged){
      saveSession(logged, session);

      window.location.href = 'home.html';
}
}

// salva a sessao
function saveSession(data, saveSession ){
  if(saveSession){
      localStorage.setItem('session', data);
  }
  sessionStorage.setItem('logged', data);
}

function getAccount(key){
  const accont = localStorage.getItem(key)
  if(accont){
      return JSON.parse(accont);
  }
  return '';
}

 