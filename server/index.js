require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');


const UserModel = require('./models/UserModel'); // Adjusted for a likely correct path
const UserProfile = require('./models/UserProfile');

// Initialize the Express app
const app = express();

// Apply Helmet for security headers
app.use(helmet());

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
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

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

//User Profile API (Update)
  // Assuming UserProfile is imported from where it's defined
//   app.post('/user/profile/update', authenticateToken, async (req, res) => {
//     console.log("Update Payload:", req.body);
//     try {
//         const userId = req.user.id; // Assuming the JWT contains an 'id' field
//         const profileUpdate = req.body;
//         console.log("User ID from token:", req.user.id);
//         const updatedProfile = await UserProfile.findOneAndUpdate(
//           { _id: userId },
//           profileUpdate,
//           { new: true, runValidators: true }
//         );
        
//         if (!updatedProfile) {
//           console.log("No profile found for user ID:", userId);
//           return res.status(404).json({ message: "User not found" });
//         }
    
//         console.log("Profile updated successfully:", updatedProfile);
//         res.json(updatedProfile);
//       } catch (error) {
//         console.error("Error updating profile:", error);
//         res.status(500).json({ message: "Failed to update profile", error: error.toString() });
//       }
// });

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
