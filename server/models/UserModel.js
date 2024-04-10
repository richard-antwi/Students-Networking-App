const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
  firstName:{ 
    type: String, 
    required: true
   },
  lastName: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  selectProgram: { type: String, required: false },
  university: { type: String, required: false },
  profilePicture: { type: String, required: false },
}, { timestamps: true }); // Using timestamps option to auto-generate createdAt and updatedAt fields

module.exports = mongoose.model('User', UserSchema);
