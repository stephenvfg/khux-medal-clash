var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  username: String, 
  password: String, 
  email: String,
  admin: { type: Boolean, default: false },
  votes: { type: Number, default: 0 },
  _active: { type: Boolean, default: true }
});

module.exports = mongoose.model('User', userSchema);