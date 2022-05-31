import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalCost, selectedSeats, movieTitle, theaterDetails } = location.state || {};

  // Handling the case where no booking data is passed to the component
  if (!location.state) {
    return <p>No booking information found.</p>; // Optionally, redirect to a different page or show a different message
  }

  return (
    <div className="payment-container">
      <div className="receipt">
        <h2>Thank You for Booking!</h2>
        <div className="receipt-details">
          <p><strong>Movie Title:</strong> {movieTitle}</p>
          <p><strong>Theater:</strong> {theaterDetails.theaterName}</p>
          <p><strong>Screen Number:</strong> {theaterDetails.screenNumber}</p>
          <p><strong>Number of Seats:</strong> {selectedSeats.length}</p>
          <p><strong>Seats:</strong> {selectedSeats.join(', ')}</p>
          <p><strong>Total Cost:</strong> ${totalCost.toFixed(2)}</p>
        </div>
        <button onClick={() => navigate('/')} className="home-button">Return to Home</button>
      </div>
    </div>
  );
};


export default Payment;
