const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UsersModel = require('./models/UsersModel'); // Make sure this path is correct and exports your model

const app = express();
app.use(express.json());
app.use(cors());

// Make sure your MongoDB URI and database name are correct
mongoose.connect("mongodb://localhost:27017/StudentSocialMedia")
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

app.post('/register', (req, res) => {
    UsersModel.create(req.body)
    .then(user => res.json(user))
    .catch(err => res.status(400).json(err)); // Send back a 400 status code on error
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
