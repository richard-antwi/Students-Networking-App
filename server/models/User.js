const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: [true, 'First name is required'] },
    lastName: { type: String, required: [true, 'Last name is required'] },
    userName: { type: String, required: true, unique: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    profile: {
        additionalName: String,
        namePronunciation: String,
        headline: String,  
        currentPosition: {
            title: String,
            company: String,
            startDate: Date,
            endDate: Date,
            currentlyWorkingHere: Boolean,
        },
        industry: String,
        showSchool: Boolean,
        education: {
            school: String,
            degree: String,
            fieldOfStudy: String,
            startDate: Date,
            endDate: Date,
            currentlyStudyingHere: Boolean,
        },
        location: {
            countryRegion: String,  
            city: String,
        },
        contactInfo: {
            phone: String,
            address: String,
        },
        profileImagePath: { type: String, default: '' },
        coverImagePath: {
            type: String,
            default: ''
          }
    }
}, { timestamps: true });


// Hash the password before saving
UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

// Method to compare candidate password with user's password
UserSchema.methods.checkPassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
