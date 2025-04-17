import React, { useEffect, useState } from 'react';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:8080/postagens', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar postagens');
      }

      const data = await response.json();
      // Ordenar por data decrescente
      const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sorted);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <p>Carregando postagens...</p>;

  return (
    <div>
      <h2>Últimas Postagens</h2>
      {posts.length === 0 ? (
        <p>Nenhuma postagem encontrada.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} style={styles.card}>
            <h3>{post.titulo}</h3>
            <p>{post.conteudo}</p>
            <small>Publicado por {post.autor?.username || 'Desconhecido'} em {new Date(post.createdAt).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  card: {
    background: '#f9f9f9',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '1rem'
  }
};

export default PostList;
