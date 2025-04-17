import React, { useEffect, useState } from 'react';

const ProfileModal = ({ onClose }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:8080/perfil/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar dados do perfil');
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <div style={styles.overlay}><p>Carregando perfil...</p></div>;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Meu Perfil</h2>
        {profile ? (
          <div>
            <img
              src={profile.profileImage || '/default-avatar.png'}
              alt="Avatar"
              style={styles.avatar}
            />
            <p><strong>Nome:</strong> {profile.username}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Curso:</strong> {profile.curso || 'N/A'}</p>
            <p><strong>Idade:</strong> {profile.idade || 'N/A'}</p>
            <p><strong>Data de criação:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
          </div>
        ) : (
          <p>Perfil não encontrado.</p>
        )}
        <button onClick={onClose} style={styles.button}>Fechar</button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '1rem'
  },
  button: {
    marginTop: '1.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#4299e1',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};

export default ProfileModal;
