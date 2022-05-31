// Hero.js
import React from 'react';
import { useNavigate } from "react-router-dom";

const Hero = () => {

  const navigate = useNavigate()
  const sayBye = (event) => {
    navigate("/movielistings")
  }

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Welcome to Movie Theatre</h1>
        <p>Discover the latest movies and showtimes.</p>
        <button onClick={sayBye} >Get Started</button>
      </div>
    </section>
  );
};

export default Hero;
