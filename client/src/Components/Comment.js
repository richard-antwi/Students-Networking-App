import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faReply, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import avatar from '../Images/avatar.webp';
import axios from 'axios';

const Comment = ({ comment, postId, fetchPosts }) => {
  const [replyContent, setReplyContent] = useState('');
  const [showReply, setShowReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const handleLikeComment = async () => {
    try {
      await axios.post(`http://localhost:3001/api/comments/like/${comment._id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchPosts();
    } catch (error) {
      console.error('Error liking the comment:', error);
    }
  };
//handle reply

  const handleReply = async () => {
    try {
      await axios.post(`http://localhost:3001/api/comments/reply/${postId}`, {
        text: replyContent,
        parentId: comment._id,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setReplyContent('');
      setShowReply(false);
      fetchPosts();
    } catch (error) {
      console.error('Error replying to the comment:', error);
    }
  };

  return (
    <div className="mb-3">
      <div className="d-flex align-items-start">
        <img src={avatar} alt="User Avatar" className="img-fluid rounded-circle mr-3" style={{ width: '40px', height: '40px' }} />
        <div>
          <div className="d-flex justify-content-between">
            <h6 className="mb-0">{comment.user.firstName} {comment.user.lastName}</h6>
            <span className="text-muted">{new Date(comment.createdAt).toLocaleString()}</span>
          </div>
          <p>{comment.text}</p>
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faHeart} onClick={handleLikeComment} className="text-danger mr-2" />
            <span className="mr-3">{comment.likes.length}</span>
            <FontAwesomeIcon icon={faReply} onClick={() => setShowReply(!showReply)} className="text-primary mr-2" />
            <span className="mr-3">Reply</span>
            {comment.replies.length > 0 && (
              <FontAwesomeIcon icon={faCommentDots} onClick={() => setShowReplies(!showReplies)} className="text-secondary" />
            )}
          </div>
          {showReply && (
            <div className="mt-2">
              <textarea
                className="form-control mb-2"
                rows="2"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
              />
              <button className="btn btn-primary" onClick={handleReply}>Reply</button>
            </div>
          )}
          {showReplies && comment.replies.map(reply => (
            <Comment key={reply._id} comment={reply} postId={postId} fetchPosts={fetchPosts} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Comment;
