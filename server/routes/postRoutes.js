const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const authenticateToken = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// File upload settings
const postStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'post');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const postUpload = multer({ storage: postStorage });

// Route to get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ postedAt: -1 })
      .populate('user', 'firstName lastName profileImagePath headline')
      .populate({
        path: 'comments',
        populate: [
          { 
            path: 'user', 
            select: 'firstName lastName profileImagePath'
          },
          {
            path: 'replies', // Ensure your Comment schema has a 'replies' field which references Comment ids
            model: 'Comment', // Only necessary if it's not automatically inferred
            populate: {
              path: 'user', 
              select: 'firstName lastName profileImagePath'
            }
          }
        ]
      });
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// Route to create a post
router.post('/', authenticateToken, postUpload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  const { text, tags } = req.body;
  const user = req.user.id;

  const newPost = new Post({
    user,
    content: text,
    tags,
    imagePath: req.files.image ? `/uploads/post/${req.files.image[0].filename}` : null,
    videoPath: req.files.video ? `/uploads/post/${req.files.video[0].filename}` : null,
    likes: [],
    comments: []
  });
  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create post', error: err.message });
  }
});

// Like a post
router.post('/like/:postId', authenticateToken, async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }

    if (!post.likes) {
      post.likes = [];
    }

    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      await post.save();
    }
    res.json(post);
  } catch (error) {
    console.error('Error liking the post:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Unlike a post
router.post('/unlike/:postId', authenticateToken, async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }

    if (!post.likes) {
      post.likes = [];
    }

    post.likes = post.likes.filter(id => id.toString() !== userId);
    await post.save();
    res.json(post);
  } catch (error) {
    console.error('Error unliking the post:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Route to add a comment to a post
router.post('/comments/:postId', authenticateToken, async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;
  const userId = req.user.id;

  try {
    const newComment = new Comment({ user: userId, post: postId, text });
    await newComment.save();
    await Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Route to add a reply to a comment
router.post('/comments/reply/:postId', authenticateToken, async (req, res) => {
  const { postId, commentId } = req.params;
  const { text } = req.body;
  const userId = req.user.id;

  try {
    const newReply = new Comment({ user: userId, post: postId, text });
    await newReply.save();
    await Comment.findByIdAndUpdate(commentId, { $push: { replies: newReply._id } });
    res.status(201).json(newReply);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Route to like a comment
router.post('/comments/like/:commentId', authenticateToken, async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment.likes.includes(userId)) {
      comment.likes.push(userId);
      await comment.save();
    }
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Route to unlike a comment
router.post('/comment/unlike/:commentId', authenticateToken, async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  try {
    const comment = await Comment.findById(commentId);
    comment.likes = comment.likes.filter(id => id.toString() !== userId);
    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});


module.exports = router;
