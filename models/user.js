var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  contributor: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
  votes: { type: Number, default: 0 },
  _active: { type: Boolean, default: true }
});

module.exports = mongoose.model('User', userSchema);