const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./models/UserModel'); // Adjusted for a likely correct path

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/StudentSocialMedia", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

app.post('/register', async (req, res) => {
    try {
        const user = await UserModel.create(req.body);
        res.json(user);
    } catch (err) {
        // More granular error handling can go here
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', errors: err.errors });
        }
        res.status(500).json({ message: 'Server error', error: err });
    }
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
