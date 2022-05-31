// Features.js
import React from 'react';
import { useAuth } from './AuthContext';

const Features = () => {
  const { auth } = useAuth();

  return (
    <section className="features">
      <div className="feature">
        <a href='/locations' className='link-'><h2>Theatre Locations</h2></a>
        <p>Watch at a  wide range of locations </p>
      </div>
      <div className="feature">
      <a href='/movielistings' className='link-'><h2>Movie Listings</h2></a>
        <p>Explore a wide range of movies.</p>
      </div>
      <div className="feature">
      <a href='/showtimes' className='link-'><h2>Showtimes</h2></a>
        <p>Check showtimes for your favorite movies.</p>
      </div>
      {/*
      <div className="feature">
      <a href='/booktickets' className='link-'><h2>Book Tickets</h2></a>
        <p>Book tickets online and save time.</p>
      </div>
  */}
      <div className="feature">
      <a href='/memberships' className='link-'><h2>Membership</h2></a>
        <p>{!auth.isAuthenticated || (auth.isAuthenticated && auth.role === 'guest') ? 'Become a member and enjoy a variety of perks.' : 'Check out your member perks.'}</p>
      </div>
    </section>
  );
};

export default Features;