const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path'); // Node utility for folder routing

const app = express();
app.use(cors());
app.use(express.json());

// 1. LINK YOUR ROUTES HERE
app.use('/api/auth', require('./routes/auth'));
app.use('/api/moods', require('./routes/mood'));

// 2. SERVE STATIC FRONTEND ASSETS IN PRODUCTION
// This joins your React build folder straight to your Express backend process
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

// 3. DYNAMIC PORT ALLOCATION 
// Pulls the hosting platform's temporary assigned port, or defaults to 5000 locally
const PORT = process.env.PORT || 5000;

// 4. MONGODB ATLAS PRODUCTION CONNECTION
const MONGO_URI = process.env.MONGO_URI || "your_local_mongodb_fallback_string";

mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Production Server running cleanly on port ${PORT}`));
  })
  .catch(err => console.error("❌ Database Connection Failed:", err));