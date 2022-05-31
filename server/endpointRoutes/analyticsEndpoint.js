const express = require('express');
const Movies = require('../models/moviesModel');
const Showtimes = require('../models/showtimesModel');
const Screens = require('../models/screensModel');
const Theatres = require('../models/theatresModel');
const { json } = require('body-parser');
const { Redis } = require('ioredis');
const router = express.Router();

router.get('/movie-analytics', async (request, response) => {
    try {
        const cache = new Redis();
        const cacheValue = await cache.get("movie-analytics");
        if(cacheValue) return response.json(JSON.parse(cacheValue));
        const cur_movies = await Movies.find({});
        const movies = [];
        for(let i=0;i<cur_movies.length;i++)
        {
            const temp = {
                _id : cur_movies[i]._id,
                movieName : cur_movies[i].movieName,
                description : cur_movies[i].description,
                img : cur_movies[i].img,
                bookedseats : 0,
                totalseats : 0,
            }
            movies.push(temp);
        }
        for(let i=0;i<movies.length;i++)
        {
            const shows = await Showtimes.find({movieid:movies[i]._id});
            let totalseats = 0;
            let bookedseats = 0;
            for(let j=0;j<shows.length;j++)
            {
                const screens = await Screens.findById(shows[j].screen_id);
                totalseats += screens.rows*screens.cols;
                bookedseats += shows[j].seats_booked.length;
            }
            movies[i]["bookedseats"] = bookedseats;
            movies[i]["totalseats"] = totalseats;
        }
        await cache.set("movie-analytics", JSON.stringify(movies));
        await cache.expire("movie-analytics", 30);
        return response.status(200).json(movies);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({message : error.message});
    }
});

router.get('/location-analytics', async (request, response) => {
    try {
        const cache = new Redis();
        const cacheValue = await cache.get("location-analytics");
        if(cacheValue) return response.json(JSON.parse(cacheValue));
        const dist_locations = await Theatres.distinct('city');
        const locations = [];
        for(let i=0;i<dist_locations.length;i++)
        {
            const temp = {
                location : dist_locations[i],
                theatres : [],
                screens : [],
                shows : [],
                bookedseats : 0,
                totalseats : 0,
            }
            locations.push(temp);
        }
        
        for(let i=0;i<locations.length;i++)
        {
            const theatres = await Theatres.find({city:locations[i].location});
            locations[i].theatres = theatres;
        }
        for(let i=0;i<locations.length;i++)
        {
            for(let j=0;j<locations[i].theatres.length;j++)
            {
                const screens = await Screens.find({theatre_id:locations[i].theatres[j]._id});
                for(let k=0;k<screens.length;k++)
                {
                    locations[i].screens.push(screens[k]);
                }
            }
        }

        for(let i=0;i<locations.length;i++)
        {
            let totalseats = 0;
            let bookedseats = 0;
            for(let j=0;j<locations[i].screens.length;j++)
            {
                const shows = await Showtimes.find({screen_id : locations[i].screens[j]._id});
                for(let k=0;k<shows.length;k++)
                {
                    totalseats += locations[i].screens[j].rows*locations[i].screens[j].cols;
                    bookedseats += shows[k].seats_booked.length; 
                }
            }
            locations[i].bookedseats = bookedseats;
            locations[i].totalseats = totalseats;
        }
        await cache.set("location-analytics", JSON.stringify(locations));
        await cache.expire("location-analytics", 30);
        return response.status(200).json(locations);
        
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message : error.message});
    }
});

module.exports = router;