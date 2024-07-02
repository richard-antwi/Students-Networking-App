import axios from 'axios';

const token = localStorage.getItem('token');

export const likePost = async (postId) => {
  try {
    const response = await axios.put(`/api/posts/like/${postId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error liking the post:', error);
    throw error;
  }
};

export const unlikePost = async (postId) => {
  try {
    const response = await axios.put(`/api/posts/unlike/${postId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error unliking the post:', error);
    throw error;
  }
};
