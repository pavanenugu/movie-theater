const express = require('express');
const router = express.Router();
const Members = require('../models/membersModel'); 

router.get('/api/members/regular', async (req, res) => {
    try {
        const regularMembers = await Members.find({ role: "regular" });
        res.status(200).json(regularMembers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error.' });
    }
});

module.exports = router;
