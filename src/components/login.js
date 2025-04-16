import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { 
  SiFacebook, 
  SiGithub 
} from 'react-icons/si';
import { supabase } from '../utils/supabaseClient';
import { FaWindows } from 'react-icons/fa';

// Styles moved outside component
const styles = {
  container: {
    maxWidth: '400px',
    margin: '2rem auto',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    backgroundColor: '#fff'
  },
  title: {
    color: '#2d3748',
    marginBottom: '1.5rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontWeight: '500',
    color: '#4a5568'
  },
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
  socialSection: {
    margin: '1.5rem 0'
  },
  separator: {
    position: 'relative',
    margin: '1.5rem 0',
    textAlign: 'center'
  },
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
  icon: {
    fontSize: '1.25rem'
  },
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


    const handleLogin = async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
  
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("token", data.supabaseToken);
          navigate("/home");
        }
      } catch (error) {
        console.error("Erro no login:", error);
      }
    };

    try {
      // Validation
      if (!email || !password) throw new Error('Please fill in all fields');
      if (!/\S+@\S+\.\S+/.test(email)) throw new Error('Invalid email format');

      // Supabase authentication
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (supabaseError) throw supabaseError;
      if (!data.session?.access_token) throw new Error('Authentication failed');

      // Backend verification
      await authenticateWithBackend(data.session.access_token);
      navigate('/dashboard');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  const authenticateWithBackend = async (token) => {
    try {
      // Validate inputs
      if (!email || !password) throw new Error('Please fill in all fields');
  
      
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Required for JSON
        },
        body: JSON.stringify({ // Must match LoginRequest structure
          email: email,
          password: password
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
  
      const data = await response.json();
      console.log("Login successful:", data);
      navigate('/dashboard');
  
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
  try {
    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.supabaseToken); // Armazene o token
      navigate("/home"); // Redirecione para a tela principal
    }
  } catch (error) {
    console.error("Erro no login:", error);
  }
};

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      
      {/* Error Message Display */}
      {error && <p style={styles.error}>{error}</p>}
  
      {/* Email/Password Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Form Inputs */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            disabled={loading}
            placeholder="your.email@example.com"
          />
        </div>
  
        <div style={styles.formGroup}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            disabled={loading}
            placeholder="••••••••"
          />
        </div>
  
        {/* Login Button */}
        <button
          type="submit"
          style={styles.button}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
  
        {/* Social Login Section */}
        <div style={styles.socialSection}>
          <div style={styles.separator}>
            <span style={styles.separatorText}>or continue with</span>
          </div>
  
          <div style={styles.socialButtons}>
            {/* Social Login Buttons */}
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              style={styles.socialButton}
              disabled={loading}
            >
              <FcGoogle style={styles.icon} />
              Google
            </button>
  
            <button
              type="button"
              onClick={() => handleSocialLogin('microsoft')}
              style={styles.socialButton}
              disabled={loading}
            >
              <FaWindows style={{ ...styles.icon, color: '#00A4EF' }} />
              Microsoft
              </button>
  
            <button
              type="button"
              onClick={() => handleSocialLogin('facebook')}
              style={styles.socialButton}
              disabled={loading}
            >
              <SiFacebook style={{ ...styles.icon, color: '#1877F2' }} />
              Facebook
            </button>
  
            <button
              type="button"
              onClick={() => handleSocialLogin('github')}
              style={styles.socialButton}
              disabled={loading}
            >
              <SiGithub style={{ ...styles.icon, color: '#333' }} />
              GitHub
            </button>
          </div>
        </div>
  
        {/* Registration Link */}
        <p style={styles.registerText}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.registerLink}>
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;