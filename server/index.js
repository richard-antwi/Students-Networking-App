const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const userRoutes = require('./routes/userRoutes');
const friendRoutes = require('./routes/friendRoutes');
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" }}));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '2600mb' }));
app.use(express.urlencoded({ limit: '2600mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/messages', messageRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// WebSocket Communication
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('message', (data) => {
    console.log('Received message:', data);
    io.emit('message', data);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
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

// Start the server on port 3001
server.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
});



// require('dotenv').config();
// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const jwt = require('jsonwebtoken');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');


// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// const userRoutes = require('./routes/userRoutes'); // Import your routes

// const User = require('./models/User');
// const Friendship = require('./models/Friendship');
// const Message = require('./models/Message'); 
// const Post = require('./models/Post');
// const Comment = require('./models/Comment'); 


// // Security and Performance Middleware
// app.use(helmet({crossOriginResourcePolicy: { policy: "cross-origin" }}));
// app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true,
//   optionsSuccessStatus: 200
// }));
// app.use(express.json({ limit: '2600mb' }));
// app.use(express.urlencoded({ limit: '2600mb', extended: true }));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/api/user', userRoutes);

// // Connect to MongoDB Database and GridFS Setup
// mongoose.connect(process.env.MONGODB_URI);


// // WebSocket Communication
// io.on('connection', (socket) => {
//   console.log('A user connected');
//   socket.on('message', (data) => {
//       console.log('Received message:', data);
//       io.emit('message', data);
//   });
//   socket.on('disconnect', () => {
//       console.log('User disconnected');
//   });
// });

// // Authentication and Authorization Middleware
// const authenticateToken = async (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   if (token == null) return res.sendStatus(401);
//   try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       console.log("Decoded JWT:", decoded);
//       req.user = decoded;
//       next(); 
//   } catch (err) {
//       return res.sendStatus(403);
//   }
// };


// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     const uploadPath = path.join(__dirname, 'uploads');
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, uploadPath);
//   },
//   filename: function(req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const fileFilter = (req, file, cb) => {
//   const filetypes = /\.(jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|apk)$/i;
//   const mimetypes = /image\/(jpeg|png|gif)|application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|application\/vnd\.ms-excel|application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|application\/vnd\.ms-powerpoint|application\/vnd\.openxmlformats-officedocument\.presentationml\.presentation|application\/x-rar-compressed|application\/zip|application\/vnd\.android\.package-archive/i;
//   const isFileTypeValid = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const isMimeTypeValid = mimetypes.test(file.mimetype);
//   if (isFileTypeValid && isMimeTypeValid) {
//     cb(null, true);
//   } else {
//     cb(new Error('Unsupported file type!'), false);
//   }
// };

// const upload = multer({ storage: storage, fileFilter: fileFilter });






// const uploadGeneralFiles = multer({
//   storage: storage,
//   limits: { fileSize: 1024 * 1024 * 2500 },
//   fileFilter: (req, file, cb) => checkFileType(file, cb)
// }).single('file');



// // Define Home routes
// app.get('/', (req, res) => {res.send('Server is running!');});

// // Use user routes
// app.use('/api/user', userRoutes);

//   //Register API
//     app.post('/register', async (req, res) => {
//       console.log('Received data:', req.body);  
//       try {
//         const user = await User.create(req.body);
//         res.json(user);
//     } catch (err) {
//         console.error('Error during registration:', err);
//         if (err.name === 'ValidationError') {
//             return res.status(400).json({ message: 'Validation Error', errors: err.errors });
//         }
//         res.status(500).json({ message: 'Server error', error: err.message });
//     }
//   });
//     //Login API
//     app.post('/login', async (req, res) => {
//       const { email, password } = req.body;
//       try {
//           const user = await User.findOne({ email });
//           if (!user) {
//               return res.status(401).json({ error: "Invalid credentials" });
//           }
//           if (await user.checkPassword(password)) {
//               const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//               return res.json({
//                   message: "Login successful",
//                   token,
//                   userId: user._id 
//               });
//           } else {
//               return res.status(401).json({ error: "Invalid credentials" });
//           }
//       } catch (err) {
//           console.error('Error during login:', err);
//           res.status(500).json({ error: 'Server error', message: err.message });
//       }
//   });
  
  

// //user profile
// app.post('/user/profile/update', authenticateToken, async (req, res) => {
//   const userId = req.user.id;
//   const profileUpdates = req.body;
//   try {
//       const updatedUser = await User.findByIdAndUpdate(
//           userId,
//           { $set: { profile: profileUpdates } },
//           { new: true, runValidators: true }
//       );
//       res.json(updatedUser);
//   } catch (error) {
//       console.error('Failed to update user profile:', error);
//       res.status(500).json({ message: "Failed to update profile", error: error.message });
//   }
// });
// app.get('/user/profile', authenticateToken, async (req, res) => {
//   try {
//     const userProfile = await User.findOne({ _id: req.user.id });
//     console.log(userProfile);
//     if (!userProfile) {
//       return res.status(404).send('Profile not found.');
//     }
//     res.json(userProfile);
//   } catch (error) {
//     res.status(500).send('Server error');
//   }
// });


// // Function to get friend suggestions based on user and profile data
// async function getSuggestions(userId) {
//   const currentUser = await User.findById(userId);
//   if (!currentUser) {
//       return [];
//   }
//   const existingFriendships = await Friendship.find({
//     $or: [
//       { requester: userId },
//       { recipient: userId }
//     ],
//     status: { $in: ['accepted', 'pending'] }
//   });
//   const excludedUserIds = existingFriendships.map(f => 
//     (f.requester.toString() === userId ? f.recipient : f.requester).toString()
//   );
//   excludedUserIds.push(userId.toString());
//   let query = {
//     _id: { $nin: excludedUserIds },
//     'profile.createdAt': { $gte: new Date(new Date().getTime() - (15 * 24 * 60 * 60 * 1000))},
//   };
//   console.log("Excluded User IDs:", excludedUserIds);
//   console.log("Query being used:", query);
//   const users = await User.find(query).lean();
//   const refinedMatches = users.map(user => {
//     let score = 0;
//     if (user.profile && currentUser.profile) {
//         if (user.profile.city === currentUser.profile.city) {
//             score += 1;
//         }
//         if (user.profile.industry === currentUser.profile.industry) {
//             score += 1;
//         }
//         if (user.profile.headline === currentUser.profile.headline) {
//             score += 1;
//         }
//         if (user.profile.education && currentUser.profile.education &&
//             user.profile.education.fieldOfStudy === currentUser.profile.education.fieldOfStudy) {
//             score += 1;
//         }
//     }
//     return { user, score };
//   });

//   const filteredMatches = refinedMatches.filter(match => match.score > 0);
//   filteredMatches.sort((a, b) => b.score - a.score);

//   if (filteredMatches.length > 0) {
//     return filteredMatches;
//   } else {
//      const excludedObjectIds = excludedUserIds.map(id => new mongoose.Types.ObjectId(id));
//      const randomUsers = await User.aggregate([
//        { $match: { _id: { $nin: excludedObjectIds } } },
//        { $sample: { size: 7 } }
//      ]);
//      return randomUsers.map(user => ({ user, score: 'random' }));
//   }
// }

// // Endpoint to get friend suggestions
// app.get('/api/suggestions', authenticateToken, async (req, res) => {
//   try {
//       const userId = req.user.id;
//       const suggestions = await getSuggestions(userId);
//       res.json({ suggestions });
//   } catch (error) {
//       console.error('Failed to fetch suggestions:', error);
//       res.status(500).json({ message: 'Failed to fetch suggestions', error: error.toString() });
//   }
// });

// //Endpoint to add freinds.
// app.post('/api/friendships', authenticateToken, async (req, res) => {
//   const { recipientId } = req.body;
//   const requesterId = req.user.id; 
//   if (!recipientId) {
//     return res.status(400).json({ message: "Recipient ID is required." });
//   }
//   if (recipientId === requesterId) {
//       return res.status(400).json({ message: "Cannot add yourself as a friend." });
//   }
//   try {
//       const existingFriendship = await Friendship.findOne({
//           $or: [
//               { requester: requesterId, recipient: recipientId },
//               { requester: recipientId, recipient: requesterId }
//           ]
//       });
//       if (existingFriendship) {
//           return res.status(409).json({ message: "Friendship already exists or request pending." });
//       }
//       const newFriendship = new Friendship({
//           requester: requesterId,
//           recipient: recipientId
//       });
//       await newFriendship.save();
//       res.status(201).json({ message: "Friend request sent.", friendship: newFriendship });
//   } catch (error) {
//       res.status(500).json({ message: "Failed to send friend request.", error: error.toString() });
//   }
// });


// app.get('/api/friend-requests', authenticateToken, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const friendRequests = await Friendship.find({recipient: userId, status: 'pending'})
//     .populate('requester', 'firstName lastName profile.headline profile.profileImagePath')
//     .exec();
//     const requestsWithUserDetails = friendRequests.map(fr => ({
//       id: fr._id,
//       requester: fr.requester.firstName + " " + fr.requester.lastName, 
//       status: fr.status,
//       profileImagePath: fr.requester.profile.profileImagePath
//     }));
//     res.json(requestsWithUserDetails);
//   } catch (error) {
//     console.error('Error fetching friend requests:', error);
//     res.status(500).json({ message: 'Failed to fetch friend requests', error: error.message });
//   }
// });

// // Fetch list of friends
// app.get('/api/friends', authenticateToken, async (req, res) => {
//   const userId = req.user.id;
//   try {
//     const friendships = await Friendship.find({
//       $and: [
//         { status: 'accepted' },
//         { $or: [{ requester: userId }, { recipient: userId }] }
//       ]
//     }).populate('requester recipient', 'firstName lastName profile.profileImagePath profile.headline'); // Adjust fields as needed
//       const friends = friendships.map(f => {
//       const friend = f.requester._id.toString() === userId ? f.recipient : f.requester;
//       const profileImagePath = friend.profile.profileImagePath;
//       friend.profileImagePath = profileImagePath;
//       return friend;
//     });
//     res.json(friends);
//   } catch (error) {
//     console.error('Failed to retrieve friends:', error);
//     res.status(500).json({ message: "Failed to retrieve friends", error: error.toString() });
//   }
// });

// // Function to accept a friend request
// const acceptFriendRequest = async (friendshipId) => {
//   try {
//     const friendship = await Friendship.findById(friendshipId);
//     if (!friendship) {
//       throw new Error('Friendship not found');
//     }
//     friendship.status = 'accepted';
//     await friendship.save();
//     return friendship;
//   } catch (error) {
//     throw new Error(`Failed to accept friend request: ${error.message}`);
//   }
// };

// // Function to decline a friend request
// const declineFriendRequest = async (friendshipId) => {
//   try {
//     const friendship = await Friendship.findById(friendshipId);
//     if (!friendship) {
//       throw new Error('Friendship not found');
//     }
//     friendship.status = 'declined';
//     await friendship.save();
//     return friendship;
//   } catch (error) {
//     throw new Error(`Failed to decline friend request: ${error.message}`);
//   }
// };
// // POST endpoint to accept a friend request
// app.post('/api/friendships/:id/accept', authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const friendship = await acceptFriendRequest(id);
//     res.json({ message: "Friend request accepted", friendship });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // POST endpoint to decline a friend request
// app.post('/api/friendships/:id/decline', authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const friendship = await declineFriendRequest(id);
//     res.json({ message: "Friend request declined", friendship });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });


// // Get messages between two users

// app.get('/api/messages', authenticateToken, async (req, res) => {
//   const userId = req.user.id; 
//   const { chatWith } = req.query; 
//   try {
//     const messages = await Message.find({
//       $or: [
//         { sender: userId, receiver: chatWith },
//         { receiver: userId, sender: chatWith }
//       ]
//     }).sort({ timestamp: 1 })
//       .populate('sender', 'firstName lastName profileImagePath')
//       .populate('receiver', 'firstName lastName profileImagePath');

//     res.json(messages);
//   } catch (error) {
//     console.error('Failed to fetch messages:', error);
//     res.status(500).json({ message: 'Failed to fetch messages', error: error.toString() });
//   }
// });

// // Get messages for a user
// app.get('/api/messages/user/:userId', authenticateToken, async (req, res) => {
//   const { userId } = req.params;
//   const loggedInUserId = req.user.id;
//   try {
//     const messages = await Message.find({
//       $or: [
//         { sender: loggedInUserId, receiver: userId },
//         { receiver: loggedInUserId, sender: userId }
//       ]
//     }).sort({ timestamp: 1 })
//       .populate('sender', 'firstName lastName profileImagePath')
//       .populate('receiver', 'firstName lastName profileImagePath');
//       // .sort({ timestamp: -1 });  // Sort by newest first
//       res.json(messages);
//   } catch (error) {
//       console.error('Failed to fetch messages:', error);
//       res.status(500).json({ message: 'Failed to fetch messages', error: error.toString() });
//   }
// });



// app.post('/upload/message-image', authenticateToken, (req, res) => {
//   uploadMessageImage(req, res, function(err) {
//     if (err) {
//       return res.status(500).json({ message: "Multer error: " + err.message });
//     }
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded!' });
//     }
//     const imageUrl = `/uploads/message_images/${req.file.filename}`;
//     res.json({ imageUrl });  // Just return URL
//   });
// });

// app.post('/api/messages', authenticateToken, async (req, res) => {
//   const { content, receiver, imageUrl, isImage = false } = req.body;
//   const sender = req.user.id;
//   if (!content && !imageUrl) {
//     return res.status(400).json({ message: 'Message content cannot be empty' });
//   }
//   const newMessage = new Message({sender,receiver,content,imageUrl,isImage});
//   try {
//     await newMessage.save();
//     res.status(201).json(newMessage);
//   } catch (error) {
//     console.error('Error sending message:', error);
//     res.status(500).json({ message: 'Failed to send message', error: error.toString() });
//   }
// });


// // File Uploads


// const coverStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads/covers/');},
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '_' + file.originalname);
//   }
// });

// app.post('/upload', authenticateToken, upload.single('file'), (req, res) => {
//   if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//   }
//   res.status(201).json({
//       message: 'File uploaded successfully',
//       filename: req.file.filename,
//       filepath: req.file.path
//   });
// });



// // Endpoint to upload general files
// app.post('/upload/general', authenticateToken, upload.single('file'), (req, res) => {
//   if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//   }
//   res.json({
//       message: 'File uploaded successfully',
//       filename: req.file.filename,
//       path: req.file.path
//   });
// });



// // POST endpoint to handle chunk uploads and reassembly
// app.post('/chunk-upload', authenticateToken, (req, res) => {
//   const { chunk, totalChunks, identifier } = req.body;
//   const targetDir = path.join(__dirname, 'uploads', identifier);
//   const targetPath = path.join(targetDir, `${req.body.chunkNumber}`);
//   if (!fs.existsSync(targetDir)){
//       fs.mkdirSync(targetDir);
//   }
//   // Move the chunk to the target path
//   chunk.mv(targetPath, err => {
//       if (err) {
//           return res.status(500).send({ message: "Failed to save chunk" });
//       }
//       const chunks = fs.readdirSync(targetDir);
//       if (chunks.length === totalChunks) {
//           const filePath = path.join(targetDir, identifier);
//           const fileStream = fs.createWriteStream(filePath);
//           chunks.sort().forEach(chunk => {
//               const chunkPath = path.join(targetDir, chunk);
//               fileStream.write(fs.readFileSync(chunkPath));
//               fs.unlinkSync(chunkPath);
//           });
//           fileStream.end();
//           res.send({ message: "File reassembled successfully", filePath });
//       } else {
//           res.send({ message: "Chunk uploaded successfully" });
//       }
//   });
// });

// app.get('/file/:filename', (req, res) => {
//   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     if (!file || file.length === 0) {
//       return res.status(404).json({ err: 'No file found' });
//     }
//     if (file.metadata && file.metadata.compressed) {
//       res.set('Content-Encoding', 'gzip');
//     }
//     const readstream = gfs.createReadStream(file.filename);
//     readstream.on('error', function(err) {
//       res.status(500).json({ err: err.message });
//     });
//     readstream.pipe(res);
//   });
// });

// app.delete('/file/:filename', (req, res) => {
//   gfs.remove({ filename: req.params.filename, root: 'uploads' }, (err, gridStore) => {
//     if (err) {
//       return res.status(404).json({ err: err });
//     }
//     res.redirect('/');
//   });
// });


// const storageCover = multer.diskStorage({
//   destination: function(req, file, cb) {
//       cb(null, 'uploads/covers/'); 
//   },
//   filename: function(req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//       cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const uploadCoverImage = multer({ 
//   storage: storageCover,
//   fileFilter: function (req, file, cb) {
//       if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//           cb(null, true);
//       } else {
//           cb(null, false);
//           return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
//       }
//   }
// }).single('coverImage');

// const messageImageStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//       cb(null, './uploads/message_images/');
//   },
//   filename: function (req, file, cb) {
//       cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const uploadMessageImage = multer({
//   storage: messageImageStorage,
//   limits: { fileSize: 10000000 }, // 10MB limit
//   fileFilter: function (req, file, cb) {
//     if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//       cb(null, true);
//   } else {
//       cb(null, false);
//       return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
//   }
//   }
// }).single('image'); 

// // Endpoint for uploading cover images
// app.post('/upload/cover', authenticateToken, uploadCoverImage, async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'No file uploaded' });
//   }
//   const userId = req.user.id;
//   const filePath = req.file.path;
//   try {
//       const updatedUser = await User.findByIdAndUpdate(userId, {
//           $set: {
//               "profile.coverImagePath": filePath
//           }
//       }, { new: true, runValidators: true });

//       if (!updatedUser) {
//           return res.status(404).json({ message: 'User not found' });
//       }
//       res.json({
//           message: 'Cover image updated successfully!',
//           data: updatedUser
//       });
//   } catch (error) {
//       console.error('Failed to update cover image:', error);
//       res.status(500).json({ message: 'Failed to update cover image', error: error.message });
//   }
// });


// // Define a route to get all posts
// // File upload settings
// const postStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadPath = path.join(__dirname, 'uploads', 'post');
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const postUpload = multer({ storage: postStorage, fileFilter: fileFilter });
// // Route to get all posts
// app.get('/api/posts', async (req, res) => {
//   try {
//     const posts = await Post.find()
//       .sort({ postedAt: -1 })
//       .populate('user', 'firstName lastName profileImagePath headline')
//       .populate({
//         path: 'comments',
//         populate: { path: 'user', select: 'firstName lastName profileImagePath' }
//       });
//     res.json(posts);
//   } catch (err) {
//     console.error('Error fetching posts:', err);
//     res.status(500).json({ message: 'Internal server error', error: err.message });
//   }
// });



// // Route to create a post
// app.post('/api/posts', authenticateToken, postUpload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
//   const { text, tags } = req.body;
//   const user = req.user.id;

//   const newPost = new Post({
//     user,
//     content: text,
//     tags,
//     imagePath: req.files.image ? `/uploads/post/${req.files.image[0].filename}` : null,
//     videoPath: req.files.video ? `/uploads/post/${req.files.video[0].filename}` : null
//   });

//   try {
//     await newPost.save();
//     res.status(201).json(newPost);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to create post', error: err.message });
//   }
// });





// // File upload endpoint
// // app.post('/post/upload', authenticateToken, postUpload.single('file'), (req, res) => {
// //   if (!req.file) {
// //     return res.status(400).json({ message: 'No file uploaded' });
// //   }
// //   res.status(201).json({
// //     message: 'File uploaded successfully',
// //     filename: req.file.filename,
// //     filepath: req.file.path
// //   });
// // });


// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err);  // Log error information for debugging
//   if (err.name === 'ValidationError') {
//       return res.status(400).json({ message: 'Validation Error', errors: err.errors });
//   } else if (err.code === 11000) { // Handling duplicate key errors for MongoDB
//       return res.status(409).json({ message: 'Duplicate key error: some provided data is already in use.' });
//   } else if (err instanceof jwt.JsonWebTokenError) {
//       return res.status(401).json({ message: 'Invalid token.' });
//   } else if (err instanceof jwt.TokenExpiredError) {
//       return res.status(401).json({ message: 'Token has expired.' });
//   } else {
//       return res.status(500).json({ message: 'Internal Server Error', error: err.message });
//   } 
// });


// // Start the server
// app.listen(process.env.PORT || 3001, () => {
//     console.log(`Server is running on port ${process.env.PORT || 3001}`);
// });
