const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
  },
  additionalName: {
    type: String,
  },
  namePronunciation: {
    type: String,
  },
  headline: {
    type: String,
    required: [true, 'Headline is required'],
  },
  currentPosition: [{
    title: String,
    company: String,
    startDate: Date,
    endDate: Date,
    currentlyWorkingHere: Boolean,
  }],
  industry: {
    type: String,
    required: [true, 'Industry is required'],
  },
  education: [{
    school: String,
    degree: String,
    fieldOfStudy: String,
    startDate: Date,
    endDate: Date,
    currentlyStudyingHere: Boolean,
  }],
  location: {
    countryRegion: {
      type: String,
      required: [true, 'Country/Region is required'],
    },
    city: String,
  },
  contactInfo: {
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      validate: {
        validator: function(v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`
      },
    },
    phone: String,
    address: String,
  },
}, { timestamps: true });

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;
