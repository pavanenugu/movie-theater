const express = require('express');
const router = express.Router();
const Movies = require('../models/moviesModel');
const Showtimes = require('../models/showtimesModel');
const Theatres = require('../models/theatresModel');
const Screens = require('../models/screensModel');
const mw = require('../services/middleware');

router.get('/movies', async (request, response) => {
    try {
        const { movieid, theatreid } = request.query;
        if(theatreid && movieid)
        {
            const showtimes = await Showtimes.find({ movieid : movieid});
            let shows = []
            let set = new Set();
            let j = 0;
            for(let i=0;i<showtimes.length;i++)
            {
                let screen = await Screens.findById(showtimes[i].screen_id);
                if(screen.theatre_id==theatreid && !set.has(showtimes))
                {
                    set.add(showtimes[i]);
                    shows[j] = showtimes[i];
                    j++;
                }
            }
            return response.status(200).json(shows);;
        }
        if(movieid)
        {
            const showtimes = await Showtimes.find({ movieid : movieid});
            let screenid = new Set();
            for(let i=0;i<showtimes.length;i++)
            {
                screenid.add(showtimes[i].screen_id);
            }
            screenid = [...screenid];
            let theatid = new Set();
            for(let i=0;i<screenid.length;i++)
            {
                const screen = await Screens.findById(screenid[i]);
                theatid.add(screen.theatre_id);
            }
            theatid = [...theatid];
            let theatres = [];
            let set = new Set();
            let j = 0;
            for(let i=0;i<theatid.length;i++)
            {
                let s = theatid[i].toString();
                if(set.has(s)) continue;
                set.add(s);
                const theatre = await Theatres.findById(theatid[i]);
                theatres[j] = theatre;
                j++;
            }
            return response.status(200).json(theatres);
        }
        const movies = await Movies.find({});
        return response.status(200).json(movies);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message : error.message});
    }
});

router.get('/movies/:id', async (request, response) => {
    try {
        const { id }  = request.params;
        const movie = await Movies.findById(id);
        return response.status(200).json(movie);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message : error.message});
    }
});

router.post('/movies',  mw.memberAuth, mw.checkRole(['admin']), async (request, response) => {
    try {
        console.log(request.body);
        if (
            !request.body.movieName || !request.body.status || !request.body.description || !request.body.language || !request.body.length
        ) {
            return response.status(400).send({
                message : 'Send all required fields'
            });
        }
        const newMovie = {
            movie_id : request.body.movie_id,
            movieName : request.body.movieName,
            status : request.body.status,
            description : request.body.description,
            language : request.body.language,
            length : request.body.length,
            date : request.body.date,
            img : request.body.img,
            rating : request.body.rating
        }

        const movie = await Movies.create(newMovie);
        return response.status(200).json(movie);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({message : error.message});
    }
});

router.put('/movies/:id',  mw.memberAuth, mw.checkRole(['admin']), async (request, response) => {
    try {
        console.log(request.body);
        if (
            !request.body.movieName || !request.body.status || !request.body.description || !request.body.language || !request.body.length
        ) {
            return response.status(400).send({
                message : 'Send all required fields'
            });
        }
        const { id } = request.params;
        const movie = await Movies.findByIdAndUpdate(id, request.body);
        if (!movie) {
            return response.status(404).json({ message : 'Movie not found.'});
        }
        return response.status(200).json({ message : 'Movie updated successfully.'});

    } catch (error) {
        console.log(error.message);
        response.status(500).send({message : error.message});
    }
});

router.delete('/movies/:id',  mw.memberAuth, mw.checkRole(['admin']), async (request, response) => {
    try {
        const { id }  = request.params;
        const movie = await Movies.findByIdAndDelete(id);
        if(!movie){
            return response.status(404).json({ message : 'Movie not found'});
        }
        return response.status(200).json({ message : 'Movie deleted successfully'});
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message : error.message});
    }
});

module.exports = router;