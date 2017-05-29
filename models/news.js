var mongoose = require('mongoose');

var newsSchema = new mongoose.Schema({
	headline: String,
	content: String,
	type: String,
  date: mongoose.Schema.Types.Date,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  _active: { type: Boolean, default: true }
});

module.exports = mongoose.model('News', newsSchema);