const mongoose = require('mongoose');

const validateEmail = (email) => {
  const regExp = /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/;
  return regExp.test(email);
};

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [{
      validator: validateEmail,
      message: '',
    }],
    lowercase: true,
    trim: true,
    index: true,
  },
  displayName: {
    type: String,
    index: true,
    trim: true,
    required: true,
  }}, {
  timestamps: true,
});

module.exports = mongoose.model('User', schema);
