const express = require('express');
const router = express.Router();
const Theatres = require('../models/theatresModel');
const Screens = require('../models/screensModel');
const Showtimes = require('../models/showtimesModel');
const Movies = require('../models/moviesModel');
const mw = require('../services/middleware');

router.get('/locations', async (request, response) => {
    try {
        const locations = await Theatres.distinct('city');
        return response.status(200).json(locations);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message : error.message});
    }
});

router.get('/locations/:place', async (request, response) => {
    try {
        const { place } = request.params;
        const { theatreid, movieid } = request.query;
        if (theatreid && movieid)
        {
            const screens = await Screens.find({ theatre_id : theatreid});
            let n = screens.length;
            const movieshows = [];
            for(let i=0;i<n;i++)
            {
                const shows = await Showtimes.find({ screen_id :screens[i]._id });
                let k = shows.length;
                for(let j=0;j<k;j++)
                {
                    if(shows[j].movieid==movieid)
                    {
                        movieshows.push(shows[j]);
                    }
                }
            }
            return response.status(200).json(movieshows);
        }
        if(theatreid)
        {
            const screens = await Screens.find({ theatre_id : theatreid});
            let n = screens.length;
            const movieids = [];
            let set = new Set();
            console.log(screens);
            for(let i=0;i<n;i++)
            {
                const shows = await Showtimes.find({ screen_id :screens[i]._id });
                let k = shows.length;
                for(let j=0;j<k;j++)
                {
                    let s = shows[j].movieid.toString();
                    if(set.has(s)) continue;
                    set.add(s);
                    movieids.push(shows[j].movieid);
                }
            }
            console.log(movieids);
            let movies = [];
            n = movieids.length;
            for(let i=0;i<n;i++)
            {
                const movie = await Movies.findById(movieids[i]);
                movies.push(movie);
            }
            return response.status(200).json(movies);
        }
        const theatres = await Theatres.find({ city : place});
        return response.status(200).json(theatres);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message : error.message});
    }
});

router.get('/theatres', async (request, response) => {
    try {
        const theatres = await Theatres.find({});
        return response.status(200).json(theatres);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message : error.message});
    }
});

router.get('/theatres/:id', async (request, response) => {
    try {
        const { id }  = request.params;
        const theatre = await Theatres.findById(id);
        return response.status(200).json(theatre);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message : error.message});
    }
});

router.post('/theatres', mw.memberAuth, mw.checkRole(['admin']), async (request, response) => {
    try {
        if (
            !request.body.theatreName || !request.body.city 
        ) {
            return response.status(400).send({
                message : 'Send all required fields'
            });
        }
        const newTheatre = {
            theatreName : request.body.theatreName,
            city : request.body.city,
        }

        const theatre = await Theatres.create(newTheatre);
        return response.status(200).json(theatre);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({message : error.message});
    }
});


router.put('/theatres/:id',  mw.memberAuth, mw.checkRole(['admin']), async (request, response) => {
    try {
        console.log(request.body);
        if (
            !request.body.theatreName || !request.body.city 
        ) {
            return response.status(400).send({
                message : 'Send all required fields'
            });
        }
        const { id } = request.params;
        const theatre = await Theatres.findByIdAndUpdate(id, request.body);
        if (!theatre) {
            return response.status(404).json({ message : 'Theatre not found.'});
        }
        return response.status(200).json({ message : 'Theatre updated successfully.'});

    } catch (error) {
        console.log(error.message);
        response.status(500).send({message : error.message});
    }
});

router.delete('/theatres/:id',  mw.memberAuth, mw.checkRole(['admin']), async (request, response) => {
    try {
        const { id }  = request.params;
        const theatre = await Theatres.findByIdAndDelete(id);
        if(!theatre){
            return response.status(404).json({ message : 'Theatre not found'});
        }
        return response.status(200).json({ message : 'Theatre deleted successfully'});
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message : error.message});
    }
});

module.exports = router;