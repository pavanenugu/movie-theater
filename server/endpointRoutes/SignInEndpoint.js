const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Members = require('../models/membersModel'); // Ensure this path is correct

const router = express.Router();

router.post('/api/signin', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Please provide both username and password.' });
        }

        const user = await Members.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        const token = jwt.sign(
          {
            role: user.role,
            name: user.username, // Change to user.name if you have a name field
            email: user.email,
            id: user._id
          },
          "secret", // Ensure you have this environment variable set
          { expiresIn: "3 days" }
        );
        
        res.status(200).json({
          id: user._id,
          role: user.role,
          name: user.username, // Or user.name
          email: user.email,
          token: token, // Do not prepend 'Bearer ' here
          expiresIn: 168,
          message: 'User signed in successfully.'
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error.' });
    }
});

module.exports = router;
