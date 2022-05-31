const express = require('express');
const router = express.Router();
const Tickets = require('../models/ticketsModel');
const Showtimes = require('../models/showtimesModel');
const Members = require('../models/membersModel');
const Movies = require('../models/moviesModel');

router.get('/tickets', async (request, response) => {
    try {
        const tickets = await Tickets.find({});
        return response.status(200).json(tickets);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message : error.message});
    }
});

router.get('/tickets/:id', async (request, response) => {
    try {
        const { id }  = request.params;
        const ticket = await Tickets.findById(id);
        return response.status(200).json(ticket);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message : error.message});
    }
});

router.post('/tickets', async (request, response) => {
    try {

        if (!request.body.seatsBooked || !request.body.showid ||  request.body.isPaymentViaRewards === undefined || typeof request.body.isPaymentViaRewards !== 'boolean') {
            return response.status(400).send({
                message: 'Send all required fields'
            });
        }
        const newTicket = {
            memberid: request.body.memberid,
            seatsBooked: request.body.seatsBooked,
            showid: request.body.showid,
            isPaymentViaRewards: request.body.isPaymentViaRewards
        };

        const show = await Showtimes.findById(request.body.showid);
        const movie = await Movies.findById(show.movieid); // Assuming show.movieid holds the movie's ID
        const movieName = movie.movieName; // Assuming movie.movieName holds the movie's name
        const currentDate = new Date();

        // Add the booked seats to the show
        const updatedShow = {
            ...show.toObject(),
            seats_booked: [...show.seats_booked, ...request.body.seatsBooked]
        };

        // Calculate the new rewards
        const n = request.body.seatsBooked.length;
        let newRewards = request.body.memberid;
        newRewards = n * show.price;
        
        // Update the showtimes and member in parallel
        if(!request.body.isPaymentViaRewards){
        await Promise.all([
            Showtimes.findByIdAndUpdate(request.body.showid, updatedShow),
            Members.findByIdAndUpdate(request.body.memberid, {
                $inc: { rewards: newRewards },
                $push: { movieHistory: { date: currentDate, movieName: movieName } }
            })
        ]);
    }
    else{
        await Promise.all([
            Showtimes.findByIdAndUpdate(request.body.showid, updatedShow),
            Members.findByIdAndUpdate(request.body.memberid, {
                $inc: { rewards: -newRewards },
                $push: { movieHistory: { date: currentDate, movieName: movieName } }
            })
        ]);
    }

        const ticket = await Tickets.create(newTicket);
        return response.status(200).json(ticket);
    } catch (error) {
        console.log(error.message);
        console.error(error.stack)
        response.status(500).send({ message: error.message });
    }
});



router.put('/tickets/:id', async (request, response) => {
    try {
        if (
            !request.body.userid || !request.body.seatsBooked || !request.body.showid  
        ) {
            return response.status(400).send({
                message : 'Send all required fields'
            });
        }
        const { id } = request.params;
        const ticket = await Tickets.findByIdAndUpdate(id, request.body);
        if (!ticket) {
            return response.status(404).json({ message : 'Ticket not found.'});
        }
        return response.status(200).json({ message : 'Ticket updated successfully.'});

    } catch (error) {
        console.log(error.message);
        response.status(500).send({message : error.message});
    }
});

router.delete('/tickets/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const ticket = await Tickets.findById(id);
        if (!ticket) {
            return response.status(404).json({ message: 'Ticket not found' });
        }

        // Find the show and movie name
        const show = await Showtimes.findById(ticket.showid);
        const movie = await Movies.findById(show.movieid);
        const movieNameToDelete = movie.movieName;

        // Update the showtimes by removing the booked seats
        const updatedSeats = show.seats_booked.filter(seat => !ticket.seatsBooked.includes(seat));
        await Showtimes.findByIdAndUpdate(ticket.showid, { seats_booked: updatedSeats });
           // Update member's rewards and movie history
        const member = await Members.findById(ticket.memberid);
        if(!ticket.isPaymentViaRewards)
        {
            if (member) {
                member.rewards -= ticket.seatsBooked.length * show.price;
                const updatedMovieHistory = member.movieHistory.filter((history, index, self) =>
                    !(history.movieName === movieNameToDelete && index === self.findIndex(h => h.movieName === movieNameToDelete))
                );
                member.movieHistory = updatedMovieHistory;
                await member.save();
            }
        }
        else
        {
            if (member) {
                member.rewards += ticket.seatsBooked.length * show.price;
                const updatedMovieHistory = member.movieHistory.filter((history, index, self) =>
                    !(history.movieName === movieNameToDelete && index === self.findIndex(h => h.movieName === movieNameToDelete))
                );
                member.movieHistory = updatedMovieHistory;
                await member.save();
            }
        }

        // Delete the ticket
        await Tickets.findByIdAndDelete(id);

        return response.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        console.error('Error:', error.message);
        response.status(500).send({ message: error.message });
    }
});

module.exports = router;