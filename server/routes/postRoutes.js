const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
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
        populate: { path: 'user', select: 'firstName lastName profileImagePath' }
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
    videoPath: req.files.video ? `/uploads/post/${req.files.video[0].filename}` : null
  });
  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create post', error: err.message });
  }
});
  

  // Like a post
router.put('/like/:postId', authenticateToken, async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }
    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      await post.save();
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Unlike a post
router.put('/unlike/:postId', authenticateToken, async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }
    post.likes = post.likes.filter(id => id.toString() !== userId);
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});



module.exports = router;
