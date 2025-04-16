// postsService.js
import { makeAuthenticatedRequest } from '../api.js'; // Adjust path as needed

export const PostService = {
  createPost: async (postData) => {
    return makeAuthenticatedRequest('/api/post', 'POST', {
      titulo: postData.titulo,  // Match input names to DTO
      conteudo: postData.conteudo
    });
  },

  getPosts: async () => {
    return makeAuthenticatedRequest('/api/post', 'GET');
  },

  updatePost: async (postId, postData) => {
    return makeAuthenticatedRequest(`/api/post/${postId}`, 'PUT', postData);
  },

  deletePost: async (postId) => {
    return makeAuthenticatedRequest(`/api/post/${postId}`, 'DELETE');
  }
};