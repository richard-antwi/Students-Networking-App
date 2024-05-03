require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');


// const UserModel = require('./models/UserModel'); // Adjusted for a likely correct path
// const UserProfile = require('./models/UserProfile');

const User = require('./models/User');
const Friendship = require('./models/Friendship');

// Initialize the Express app
const app = express();

// Apply Helmet for security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);
// Set up rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Use JSON and CORS with specified options
app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

// Define routes
app.get('/', (req, res) => {
    res.send('Server is running!');
});

  //Register API
  app.post('/register', async (req, res) => {
    console.log('Received data:', req.body);  // Log incoming data
    try {
      const user = await User.create(req.body);
      res.json(user);
  } catch (err) {
      console.error('Error during registration:', err);
      if (err.name === 'ValidationError') {
          return res.status(400).json({ message: 'Validation Error', errors: err.errors });
      }
      res.status(500).json({ message: 'Server error', error: err.message });
  }
});


    //Login API
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (await user.checkPassword(password)) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ message: "Login successful", token });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  });
  
  const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN_HERE

    if (token == null) return res.sendStatus(401); // No token provided

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT:", decoded);
        req.user = decoded; // Add the decoded user ID to request
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.sendStatus(403); // Invalid token
    }
};

//User Profile API (Update) and create new profile if non exist
// app.post('/user/profile/update', authenticateToken, async (req, res) => {
//   const userId = req.user.id;
//   const profileUpdate = req.body;

//   try {
//       const updatedProfile = await User.findOneAndUpdate(
//           { _id: userId },
//           { $set: { "profile": profileUpdate } }, // This path must match the nested structure
//           { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
//       );

//       if (updatedProfile) {
//           return res.json(updatedProfile);
//       } else {
//           return res.status(404).json({ message: "User not found and profile not created" });
//       }
//   } catch (error) {
//       res.status(500).json({ message: "Failed to update or create profile", error: error.message });
//   }
// });
app.post('/user/profile/update', authenticateToken, async (req, res) => {
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

// Configure multer for file storage
// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb) {
    // Naming format for uploaded files: Date-Time_originalname
    cb(null, Date.now() + '_' + file.originalname);
  }
});

// Initialize upload variable
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5000000 }, // 5 MB limit for files
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('profileImage');
// Storage for cover images
const coverStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/covers/'); // Ensure this directory exists or is handled by multer
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname);
  }
});



app.post('/upload', authenticateToken, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file selected!' });
    }
    const filePath = req.file.path;
    try {
      const updatedProfile = await User.findOneAndUpdate(
        { _id: req.user.id },
        { 'profile.profileImagePath': filePath },
        { new: true, upsert: true }
      );
      if (!updatedProfile) {
        return res.status(404).json({ message: "Profile not found and couldn't be created" });
      }
      res.json({
        message: 'File uploaded and profile updated!',
        filePath: filePath,
        data: updatedProfile
      });
    } catch ( error) {
      res.status(500).json({ message: 'Database update failed', error });
    }
  });
});

const storageCover = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'uploads/covers/'); // Make sure this directory exists
  },
  filename: function(req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadCover = multer({ 
  storage: storageCover,
  fileFilter: function (req, file, cb) {
      if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
          cb(null, true);
      } else {
          cb(null, false); // reject file
          return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
  }
}).single('coverImage');



// Endpoint for uploading cover images
app.post('/upload/cover', authenticateToken, uploadCover, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const userId = req.user.id;
  const filePath = req.file.path;  // Assuming this holds the new cover image path from your multer middleware
  try {
      const updatedUser = await User.findByIdAndUpdate(userId, {
          $set: {
              "profile.coverImagePath": filePath  // Correct field path
          }
      }, { new: true, runValidators: true });

      if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json({
          message: 'Cover image updated successfully!',
          data: updatedUser
      });
  } catch (error) {
      console.error('Failed to update cover image:', error);
      res.status(500).json({ message: 'Failed to update cover image', error: error.message });
  }
});


app.get('/user/profile', authenticateToken, async (req, res) => {
  try {
    const userProfile = await User.findOne({ _id: req.user.id });
    console.log(userProfile);
    if (!userProfile) {
      return res.status(404).send('Profile not found.');
    }
    res.json(userProfile);
  } catch (error) {
    res.status(500).send('Server error');
  }
});


// Function to get friend suggestions based on user and profile data
async function getSuggestions(userId) {
  const currentUser = await User.findById(userId);
  if (!currentUser) {
      return [];
  }
  let query = {
      _id: { $ne: userId }, // Exclude current user
      'profile.createdAt': { $gte: new Date(new Date().getTime() - (15 * 24 * 60 * 60 * 1000))},
  };
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
      const randomUsers = await User.aggregate([
          { $match: { _id: { $ne: userId } } },
          { $sample: { size: 5 } }
      ]);
      return randomUsers.map(user => ({ user, score: 'random' }));
  }
}

// Endpoint to get friend suggestions
app.get('/api/suggestions', authenticateToken, async (req, res) => {
  try {
      const userId = req.user.id;
      const suggestions = await getSuggestions(userId);
      res.json({ suggestions });
  } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      res.status(500).json({ message: 'Failed to fetch suggestions', error: error.toString() });
  }
});

//Endpoint to add freinds.
// POST /api/friendships
app.post('/api/friendships', authenticateToken, async (req, res) => {
  const { recipientId } = req.body;
  const requesterId = req.user.id; // Extracted from token

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

app.get('/api/friend-requests', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    // Fetch friend requests and populate requester details
    const friendRequests = await Friendship.find({
      recipient: userId,
      status: 'pending'
    })
    .populate('requester', 'firstName lastName headline profile.profileImagePath') // Adjust the fields as per your User model
    .exec();

    const requestsWithUserDetails = friendRequests.map(fr => ({
      id: fr._id,
      requester: fr.requester.firstName + " " + fr.requester.lastName, // Combining first and last name
      status: fr.status,
      profileImagePath: fr.requester.profileImagePath
    }));

    res.json(requestsWithUserDetails);
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    res.status(500).json({ message: 'Failed to fetch friend requests', error: error.message });
  }
});

// Fetch list of friends
app.get('/api/friends', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    // Find friendships where the current user is involved and the status is 'accepted'
    const friendships = await Friendship.find({
      $and: [
        { status: 'accepted' },
        { $or: [{ requester: userId }, { recipient: userId }] }
      ]
    }).populate('requester recipient', 'firstName lastName profileImagePath headline'); // Adjust fields as needed

    // Map through the friendships to return friend details not including the current user
    const friends = friendships.map(f => {
      return f.requester._id.toString() === userId ? f.recipient : f.requester;
    });

    res.json(friends);
  } catch (error) {
    console.error('Failed to retrieve friends:', error);
    res.status(500).json({ message: "Failed to retrieve friends", error: error.toString() });
  }
});

// PATCH /api/friendships/:id/accept
// Requires authentication
app.patch('/api/friendships/:id/accept', authenticateToken, async (req, res) => {
  try {
    const friendshipId = req.params.id;
    const updatedFriendship = await Friendship.findOneAndUpdate({
      _id: friendshipId,
      recipient: req.user.id,
      status: 'pending'
    }, {
      status: 'accepted'
    }, { new: true });

    if (!updatedFriendship) {
      return res.status(404).json({ message: "Friend request not found or not authorized to accept." });
    }

    res.json(updatedFriendship);
  } catch (error) {
    console.error('Error accepting friendship:', error);
    res.status(500).json({ message: "Error accepting friendship.", error: error.message });
  }
});

// PATCH /api/friendships/:id/decline
// Requires authentication
app.patch('/api/friendships/:id/decline', authenticateToken, async (req, res) => {
  try {
    const friendshipId = req.params.id;
    const updatedFriendship = await Friendship.findOneAndUpdate({
      _id: friendshipId,
      recipient: req.user.id,
      status: 'pending'
    }, {
      status: 'declined'
    }, { new: true });

    if (!updatedFriendship) {
      return res.status(404).json({ message: "Friend request not found or not authorized to decline." });
    }

    res.json(updatedFriendship);
  } catch (error) {
    console.error('Error declining friendship:', error);
    res.status(500).json({ message: "Error declining friendship.", error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);  // Log error information for debugging
  if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: err.errors });
  } else if (err.code === 11000) { // Handling duplicate key errors for MongoDB
      return res.status(409).json({ message: 'Duplicate key error: some provided data is already in use.' });
  } else if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token.' });
  } else if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token has expired.' });
  } else {
      return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});


// Start the server
app.listen(process.env.PORT || 3001, () => {
    console.log(`Server is running on port ${process.env.PORT || 3001}`);
});
