const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
   user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
   post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
   text: { type: String, required: true },
   likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
   replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
   createdAt: { type: Date, default: Date.now }
 });

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
