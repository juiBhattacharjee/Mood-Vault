// models/User.js
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true } // Will be hashed via bcrypt
});
module.exports = mongoose.model('User', UserSchema);

// models/MoodItem.js
// const mongoose = require('mongoose');
// const MoodItemSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   title: { type: String, required: true },
//   imageUrl: { type: String, required: true },
//   notes: { type: String },
//   moodTag: { type: String, enum: ['Inspiring', 'Calm', 'Energetic', 'Moody'], required: true },
//   createdAt: { type: Date, default: Date.now }
// });
// module.exports = mongoose.model('MoodItem', MoodItemSchema);