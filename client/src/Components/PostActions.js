import axios from 'axios';

const likePost = async (postId, userId) => {
  try {
    const response = await axios.put(`/api/posts/like/${postId}`, { userId });
    return response.data;
  } catch (error) {
    console.error('Error liking the post:', error);
    throw error;
  }
};

const unlikePost = async (postId, userId) => {
  try {
    const response = await axios.put(`/api/posts/unlike/${postId}`, { userId });
    return response.data;
  } catch (error) {
    console.error('Error unliking the post:', error);
    throw error;
  }
};

export { likePost, unlikePost };
