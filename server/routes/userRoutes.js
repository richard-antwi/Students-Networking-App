const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticateToken = require('../middleware/auth'); 

// Follow a user
router.post('/follow', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { followId } = req.body;

  try {
    if (!followId) {
      return res.status(400).json({ message: 'Follow ID is required' });
    }

    const user = await User.findById(userId);
    const followUser = await User.findById(followId);

    if (!user || !followUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.following.includes(followId)) {
      user.following.push(followId);
      followUser.followers.push(userId);

      await user.save();
      await followUser.save();
      res.status(200).json({ message: 'User followed successfully' });
    } else {
      res.status(400).json({ message: 'User is already followed' });
    }
  } catch (error) {
    console.error('Failed to follow user:', error);
    res.status(500).json({ message: 'Failed to follow user', error: error.message });
  }
});

// Unfollow a user
router.post('/unfollow', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { unfollowId } = req.body;

  try {
    if (!unfollowId) {
      return res.status(400).json({ message: 'Unfollow ID is required' });
    }

    const user = await User.findById(userId);
    const unfollowUser = await User.findById(unfollowId);

    if (!user || !unfollowUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.following = user.following.filter(followingId => followingId.toString() !== unfollowId);
    unfollowUser.followers = unfollowUser.followers.filter(followerId => followerId.toString() !== userId);

    await user.save();
    await unfollowUser.save();
    res.status(200).json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error('Failed to unfollow user:', error);
    res.status(500).json({ message: 'Failed to unfollow user', error: error.message });
  }
});

// Get all users for the top profiles
router.get('/top-profiles', authenticateToken, async (req, res) => {
  try {
    const users = await User.find().select('firstName lastName profile.profileImagePath profile.headline');
    res.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

module.exports = router;
