// Dashboard.js
import React from "react";
//import Header from './Header';
import Hero from './Hero';
import Features from './Features';
import Footer from './Footer';

const Home = () => {
  return (
      <div className="App">
        {/* <Header /> */}
        <Hero />
        <Features />
        <Footer />
      </div>
  );
};

export default Home;