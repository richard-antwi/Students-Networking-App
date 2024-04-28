require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');


const UserModel = require('./models/UserModel'); // Adjusted for a likely correct path
const UserProfile = require('./models/UserProfile');

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
    try {
        const user = await UserModel.create(req.body);
        res.json(user);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', errors: err.errors });
        }
        res.status(500).json({ message: 'Server error', error: err });
    }
});

    //Login API
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
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
app.post('/user/profile/update', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const profileUpdate = req.body;

  try {
      // Attempt to find and update the profile, or create a new one if it doesn't exist
      const updatedProfile = await UserProfile.findOneAndUpdate(
          { _id: userId },
          profileUpdate,
          { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true } // Ensures creation if not found
      );

      if (updatedProfile) {
          console.log("Profile updated or created successfully:", updatedProfile);
          return res.json(updatedProfile);
      } else {
          // It's unlikely to get here since upsert should either update or create
          console.log("No profile found and none created for user:", userId);
          return res.status(404).json({ message: "User not found and profile not created" });
      }
  } catch (error) {
      console.error("Error updating or creating profile:", error);
      res.status(500).json({ message: "Failed to update or create profile", error: error.message });
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

// Check File Type
function checkFileType(file, cb) {
  // Allowed file extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}


app.post('/upload', authenticateToken, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file selected!' });
    }

    const filePath = req.file.path;  // File path for the uploaded image

    try {
      const updatedProfile = await UserProfile.findOneAndUpdate(
        { _id: req.user.id },
        { profileImagePath: filePath },
        { new: true, upsert: true }  // Ensures creation if not found and returns the new document
      );

      if (!updatedProfile) {
        return res.status(404).json({ message: "Profile not found and couldn't be created" });
      }

      res.json({
        message: 'File uploaded and profile updated!',
        filePath: filePath,
        data: updatedProfile
      });
    } catch (error) {
      res.status(500).json({ message: 'Database update failed', error });
    }
  });
});


app.get('/user/profile', authenticateToken, async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ _id: req.user.id });
    if (!userProfile) {
      return res.status(404).send('Profile not found.');
    }
    res.json(userProfile);
  } catch (error) {
    res.status(500).send('Server error');
  }
});


//suggestions
async function getSuggestions(userId) {
  const currentUser = await UserProfile.findById(userId);
  if (!currentUser) {
    return []; // No user profile means no suggestions
  }

  // Build a query to find users with similar interests or other attributes
  let query = {
    _id: { $ne: userId } // Exclude current user from suggestions
  };

  let score = {}; // Initialize a scoring object

  // Add conditions to the query and increase scores based on matching attributes
  if (currentUser.interests) {
    query.interests = { $in: currentUser.interests };
    score['interests'] = 1; // Example score increment
  }
  if (currentUser.location && currentUser.location.city) {
    query['location.city'] = currentUser.location.city;
    score['location'] = 1;
  }
  // Continue for other attributes like industry, education, etc.

  // Fetch potential friends based on the constructed query
  const potentialFriends = await UserProfile.find(query).lean();

  // Calculate the total score for each potential friend based on the matching criteria
  return potentialFriends.map(friend => {
    let totalScore = 0;
    Object.keys(score).forEach(key => {
      if (friend[key] && currentUser[key] && friend[key] === currentUser[key]) {
        totalScore += score[key];
      }
    });
    return { friend, score: totalScore };
  })
  .filter(friend => friend.score > 0) // Filter out users with no matching criteria
  .sort((a, b) => b.score - a.score); // Sort by highest score first
}


// Endpoint to get friend suggestions
app.get('/api/suggestions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming your authentication middleware adds `user` to `req`
    const suggestions = await getSuggestions(userId);
    res.json(suggestions);
  } catch (error) {
    console.error('Failed to fetch suggestions:', error);
    res.status(500).json({ message: 'Failed to fetch suggestions', error: error.toString() });
  }
});



// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);  // Log error information for debugging

  if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: err.errors });
  } else if (err.name === 'MongoError' && err.code === 11000) {
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
