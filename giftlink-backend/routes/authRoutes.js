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

router.post('/login', validateUser, async (req, res) => {
  try {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const db = await connectToDatabase();
    const collection = db.collection('users');
    const user = await collection.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: `User with this email ${email} does not exist. Try registering!`,
      });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      logger.error('Passwords do not match');
      return res.status(401).json({
        message: `Incorrect email or password!`,
      });
    }

    if (!process.env.JWT_SECRET) {
      logger.error('JWT_SECRET environment variable is not set');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const payload = {
      user: {
        id: user._id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    logger.info(`User ${email} logged in successfully`);
    res.status(201).json({
      token,
      userName: user.firstName,
      email,
    });
  } catch (error) {
    logger.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// update API
router.put('/update', validateUser, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const email = req.headers.email;
    if (!email) {
      logger.error('Email not found in the request headers');
      return res
        .status(400)
        .json({ error: 'Email not found in the request headers' });
    }

    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      logger.error('JWT_SECRET environment variable is not set');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const db = await connectToDatabase();
    const collection = db.collection('users');

    const existingUser = await collection.findOne({ email });
    if (!existingUser) {
      logger.error('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    const allowedFields = ['firstName', 'lastName', 'name']; 
    const updateData = {};

    // Only include allowed fields from request body
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (req.body.name && !req.body.firstName) {
      updateData.firstName = req.body.name;
      delete updateData.name; 
    }

    updateData.updatedAt = new Date();

    // Only proceed if there are fields to update
    if (Object.keys(updateData).length === 1) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const updatedUser = await collection.findOneAndUpdate(
      { email },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!updatedUser) {
      logger.error('Failed to update user');
      return res.status(500).json({ error: 'Failed to update user' });
    }

    const payload = {
      user: {
        id: updatedUser._id.toString(),
      },
    };

    const authtoken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h', 
    }); 

    logger.info(`User ${email} updated successfully`);
    res.json({
      authtoken,
      message: 'User updated successfully',
      user: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    logger.error('Update error:', error);
    return res.status(500).json({ message: 'Internal Server Error' }); 
  }
});


module.exports = router;

