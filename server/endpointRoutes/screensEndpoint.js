const express = require('express');
const router = express.Router();
const Screens = require('../models/screensModel');
const mw = require('../services/middleware');

router.get('/screens', async (request, response) => {
    try {
        const { theatreid } = request.query;
        if(theatreid)
        {
            const screens = await Screens.find({theatre_id : theatreid});
            console.log(screens);
            return response.status(200).json(screens);
        }
        const screens = await Screens.find({});
        return response.status(200).json(screens);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message : error.message});
    }
});

router.get('/screens/:id', async (request, response) => {
    try {
        const { id }  = request.params;
        const screen = await Screens.findById(id);
        return response.status(200).json(screen);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message : error.message});
    }
});

router.post('/screens', mw.memberAuth, mw.checkRole(["admin"]), async (request, response) => {
    try {
        console.log(request.body);
        if (
            !request.body.screen_no || !request.body.theatre_id || !request.body.rows || !request.body.cols
        ) {
            return response.status(400).send({
                message : 'Send all required fields'
            });
        }
        const newScreen = {
            screen_no : request.body.screen_no,
            theatre_id : request.body.theatre_id,
            rows : request.body.rows,
            cols : request.body.cols
        }

        const screen = await Screens.create(newScreen);
        return response.status(200).json(screen);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({message : error.message});
    }
});


router.put('/screens/:id', mw.memberAuth, mw.checkRole(["admin"]), async (request, response) => {
    try {
        console.log(request.body);
        if (
            !request.body.screen_no || !request.body.theatre_id || !request.body.rows || !request.body.cols
        ) {
            return response.status(400).send({
                message : 'Send all required fields'
            });
        }
        const { id } = request.params;
        const screen = await Screens.findByIdAndUpdate(id, request.body);
        if (!screen) {
            return response.status(404).json({ message : 'Theatre not found.'});
        }
        return response.status(200).json({ message : 'Theatre updated successfully.'});

    } catch (error) {
        console.log(error.message);
        response.status(500).send({message : error.message});
    }
});

router.delete('/screens/:id', mw.memberAuth, mw.checkRole(["admin"]), async (request, response) => {
    try {
        const { id }  = request.params;
        const screen = await Screens.findByIdAndDelete(id);
        if(!screen){
            return response.status(404).json({ message : 'Screen not found'});
        }
        return response.status(200).json({ message : 'Screen deleted successfully'});
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message : error.message});
    }
});

module.exports = router;