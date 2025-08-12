const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

// Search for gifts
router.get('/', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('gifts');

    let query = {};
    
    if (req.query.name && req.query.name.trim() !== '') {
      query.name = { $regex: req.query.name, $options: 'i' };
    }

    if (req.query.category && req.query.category.trim() !== '') {
      query.category = req.query.category.trim();
    }

    if (req.query.condition && req.query.condition.trim() !== '') {
      query.condition = req.query.condition.trim();
    }

    if (req.query.age_years) {
      const age = parseInt(req.query.age_years, 10);
      if (!isNaN(age)) {
        query.age_years = { $lte: age };
      }
    }

    const gifts = await collection.find(query).toArray();
    res.json(gifts);
  } catch (e) {
    next(e);
  }
});


module.exports = router;
