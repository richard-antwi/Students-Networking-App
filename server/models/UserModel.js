const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const UserSchema = new mongoose.Schema(
  {
  firstName:{ 
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
    lowercase: true, // Converts email to lowercase
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
    type: String, 
    required: false 
  },
  university: { 
    type: String, 
    required: false 
  },
  profilePicture: { 
    type: String, 
    required: false 
  },
}, { timestamps: true }); // Using timestamps option to auto-generate createdAt and updatedAt fields

// Hash the password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Method to compare candidate password with user's password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;