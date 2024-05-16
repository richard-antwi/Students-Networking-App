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
    default: ''  
  },
  imageUrl: {
    type: String,  
    default: ''
  },
  file: {
    fileId: mongoose.Schema.Types.ObjectId, 
    filename: String,
    contentType: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Message', messageSchema);
