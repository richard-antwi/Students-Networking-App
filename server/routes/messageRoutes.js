const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const authenticateToken = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Storage setup for message images
const messageImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './uploads/message_images/');
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadMessageImage = multer({
  storage: messageImageStorage,
  limits: { fileSize: 10000000 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
}).single('image'); 

// Get messages between two users
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id; 
  const { chatWith } = req.query; 
  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: chatWith },
        { receiver: userId, sender: chatWith }
      ]
    }).sort({ timestamp: 1 })
      .populate('sender', 'firstName lastName profileImagePath')
      .populate('receiver', 'firstName lastName profileImagePath');

    res.json(messages);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages', error: error.toString() });
  }
});

// Get messages for a user
router.get('/user/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;
  const loggedInUserId = req.user.id;
  try {
    const messages = await Message.find({
      $or: [
        { sender: loggedInUserId, receiver: userId },
        { receiver: loggedInUserId, sender: userId }
      ]
    }).sort({ timestamp: 1 })
      .populate('sender', 'firstName lastName profileImagePath')
      .populate('receiver', 'firstName lastName profileImagePath');
    res.json(messages);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages', error: error.toString() });
  }
});

// Upload message image
router.post('/upload/message-image', authenticateToken, (req, res) => {
  uploadMessageImage(req, res, function(err) {
    if (err) {
      return res.status(500).json({ message: "Multer error: " + err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded!' });
    }
    const imageUrl = `/uploads/message_images/${req.file.filename}`;
    res.json({ imageUrl });  // Just return URL
  });
});

// Send message
router.post('/', authenticateToken, async (req, res) => {
  const { content, receiver, imageUrl, isImage = false } = req.body;
  const sender = req.user.id;
  if (!content && !imageUrl) {
    return res.status(400).json({ message: 'Message content cannot be empty' });
  }
  const newMessage = new Message({ sender, receiver, content, imageUrl, isImage });
  try {
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Failed to send message', error: error.toString() });
  }
});

module.exports = router;
