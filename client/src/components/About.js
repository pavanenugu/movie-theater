
// About.js
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
//import Header from "./Header";
const About = () => {
  return (
    <>
    {/* <Header /> */}
    <div className="container mt-5">
      <h1 className="text-center">Welcome to Silver Screen Cinemas</h1>

      <div className="mt-4">
        <h2>Our Mission and Values</h2>
        <p>
          At Silver Screen Cinemas, our mission is simple: to transport our audience into the world of captivating stories, larger-than-life visuals, and unforgettable moments. We value the joy of shared experiences, the thrill of storytelling, and the magic that happens when the lights dim and the movie begins.
        </p>
      </div>

      <div className="mt-4">
        <h2>Facility Information</h2>
        <ul>
          <li><strong>Location:</strong> 123 Movie Lane, Cityville, State, 12345</li>
          <li><strong>Screens:</strong> 5 state-of-the-art screens</li>
          <li><strong>Special Features:</strong> IMAX, Dolby Atmos, 3D capabilities</li>
        </ul>
      </div>

      {/* Other sections go here */}

    </div></>
  );
};

export default About;