const express = require('express');
const router = express.Router();
const Members = require('../models/membersModel'); 

router.get('/api/members/premium', async (req, res) => {
    try {
        const premiumMembers = await Members.find({ role: "premium" });
        res.status(200).json(premiumMembers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error.' });
    }
});

module.exports = router;
