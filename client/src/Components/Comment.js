import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faReply, faCommentDots, faImage, faVideo } from '@fortawesome/free-solid-svg-icons';
import avatar from '../Images/avatar.webp';
import axios from 'axios';

const Comment = ({ comment, postId, fetchPosts }) => {
  const [replyContent, setReplyContent] = useState('');
  const [showReply, setShowReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [attachmentType, setAttachmentType] = useState(null);
  const [attachment, setAttachment] = useState(null);

  const handleLikeComment = async () => {
    try {
      await axios.post(`http://localhost:3001/api/posts/comments/like/${comment._id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchPosts();
    } catch (error) {
      console.error('Error liking the comment:', error);
    }
  };

  const handleReply = async () => {
    try {
      await axios.post(`http://localhost:3001/api/posts/comments/reply/${postId}`, {
        text: replyContent,
        parentId: comment._id,
        attachment: attachment,
        attachmentType: attachmentType,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setReplyContent('');
      setAttachment(null);
      setAttachmentType(null);
      setShowReply(false);
      fetchPosts();
    } catch (error) {
      console.error('Error replying to the comment:', error);
    }
  };

  const handleAttachment = (e) => {
    const file = e.target.files[0];
    if (file.type.startsWith('image/')) {
      setAttachmentType('image');
    } else if (file.type.startsWith('video/')) {
      setAttachmentType('video');
    } else {
      setAttachmentType(null);
      setAttachment(null);
      return;
    }
    setAttachment(file);
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
          {comment.attachment && (
            attachmentType === 'image' ? (
              <img src={URL.createObjectURL(comment.attachment)} alt="Attachment" className="img-fluid mb-2" />
            ) : (
              <video controls className="mb-2">
                <source src={URL.createObjectURL(comment.attachment)} type={`video/${comment.attachment.type.split('/')[1]}`} />
              </video>
            )
          )}

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
              <div className="d-flex align-items-center mb-2">
                <label htmlFor="attachment" className="btn btn-secondary mr-2">
                  <FontAwesomeIcon icon={faImage} className="mr-1" />
                  Image
                </label>
                <input id="attachment" type="file" accept="image/*,video/*" className="d-none" onChange={handleAttachment} />
                <label htmlFor="video" className="btn btn-secondary">
                  <FontAwesomeIcon icon={faVideo} className="mr-1" />
                  Video
                </label>
                <input id="video" type="file" accept="video/*" className="d-none" onChange={handleAttachment} />
                {attachment && (
                  <span className="ml-2">{attachment.name}</span>
                )}
              </div>
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