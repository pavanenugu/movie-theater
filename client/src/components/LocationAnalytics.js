import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";

const LocationAnalytics = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetch("/location-analytics")
      .then((response) => response.json())
      .then((data) => {
        setLocations(data);
      })
      .catch((error) =>
        console.error("There was an error fetching movies:", error)
      );
  }, []);


  return (
    <div className="mainListing">
      <Header />
      <center><h1>Location Analytics</h1></center>
      <ul className="movies-list">
        {locations.map((city) => (
          <li key={city.location} className="movie-tile">
            <div className="theatre-tile">
              <h2>{city.location}</h2>
              <p>Booked Seats: {city.bookedseats}</p>
              <p>Total Seats: {city.totalseats}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LocationAnalytics;
