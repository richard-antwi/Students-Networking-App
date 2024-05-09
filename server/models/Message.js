const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    default: ''  // Default to empty if no text content is provided
  },
  imageUrl: {
    type: String,  // Store image URL here
    default: ''
  },
  file: {
    fileId: mongoose.Schema.Types.ObjectId, // Reference to GridFS file ID
    filename: String,
    contentType: String
},
  timestamp: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Message', messageSchema);
