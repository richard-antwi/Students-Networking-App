require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');
const Friendship = require('./models/Friendship');
const Message = require('./models/Message'); 
const Grid = require('gridfs-stream');
const { GridFsStorage } = require('multer-gridfs-storage');

// Initialize the Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
// Apply Helmet for security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle incoming messages from clients
  socket.on('message', (data) => {
      console.log('Received message:', data);
      // Broadcast the message to all connected clients
      io.emit('message', data);
  });

  // Handle disconnect events
  socket.on('disconnect', () => {
      console.log('User disconnected');
  });
});
// Set up rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Use JSON and CORS with specified options
app.use(express.json({ limit: '2600mb' }));
app.use(express.urlencoded({ limit: '2600mb', extended: true }));
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions)); // Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));
const conn = mongoose.connection;
let gfs;

conn.once('open', () => {
  // Initialize GridFS
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});
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

// Define a function to check file types
const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png/; // Allowed filetypes
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Check the extension
  const mimetype = filetypes.test(file.mimetype);// Check the mimetype
  if (extname && mimetype) {
      return cb(null, true); // If file type is allowed, accept it
  } else {
      // Otherwise, reject it
      cb('Error: Images only!');
  }
};

const gridFsStorageGeneral = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    return {
      filename: `file_${Date.now()}_${file.originalname}`,
      bucketName: 'message_files' // Storing in 'message_files' collection
    };
  }
});

const uploadGeneralFiles = multer({ storage: gridFsStorageGeneral }).single('file');



// Initialize upload variable
const upload = multer({ 
  storage: gridFsStorageGeneral, 
  limits: { fileSize: 1024 * 1024 * 2500 }, // 2.5GB limit for files
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

app.post('/upload', authenticateToken, uploadGeneralFiles, (req, res) => {
  if (req.file) {
    res.json({ message: "File uploaded successfully", file: req.file });
  } else {
    res.status(400).send('No file uploaded');
  }
});

app.post('/upload/general', authenticateToken, (req, res) => {
  uploadGeneralFiles(req, res, function (err) {
      if (err) {
          return res.status(500).json({ message: "Upload Error: " + err.message });
      }
      if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded!' });
      }

      // Assuming you are saving the file information in the Message document
      const fileData = {
          fileId: req.file.id, // This depends on whether you're using GridFS
          filename: req.file.filename,
          contentType: req.file.mimetype,
          url: `/uploads/message_files/${req.file.filename}` // Adjust based on your actual URL structure
      };

      // Save this fileData to your Message schema when creating a new message
      res.json({ file: req.file });
  });
});



// POST endpoint to handle chunk uploads and reassembly
app.post('/chunk-upload', authenticateToken, (req, res) => {
  const { chunk, totalChunks, identifier } = req.body;
  const targetDir = path.join(__dirname, 'uploads', identifier);
  const targetPath = path.join(targetDir, `${req.body.chunkNumber}`);

  if (!fs.existsSync(targetDir)){
      fs.mkdirSync(targetDir);
  }

  // Move the chunk to the target path
  chunk.mv(targetPath, err => {
      if (err) {
          return res.status(500).send({ message: "Failed to save chunk" });
      }

      // Check if all chunks are uploaded
      const chunks = fs.readdirSync(targetDir);
      if (chunks.length === totalChunks) {
          // Reassemble chunks
          const filePath = path.join(targetDir, identifier);
          const fileStream = fs.createWriteStream(filePath);

          chunks.sort().forEach(chunk => {
              const chunkPath = path.join(targetDir, chunk);
              fileStream.write(fs.readFileSync(chunkPath));
              fs.unlinkSync(chunkPath); // delete chunk after appending it
          });

          fileStream.end();
          res.send({ message: "File reassembled successfully", filePath });
      } else {
          res.send({ message: "Chunk uploaded successfully" });
      }
  });
});

app.get('/file/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ err: 'No file found' });
    }
    // Check if the file is compressed and set the appropriate headers
    if (file.metadata && file.metadata.compressed) {
      res.set('Content-Encoding', 'gzip');
    }
    const readstream = gfs.createReadStream(file.filename);
    readstream.on('error', function(err) {
      res.status(500).json({ err: err.message });
    });
    readstream.pipe(res);
  });
});

app.delete('/file/:filename', (req, res) => {
  gfs.remove({ filename: req.params.filename, root: 'uploads' }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }

    res.redirect('/');
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

const messageImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './uploads/message_images/'); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
      // Ensure filenames are unique to avoid overwriting existing files
      cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadMessageImage = multer({
  storage: messageImageStorage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
  }
}).single('image'); // Ensure 'image' matches the field name used in the client-side FormData


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
    // console.log(userProfile);
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
  // Find all users who are already friends or have pending requests
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

  // Include the current user's ID in the exclusion list
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
    // Include excluded users in the $match for $sample aggregation
     // Use the correctly converted ObjectIds for the random user selection
     const excludedObjectIds = excludedUserIds.map(id => new mongoose.Types.ObjectId(id));

     const randomUsers = await User.aggregate([
       { $match: { _id: { $nin: excludedObjectIds } } },
       { $sample: { size: 7 } }
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

  // Validate recipientId
  if (!recipientId) {
    return res.status(400).json({ message: "Recipient ID is required." });
  }

  // Ensure requesterId and recipientId are not the same
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
    const friendRequests = await Friendship.find({recipient: userId, status: 'pending'})
    .populate('requester', 'firstName lastName profile.headline profile.profileImagePath')
    .exec();

    const requestsWithUserDetails = friendRequests.map(fr => ({
      id: fr._id,
      requester: fr.requester.firstName + " " + fr.requester.lastName, // Combining first and last name
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
app.get('/api/friends', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    // Find friendships where the current user is involved and the status is 'accepted'
    const friendships = await Friendship.find({
      $and: [
        { status: 'accepted' },
        { $or: [{ requester: userId }, { recipient: userId }] }
      ]
    }).populate('requester recipient', 'firstName lastName profile.profileImagePath profile.headline'); // Adjust fields as needed

    // Map through the friendships to return friend details not including the current user
    const friends = friendships.map(f => {
      const friend = f.requester._id.toString() === userId ? f.recipient : f.requester;
      // Access the profile image path from the populated profile field
      const profileImagePath = friend.profile.profileImagePath;
      // Attach the profile image path to the friend object
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
    friendship.status = 'accepted';  // Update status to accepted
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
    friendship.status = 'declined';  // Update status to declined
    await friendship.save();
    return friendship;
  } catch (error) {
    throw new Error(`Failed to decline friend request: ${error.message}`);
  }
};
// POST endpoint to accept a friend request
app.post('/api/friendships/:id/accept', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const friendship = await acceptFriendRequest(id);
    res.json({ message: "Friend request accepted", friendship });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST endpoint to decline a friend request
app.post('/api/friendships/:id/decline', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const friendship = await declineFriendRequest(id);
    res.json({ message: "Friend request declined", friendship });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get messages between two users

app.get('/api/messages', authenticateToken, async (req, res) => {
  const userId = req.user.id; // Extracted from the authenticated user
  const { chatWith } = req.query; // ID of the other user in the chat

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
app.get('/api/messages/user/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;  // Correctly extracting userId from params
  const loggedInUserId = req.user.id;  // ID of the logged-in user
  try {
    const messages = await Message.find({
      $or: [
        { sender: loggedInUserId, receiver: userId },
        { receiver: loggedInUserId, sender: userId }
      ]
    }).sort({ timestamp: 1 })
      .populate('sender', 'firstName lastName profileImagePath')
      .populate('receiver', 'firstName lastName profileImagePath');

      // .sort({ timestamp: -1 });  // Sort by newest first

      res.json(messages);
  } catch (error) {
      console.error('Failed to fetch messages:', error);
      res.status(500).json({ message: 'Failed to fetch messages', error: error.toString() });
  }
});

app.post('/upload/message-image', authenticateToken, (req, res) => {
  uploadMessageImage(req, res, function (err) {
      if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          console.error("Multer error during file upload:", err);
          return res.status(500).json({ message: "Multer error: " + err.message });
      } else if (err) {
          // An unknown error occurred when uploading.
          console.error("Unknown error during file upload:", err);
          return res.status(500).json({ message: "Upload Error: " + err.message });
      }

      if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded!' });
      }

      // File is uploaded, now you can do something with it
      const imageUrl = `/uploads/message_images/${req.func.file.filename}`;
      res.json({ imageUrl, message: 'File uploaded successfully' });  // Return the URL of the uploaded file
  });
});


app.post('/api/messages', authenticateToken, async (req, res) => {
  const { content, receiver, imageUrl, isImage = false } = req.body;
  const sender = req.user.id;

  if (!content && !imageUrl) {
    return res.status(400).json({ message: 'Message content cannot be empty' });
  }

  const newMessage = new Message({
    sender,
    receiver,
    content,
    imageUrl,
    isImage
  });

  try {
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Failed to send message', error: error.toString() });
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
