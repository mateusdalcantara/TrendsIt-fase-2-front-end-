import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { SiFacebook, SiGithub } from 'react-icons/si';
import { FaWindows } from 'react-icons/fa';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const styles = {
  container: {
    maxWidth: '400px',
    margin: '2rem auto',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    backgroundColor: '#fff'
  },
  title: { color: '#2d3748', marginBottom: '1.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontWeight: '500', color: '#4a5568' },
  input: {
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '1rem'
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#4299e1',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  socialSection: { margin: '1.5rem 0' },
  separator: { margin: '1.5rem 0', textAlign: 'center' },
  socialButtons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.75rem'
  },
  socialButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  icon: { fontSize: '1.25rem' },
  registerText: {
    textAlign: 'center',
    color: '#718096',
    marginTop: '1rem'
  },
  registerLink: {
    color: '#4299e1',
    fontWeight: '600',
    textDecoration: 'none'
  },
  error: {
    color: '#e53e3e',
    backgroundColor: '#fff5f5',
    padding: '1rem',
    borderRadius: '6px',
    marginBottom: '1rem',
    border: '1px solid #fed7d7'
  }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!email || !password) throw new Error('Preencha todos os campos');
      if (!/\S+@\S+\.\S+/.test(email)) throw new Error('Formato de e-mail inválido');

      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (supabaseError) throw supabaseError;
      if (!data.session?.access_token) throw new Error('Autenticação falhou');

      await authenticateWithBackend(data.session.access_token);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const authenticateWithBackend = async (supabaseToken) => {
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${supabaseToken}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro no backend');
      }

      const data = await response.json();

      // Salva dados do usuário no localStorage
      localStorage.setItem("userId", data.id);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username);
    } catch (err) {
      throw new Error("Erro na comunicação com o servidor");
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            disabled={loading}
            placeholder="seu@email.com"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            disabled={loading}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <div style={styles.socialSection}>
          <div style={styles.separator}>ou continue com</div>
          <div style={styles.socialButtons}>
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              style={styles.socialButton}
              disabled={loading}
            >
              <FcGoogle style={styles.icon} /> Google
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('microsoft')}
              style={styles.socialButton}
              disabled={loading}
            >
              <FaWindows style={{ ...styles.icon, color: '#00A4EF' }} /> Microsoft
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('facebook')}
              style={styles.socialButton}
              disabled={loading}
            >
              <SiFacebook style={{ ...styles.icon, color: '#1877F2' }} /> Facebook
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('github')}
              style={styles.socialButton}
              disabled={loading}
            >
              <SiGithub style={{ ...styles.icon, color: '#333' }} /> GitHub
            </button>
          </div>
        </div>

        <p style={styles.registerText}>
          Ainda não tem conta?{' '}
          <Link to="/register" style={styles.registerLink}>
            Criar conta
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
