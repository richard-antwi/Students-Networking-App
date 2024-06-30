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

  // Like a post
router.put('/like/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      post.likes.push(req.body.userId);
      await post.save();
      res.status(200).json({ message: 'Post liked!' });
    } else {
      res.status(400).json({ message: 'You already liked this post.' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Unlike a post
router.put('/unlike/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.likes.includes(req.body.userId)) {
      post.likes = post.likes.filter((userId) => userId.toString() !== req.body.userId);
      await post.save();
      res.status(200).json({ message: 'Post unliked!' });
    } else {
      res.status(400).json({ message: 'You have not liked this post.' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create post', error: err.message });
  }
});

module.exports = router;
