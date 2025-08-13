const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../models/db');
const logger = require('pino')();
const bcryptjs = require('bcryptjs'); 
const { validationResult } = require('express-validator');
const validateUser = require('../util/validateUser');

const router = express.Router();

router.post('/register', validateUser, async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const db = await connectToDatabase();
    const collection = db.collection('users');
    const existingEmail = await collection.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        message: 'User with this email already exists. Try logging in',
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(password, salt);

    const user = await collection.insertOne({
      firstName,
      lastName,
      email,
      password: hash,
      createdAt: new Date(),
    });

    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      logger.error('JWT_SECRET environment variable is not set');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const payload = {
      user: {
        id: user.insertedId, 
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    }); 

    logger.info('User registered successfully');
    res.status(201).json({
      message: 'User registered successfully!!',
      email,
      token,
    });
  } catch (error) {
    logger.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' }); 
  }
});

module.exports = router;
