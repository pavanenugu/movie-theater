const express = require('express');
const bcrypt = require('bcryptjs');
const Members = require('../models/membersModel'); // Make sure to replace this with the correct path

const router = express.Router();

router.post('/api/register', async (req, res) => {
    try {
        if (!req.body.firstName || !req.body.lastName || !req.body.username || !req.body.password || !req.body.phone || !req.body.email) {
            return res.status(400).json({ error: 'Please fill in all the required fields.' });
        }

        const userExists = await Members.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
        if (userExists) {
            return res.status(409).json({ error: 'Username or Email already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new Members({
            ...req.body,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully.' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error.' });
    }
});

module.exports = router;