import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";

const MovieListings = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch("/movie-analytics")
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
      })
      .catch((error) =>
        console.error("There was an error fetching movies:", error)
      );
  }, []);


  return (
    <div className="mainListing">
      <Header />
      <ul className="movies-list">
        {movies.map((movie) => (
          <li key={movie._id} className="movie-tile">
            
              <img
                src={movie.img}
                alt={movie.movieName}
                className="movie-image"
              />
            <div>
              <h2>{movie.movieName}</h2>
              <p>Booked Seats: {movie.bookedseats}</p>
              <p>Total Seats: {movie.totalseats}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieListings;
