const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');

// Check if the current user is following another user
router.get('/:userId/isFollowing', authenticateToken, async (req, res) => {
  const currentUserId = req.user.id;
  const { userId } = req.params;

  try {
    const user = await User.findById(currentUserId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFollowing = user.following.includes(userId);
    res.status(200).json({ isFollowing });
  } catch (error) {
    console.error('Failed to check follow status:', error);
    res.status(500).json({ message: 'Failed to check follow status', error: error.message });
  }
});


// Follow a user
router.post('/follow', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { followId } = req.body;

  console.log('Follow request received');
  console.log('User ID:', userId);
  console.log('Follow ID:', followId);

  if (!followId) {
    console.log('Follow ID is missing');
    return res.status(400).json({ message: 'Follow ID is required' });
  }

  try {
    const user = await User.findById(userId);
    const followUser = await User.findById(followId);

    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }
    if (!followUser) {
      console.log('Follow User not found:', followId);
      return res.status(404).json({ message: 'Follow user not found' });
    }

    if (!user.following.includes(followId)) {
      await User.updateOne({ _id: userId }, { $push: { following: followId } });
      await User.updateOne({ _id: followId }, { $push: { followers: userId } });

      res.status(200).json({ message: 'User followed successfully' });
    } else {
      console.log('User is already followed');
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

  console.log('Unfollow request received');
  console.log('User ID:', userId);
  console.log('Unfollow ID:', unfollowId);

  if (!unfollowId) {
    console.log('Unfollow ID is missing');
    return res.status(400).json({ message: 'Unfollow ID is required' });
  }

  try {
    const user = await User.findById(userId);
    const unfollowUser = await User.findById(unfollowId);

    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }
    if (!unfollowUser) {
      console.log('Unfollow User not found:', unfollowId);
      return res.status(404).json({ message: 'Unfollow user not found' });
    }

    await User.updateOne({ _id: userId }, { $pull: { following: unfollowId } });
    await User.updateOne({ _id: unfollowId }, { $pull: { followers: userId } });

    res.status(200).json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error('Failed to unfollow user:', error);
    res.status(500).json({ message: 'Failed to unfollow user', error: error.message });
  }
});

// Update user profile
router.post('/profile/update', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const profileUpdates = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { profile: profileUpdates } },
      { new: true, runValidators: true }
    );
    res.json(updatedUser);
  } catch (error) {
    console.error('Failed to update user profile:', error);
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
});

// Get user profiles to display on desktop
// routes/userRoutes.js
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userProfile = await User.findOne({ _id: req.user.id }).lean();
    if (!userProfile) {
      return res.status(404).send('Profile not found.');
    }
    const followersCount = userProfile.followers.length;
    const followingCount = userProfile.following.length;

    res.json({ 
      ...userProfile,
      followersCount,
      followingCount 
    });
  } catch (error) {
    res.status(500).send('Server error');
  }
});


// Get all users for the top profiles
// routes/userRoutes.js
router.get('/top-profiles', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;  // Get the current user's ID from the token
    const users = await User.find({ _id: { $ne: userId } }).select('firstName lastName profile.profileImagePath profile.headline');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});


module.exports = router;



// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const authenticateToken = require('../middleware/auth'); 

// // Follow a user
// router.post('/follow', authenticateToken, async (req, res) => {
//   const userId = req.user.id;
//   const { followId } = req.body;

//   try {
//     if (!followId) {
//       return res.status(400).json({ message: 'Follow ID is required' });
//     }

//     const user = await User.findById(userId);
//     const followUser = await User.findById(followId);

//     if (!user || !followUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (!user.following.includes(followId)) {
//       user.following.push(followId);
//       followUser.followers.push(userId);

//       await user.save();
//       await followUser.save();
//       res.status(200).json({ message: 'User followed successfully' });
//     } else {
//       res.status(400).json({ message: 'User is already followed' });
//     }
//   } catch (error) {
//     console.error('Failed to follow user:', error);
//     res.status(500).json({ message: 'Failed to follow user', error: error.message });
//   }
// });

// // Unfollow a user
// router.post('/unfollow', authenticateToken, async (req, res) => {
//   const userId = req.user.id;
//   const { unfollowId } = req.body;

//   try {
//     if (!unfollowId) {
//       return res.status(400).json({ message: 'Unfollow ID is required' });
//     }

//     const user = await User.findById(userId);
//     const unfollowUser = await User.findById(unfollowId);

//     if (!user || !unfollowUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     user.following = user.following.filter(followingId => followingId.toString() !== unfollowId);
//     unfollowUser.followers = unfollowUser.followers.filter(followerId => followerId.toString() !== userId);

//     await user.save();
//     await unfollowUser.save();
//     res.status(200).json({ message: 'User unfollowed successfully' });
//   } catch (error) {
//     console.error('Failed to unfollow user:', error);
//     res.status(500).json({ message: 'Failed to unfollow user', error: error.message });
//   }
// });

// // Get all users for the top profiles
// router.get('/top-profiles', authenticateToken, async (req, res) => {
//   try {
//     const users = await User.find().select('firstName lastName profile.profileImagePath profile.headline');
//     res.json(users);
//   } catch (error) {
//     console.error('Failed to fetch users:', error);
//     res.status(500).json({ message: 'Failed to fetch users', error: error.message });
//   }
// });

// module.exports = router;
