const express = require('express');
const router = express.Router();
const Members = require('../models/membersModel'); // Adjust the path as necessary

router.get('/member/:memberId/movie-history', async (req, res) => {
    try {
        const memberId = req.params.memberId;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Directly use memberId in the query
        const member = await Members.findOne({ _id: memberId });

        if (!member) {
            return res.status(404).send('Member not found');
        }

        /*const movieHistory = member.movieHistory.filter(history => {
            const historyDate = new Date(history.date);
            return historyDate >= thirtyDaysAgo;
        });*/
        const movieNames = member.movieHistory
            .filter(history => new Date(history.date) >= thirtyDaysAgo)
            .map(history => history.movieName);

        res.json(movieNames);
    } catch (error) {
        console.error("Error occurred:", error.message);
        console.error(error.stack);
        res.status(500).send('Server error');
    }
});

// Assuming '/member/:memberId' is used to fetch individual member details
router.get('/member/:memberId/profile', async (req, res) => {
    try {
        const memberId = req.params.memberId;

        // Fetch member details excluding the password
        const member = await Members.findById(memberId).select('firstName lastName email phone username role rewards movieHistory');

        if (!member) {
            return res.status(404).send('Member not found');
        }

        res.json(member);
    } catch (error) {
        console.error("Error occurred:", error.message);
        console.error(error.stack);
        res.status(500).send('Server error');
    }
});

router.put('/member/:memberId', async (req, res) => {
    try {
        const memberId = req.params.memberId;

        const member = await Members.findByIdAndUpdate(memberId, req.body)

        if (!member) {
            return res.status(404).send('Member not found');
        }
        return res.status(200).json({ message : 'Member updated successfully.'});
    } catch (error) {
        console.error("Error occurred:", error.message);
        console.error(error.stack);
        res.status(500).send('Server error');
    }
});



module.exports = router;

