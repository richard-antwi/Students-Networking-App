const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  postedAt: {
    type: Date,
    default: Date.now
  },
  tags: [{
    type: String,
    required: true
  }],
  filePath: { 
    type: String },
  likes: {
    type: Number,
    default: 0
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;



// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
 
// const postSchema = new Schema({
//   user: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   avatar: {
//     type: String,
//     required: true
//   },
//   content: {
//     type: String,
//     required: true
//   },
//   name: {
//     type: String,
//     required: true
//   },
//   postedAt: {
//     type: Date,
//     default: Date.now
//   },
//   interests: {
//     type: String,
//     required: true
//   },
//   location: {
//     type: String,
//     required: true
//   },
//   jobTitle: {
//     type: String,
//     required: true
//   },
//   jobType: {
//     type: String,
//     required: true
//   },
//   hourlyRate: {
//     type: Number,
//     required: true
//   },
//   content: {
//     type: String,
//     required: true
//   },
//   tags: [{
//     type: String,
//     required: true
//   }],
//   likes: {
//     type: Number,
//     default: 0
//   },
//   comments: {
//     type: Number,
//     default: 0
//   },
//   views: {
//     type: Number,
//     default: 0
//   }
// });

// // Create the Post model
// const Post = mongoose.model('Post', postSchema);

// module.exports = Post;
