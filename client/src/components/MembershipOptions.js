import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from './AuthContext';


export default function Membership_Options() {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const handleUpdate = async () => {
    const member = {
      role : "premium"
    };
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/member/${auth.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(member)
      });
      const data = await response.json();
      if (response.ok) {
        alert('Congrats you are now a premium member!');
        navigate('/profile');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('There was an error in buying the premium membership:', error);
      alert('There was an error in buying the premium membership.');
    }
  };

  return (
    <>
      <div className="hero">
        <h1>Membership</h1>
      </div>
      <div className="regular-membership-tile">
        <b>Regular membership - <i>FREE</i></b>

        <ul>
          <p>View your current tickets</p>
          <p>Collect reward points and redeem for movie tickets</p>
          <p>View your movie watch history</p>
          <p>Book up to 8 seats for you and your friends</p>
          <p>Cancel your tickets before showtime for a full refund</p>
        </ul>
      </div>

      <div className="premium-membership-tile">
        <b>Premium membership - <i>$15/year</i></b>

        <ul>
          <p>All the perks of regular membership</p>
          <p><i>PLUS</i> online service fee waived for any booking!</p>
          {auth.isAuthenticated && auth.role === 'regular' && (
          <div className="admin-controls">
            <button style = {{marginLeft:450}} onClick={() => handleUpdate()}>Buy</button>
          </div>
          )}
        </ul>
      </div>

      
      {!auth.isAuthenticated &&
        (<button className="membership-button"><Link to="/signup">Become a member</Link></button>)}  
      
    </>
  );
}
