const commentSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    postedAt: {
      type: Date,
      default: Date.now
    }
  });
  
  const Comment = mongoose.model('Comment', commentSchema);
  
  module.exports = Comment;
  