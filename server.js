const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Connect to MongoDB
mongoose.connect('mongodb://localhost/StudentSocialMedia', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

// Create a message schema
const messageSchema = new mongoose.Schema({
  conversation: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

// Create a message model
const Message = mongoose.model('Message', messageSchema);

// Serve static files
app.use(express.static('public'));

// Handle incoming socket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle new messages
  socket.on('chatMessage', (data) => {
    // Save the message to the database
    const message = new Message(data);
    message.save()
      .then(() => {
        // Emit the message to all connected clients
        io.emit('chatMessage', message);
      })
      .catch((error) => {
        console.error('Error saving message:', error);
      });
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Define a sample route
app.get('/api/sample', (req, res) => {
  res.json({ message: 'Sample route' });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});