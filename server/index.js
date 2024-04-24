require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');


const UserModel = require('./models/UserModel'); // Adjusted for a likely correct path

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
  
//User Profile API (Update)
  // Assuming UserProfile is imported from where it's defined
app.post('/user/profile/update', async (req, res) => {
  console.log(req.body);
  try {
    const userId = req.user._id; // Assuming you have the user's ID from authentication middleware
    const profileUpdate = req.body;

    const updatedProfile = await UserProfile.findOneAndUpdate({ _id: userId }, profileUpdate, {
      new: true,
      runValidators: true,
    });

    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Error handling middleware
app.use((err, req, res, next) => {
    if (err.name === 'MongoError' && err.code === 11000) {
      res.status(409).json({ message: 'User already exists with the provided username or email.' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server
app.listen(process.env.PORT || 3001, () => {
    console.log(`Server is running on port ${process.env.PORT || 3001}`);
});
