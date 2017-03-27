var mongoose = require('mongoose');

var voteSchema = new mongoose.Schema({
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Medal' },
  loser: { type: mongoose.Schema.Types.ObjectId, ref: 'Medal' },
  date: mongoose.Schema.Types.Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ip: String,
  _active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Vote', voteSchema);