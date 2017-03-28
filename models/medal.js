var mongoose = require('mongoose');

var medalSchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true },
  imgPath: String,
  no: Number,
  affinity: String,
  attribute: String,
  baseStr: Number,
  baseDef: Number,
  spAtk: String,
  spDesc: String,
  target: String,
  tier: Number,
  mult: String,
  gauges: Number,
  isGuilted: Boolean,
  isBoosted: Boolean,
  strBoost: Number,
  defBoost: Number,
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  ratio: { type: Number, default: 0 },
  random: { type: [Number], index: '2d' },
  voted: { type: Boolean, default: false },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  _active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Medal', medalSchema);