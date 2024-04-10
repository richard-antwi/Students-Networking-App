const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const UserSchema = new mongoose.Schema(
  {
    firstName: { 
      type: String, 
      required: true
    },
    lastName: { 
      type: String, 
      required: true 
    },
    userName: { 
      type: String, 
      required: true, 
      unique: true 
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: { 
      type: String, 
      required: true 
    },
    dateOfBirth: { 
      type: Date, 
      required: true 
    },
    selectProgram: { 
      type: String
    },
    university: { 
      type: String
    },
    profilePicture: { 
      type: String
    },
  }, 
  { timestamps: true }
);

// Hash the password before saving
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Method to compare candidate password with user's password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
