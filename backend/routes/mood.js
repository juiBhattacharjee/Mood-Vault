// routes/mood.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); 
const MoodItem = require('../models/MoodItem');
const auth = require('../middleware/auth');

// Helper function to extract user ID manually if middleware values are dropping
const recoverUserId = (req) => {
  const authHeader = req.header('Authorization') || req.header('authorization');
  if (authHeader) {
    try {
      const token = authHeader.split(' ')[1];
      const secretKey = process.env.JWT_SECRET || "temporary_portfolio_secret_key_123";
      const decoded = jwt.verify(token, secretKey);
      return decoded.userId || decoded.id;
    } catch (err) {
      console.error("❌ Inline Recovery Failed:", err.message);
    }
  }
  return null;
};

// READ (With Filtering, Sorting, and Searching)
router.get('/', auth, async (req, res) => {
  try {
    // Force recovery if token data dropped
    if (!req.user) {
      req.user = recoverUserId(req);
    }

    if (!req.user) {
      console.log("❌ GET Request rejected: No user token identity could be recovered.");
      return res.status(401).json({ error: "Unauthorized", message: "User identity missing." });
    }

    // 🔍 FIX: Explicitly lock the user ID into the query object first
    let finalQuery = {};
    finalQuery.user = req.user; 

    const { moodTag, sort, search } = req.query;

    // Safely apply optional filters without altering or resetting the user constraint
    if (moodTag && moodTag.trim() !== '' && moodTag !== 'undefined' && moodTag !== 'null') {
      finalQuery.moodTag = moodTag;
    }

    if (search && search.trim() !== '' && search !== 'undefined' && search !== 'null') {
      finalQuery.title = { $regex: search.trim(), $options: 'i' }; 
    }

    // Sorting parameters
    let sortOptions = {};
    if (sort === 'oldest') {
      sortOptions.createdAt = 1;
    } else {
      sortOptions.createdAt = -1; 
    }

    // 📜 CRITICAL CHECK: This MUST show {"user": "6a1beca..."} now!
    console.log("⚙️ Executing MongoDB Find with Query Object:", JSON.stringify(finalQuery));

    const items = await MoodItem.find(finalQuery).sort(sortOptions);
    console.log(`📊 Found ${items.length} matching documents for user: ${req.user}`);
    
    res.json(items);
  } catch (err) {
    console.error("❌ Error in GET /api/moods:", err.message);
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
});

// CREATE
router.post('/', auth, async (req, res) => {
  try {
    if (!req.user) {
      req.user = recoverUserId(req);
    }

    console.log("🔑 Authenticated User ID from Token (POST):", req.user);

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized", message: "User identity missing." });
    }

    const newItem = new MoodItem({ 
      title: req.body.title,
      imageUrl: req.body.imageUrl,
      notes: req.body.notes,
      moodTag: req.body.moodTag,
      user: req.user 
    });

    const item = await newItem.save();
    console.log("💾 Card successfully written to MongoDB Atlas!");
    res.status(201).json(item); 
  } catch (err) { 
    console.error("❌ Database Save Error in POST /api/moods:", err); 
    res.status(500).json({ error: 'Server Error', message: err.message }); 
  }
});

// UPDATE
router.put('/:id', auth, async (req, res) => {
  try {
    if (!req.user) req.user = recoverUserId(req);
    
    let item = await MoodItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Mood card not found' });
    
    if (item.user.toString() !== req.user?.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    item = await MoodItem.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(item);
  } catch (err) { 
    console.error("❌ Error in PUT /api/moods/:id:", err.message);
    res.status(500).json({ error: 'Server Error', message: err.message }); 
  }
});

// DELETE
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!req.user) req.user = recoverUserId(req);
    
    const item = await MoodItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Mood card not found' });
    
    if (item.user.toString() !== req.user?.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await item.deleteOne();
    res.json({ message: 'Item removed successfully' });
  } catch (err) { 
    console.error("❌ Error in DELETE /api/moods/:id:", err.message);
    res.status(500).json({ error: 'Server Error', message: err.message }); 
  }
});

module.exports = router;