const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Friendship = require('../models/Friendship');
const authenticateToken = require('../middleware/auth');

// Function to get friend suggestions based on user and profile data
async function getSuggestions(userId) {
  const currentUser = await User.findById(userId);
  if (!currentUser) {
    return [];
  }
  const existingFriendships = await Friendship.find({
    $or: [
      { requester: userId },
      { recipient: userId }
    ],
    status: { $in: ['accepted', 'pending'] }
  });
  const excludedUserIds = existingFriendships.map(f => 
    (f.requester.toString() === userId ? f.recipient : f.requester).toString()
  );
  excludedUserIds.push(userId.toString());
  let query = {
    _id: { $nin: excludedUserIds },
    'profile.createdAt': { $gte: new Date(new Date().getTime() - (15 * 24 * 60 * 60 * 1000))},
  };
  console.log("Excluded User IDs:", excludedUserIds);
  console.log("Query being used:", query);
  const users = await User.find(query).lean();
  const refinedMatches = users.map(user => {
    let score = 0;
    if (user.profile && currentUser.profile) {
      if (user.profile.city === currentUser.profile.city) {
        score += 1;
      }
      if (user.profile.industry === currentUser.profile.industry) {
        score += 1;
      }
      if (user.profile.headline === currentUser.profile.headline) {
        score += 1;
      }
      if (user.profile.education && currentUser.profile.education &&
        user.profile.education.fieldOfStudy === currentUser.profile.education.fieldOfStudy) {
        score += 1;
      }
    }
    return { user, score };
  });

  const filteredMatches = refinedMatches.filter(match => match.score > 0);
  filteredMatches.sort((a, b) => b.score - a.score);

  if (filteredMatches.length > 0) {
    return filteredMatches;
  } else {
    const excludedObjectIds = excludedUserIds.map(id => new mongoose.Types.ObjectId(id));
    const randomUsers = await User.aggregate([
      { $match: { _id: { $nin: excludedObjectIds } } },
      { $sample: { size: 7 } }
    ]);
    return randomUsers.map(user => ({ user, score: 'random' }));
  }
}

// Endpoint to get friend suggestions
router.get('/suggestions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const suggestions = await getSuggestions(userId);
    res.json({ suggestions });
  } catch (error) {
    console.error('Failed to fetch suggestions:', error);
    res.status(500).json({ message: 'Failed to fetch suggestions', error: error.toString() });
  }
});

// Endpoint to add friends
router.post('/', authenticateToken, async (req, res) => {
  const { recipientId } = req.body;
  const requesterId = req.user.id; 
  if (!recipientId) {
    return res.status(400).json({ message: "Recipient ID is required." });
  }
  if (recipientId === requesterId) {
    return res.status(400).json({ message: "Cannot add yourself as a friend." });
  }
  try {
    const existingFriendship = await Friendship.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId }
      ]
    });
    if (existingFriendship) {
      return res.status(409).json({ message: "Friendship already exists or request pending." });
    }
    const newFriendship = new Friendship({
      requester: requesterId,
      recipient: recipientId
    });
    await newFriendship.save();
    res.status(201).json({ message: "Friend request sent.", friendship: newFriendship });
  } catch (error) {
    res.status(500).json({ message: "Failed to send friend request.", error: error.toString() });
  }
});

// Endpoint to get friend requests
router.get('/requests', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const friendRequests = await Friendship.find({recipient: userId, status: 'pending'})
    .populate('requester', 'firstName lastName profile.headline profile.profileImagePath')
    .exec();
    const requestsWithUserDetails = friendRequests.map(fr => ({
      id: fr._id,
      requester: fr.requester.firstName + " " + fr.requester.lastName, 
      status: fr.status,
      profileImagePath: fr.requester.profile.profileImagePath
    }));
    res.json(requestsWithUserDetails);
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    res.status(500).json({ message: 'Failed to fetch friend requests', error: error.message });
  }
});

// Fetch list of friends
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const friendships = await Friendship.find({
      $and: [
        { status: 'accepted' },
        { $or: [{ requester: userId }, { recipient: userId }] }
      ]
    }).populate('requester recipient', 'firstName lastName profile.profileImagePath profile.headline'); // Adjust fields as needed
    const friends = friendships.map(f => {
      const friend = f.requester._id.toString() === userId ? f.recipient : f.requester;
      const profileImagePath = friend.profile.profileImagePath;
      friend.profileImagePath = profileImagePath;
      return friend;
    });
    res.json(friends);
  } catch (error) {
    console.error('Failed to retrieve friends:', error);
    res.status(500).json({ message: "Failed to retrieve friends", error: error.toString() });
  }
});

// Function to accept a friend request
const acceptFriendRequest = async (friendshipId) => {
  try {
    const friendship = await Friendship.findById(friendshipId);
    if (!friendship) {
      throw new Error('Friendship not found');
    }
    friendship.status = 'accepted';
    await friendship.save();
    return friendship;
  } catch (error) {
    throw new Error(`Failed to accept friend request: ${error.message}`);
  }
};

// Function to decline a friend request
const declineFriendRequest = async (friendshipId) => {
  try {
    const friendship = await Friendship.findById(friendshipId);
    if (!friendship) {
      throw new Error('Friendship not found');
    }
    friendship.status = 'declined';
    await friendship.save();
    return friendship;
  } catch (error) {
    throw new Error(`Failed to decline friend request: ${error.message}`);
  }
};
// POST endpoint to accept a friend request
router.post('/:id/accept', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const friendship = await acceptFriendRequest(id);
    res.json({ message: "Friend request accepted", friendship });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST endpoint to decline a friend request
router.post('/:id/decline', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const friendship = await declineFriendRequest(id);
    res.json({ message: "Friend request declined", friendship });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
