import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentOverview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movieTitle, movieImage, selectedSeats, totalCost, showtimeId } = location.state || {};
  const { auth } = useAuth();

  // State to store theater details
  const [theaterDetails, setTheaterDetails] = useState({});
  // State to store user's reward points
  const [rewardPoints, setRewardPoints] = useState(0);

  // Fetch theater details
  useEffect(() => {
    const fetchTheaterDetails = async () => {
      try {
        const showtimeResponse = await axios.get(`/showtimes/${showtimeId}`);
        const { screen_id } = showtimeResponse.data;
        const screenResponse = await axios.get(`/screens/${screen_id}`);
        const { theatre_id } = screenResponse.data;

        const theaterResponse = await axios.get(`/theatres/${theatre_id}`);
        setTheaterDetails({
          theaterName: theaterResponse.data.theatreName,
          screenNumber: screenResponse.data.screen_no,
        });
      } catch (error) {
        console.error('Error fetching theater details:', error);
      }
    };

    fetchTheaterDetails();
  }, [showtimeId]);

  // Fetch user's reward points
  useEffect(() => {
    const fetchRewardPoints = async () => {
      try {
        // Replace with the actual API endpoint to fetch user's profile
        const profileResponse = await axios.get(`/member/${auth?.id}/profile`);
        const rewardPoints = profileResponse.data?.rewards || 0;
        setRewardPoints(rewardPoints);
      } catch (error) {
        console.error('Error fetching reward points:', error);
      }
    };
  
    // Fetch reward points only if the user is authenticated
    if (auth?.id) {
      fetchRewardPoints();
    }
  }, [auth?.id]);
// Function to handle payment submission
const handlePaymentSubmission = async (paymentMethod) => {
  try {

    // Prepare ticket data
    let ticketData = {
      showid: showtimeId,
      isPaymentViaRewards: false, // Default to false
    };

    // Include memberid only if the user is authenticated
    if (auth?.id) {
      ticketData.memberid = auth?.id;
    }

    // Check if payment is done with reward points
    if (paymentMethod === 'rewardPoints') {
      if (rewardPoints >= totalCost) {
        // Sufficient reward points, proceed with payment
        // You can deduct reward points here if needed
        // For now, deducting reward points from totalCost
        ticketData.isPaymentViaRewards = true;
      } else {
        // Insufficient reward points, show alert
        alert("You don't have enough reward points. Please pay with cash.");
        return; // Stop execution to prevent further processing
      }
    }

    // Include selected seats in the ticket data
    ticketData.seatsBooked = selectedSeats;

    // Submit ticket data
    await axios.post('/tickets', ticketData);

    // Navigate to Payment page with all necessary details, including theater details
    navigate('/payment', {
      state: {
        movieTitle,
        selectedSeats,
        totalCost: ticketData.isPaymentViaRewards ? 0 : totalCost, // Set totalCost to 0 if payment is via rewards
        paymentMethod,
        theaterDetails,
      },
    });
  } catch (error) {
    console.error('Error during payment submission:', error);
    // Handle error appropriately
  }
};

  return (
    <div className="payment-overview-container">
      <h1>Payment Overview</h1>
      <img src={movieImage} alt={movieTitle} className="movie-poster" />
      <h2>{movieTitle}</h2>
      <p>Selected Seats: {selectedSeats.join(', ')}</p>
      <p>Total Cost: ${totalCost}</p>
      <p>Theater: {theaterDetails.theaterName}</p>
      <p>Screen Number: {theaterDetails.screenNumber}</p>
      <p>Reward Points: {rewardPoints}</p>

      <div className="payment-methods">
        <button onClick={() => handlePaymentSubmission('rewardPoints')}>Pay with Reward Points</button>
        <button onClick={() => handlePaymentSubmission('money')}>Pay with Money</button>
      </div>
    </div>
  );
};

export default PaymentOverview;
