// friendship.model.js
const mongoose = require('mongoose');

const FriendshipSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
    }
}, { timestamps: true });

// Add methods to the schema to handle friend request status update
FriendshipSchema.methods.acceptFriendRequest = async function() {
    this.status = 'accepted';
    await this.save();
};

FriendshipSchema.methods.declineFriendRequest = async function() {
    this.status = 'declined';
    await this.save();
};

const Friendship = mongoose.model('Friendship', FriendshipSchema);

module.exports = Friendship;
