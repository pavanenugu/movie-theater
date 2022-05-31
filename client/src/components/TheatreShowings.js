import React, { useState, useEffect } from "react";

import { useParams, Link } from "react-router-dom";

const TheatreShowings = () => {
  const [theatre, setTheatre] = useState([]);
  const [movieShowtimes, setMovieShowtimes] = useState([]);
  const [expandedMovieId, setExpandedMovieId] = useState(null);
  const { theatreId } = useParams();

  useEffect(() => {
    const fetchTheatreShowings = async () => {
      try {
        const theatreResponse = await fetch(`/theatres/${theatreId}`);
        const theatreData = await theatreResponse.json();
        setTheatre(theatreData);

        let movies = {};
        const moviesResponse = await fetch(
          `/locations/${theatre.city}?theatreid=${theatreId}`
        );
        const moviesData = await moviesResponse.json();
        for (let i = 0; i < moviesData.length; i++) {
          const movieShowsData = await fetch(
            `/locations/${theatre.city}?theatreid=${theatreId}&movieid=${moviesData[i]._id}`
          );
          const movieShows = await movieShowsData.json();
          movies[moviesData[i]._id] = {
            movie: moviesData[i],
            showtimes: movieShows,
          };
        }
        setMovieShowtimes(movies);
        console.log(movies);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchTheatreShowings();
  }, [theatreId]);

  const toggleShowtimes = (movieId) => {
    setExpandedMovieId(expandedMovieId === movieId ? null : movieId);
  };

  return (
    <div>
      {/* Theatre information */}
      <div className="hero">
        <h1>{theatre.theatreName}</h1>
        <p>
          <i>{theatre.city}</i>
        </p>
      </div>
      {/* Movies and Showtimes information */}
      <input type="date"/>
      <div>
        {Object.keys(movieShowtimes).length ? (
          Object.entries(movieShowtimes).map(([movieId, movieData]) => (
            <div key={movieId} className="movie">
              <div className="movie-tile-with-showtimes">
                <img
                  src={movieData.movie.img}
                  alt={movieData.movie.title}
                  className="movie-image"
                />
                <div>
                  <h2>{movieData.movie.movieName}</h2>
                  <p>Status: {movieData.movie.status}</p>
                  <p>Description:</p>
                  <p>
                    {movieData.movie.description.length > 250
                      ? `${movieData.movie.description.substring(0, 200)}...`
                      : movieData.movie.description}
                  </p>
                </div>
              </div>
              <div>
                <button
                  onClick={() => toggleShowtimes(movieId)}
                  className="show-date"
                >
                  Showtimes
                  <span className="arrow">
                    {expandedMovieId === movieId ? "▲" : "▼"}
                  </span>
                </button>
                {expandedMovieId === movieId && (
                  <div className="showtimes1">
                    {movieData.showtimes.map((showtime, index) => (
                      <Link
                      key={index}
                      to={`/seating/${showtime._id}`}
                      className="showtime-link"
                    >
                      {/* <span>{showtime.showDate}</span> */}
                      
                      <span>{showtime.showStartTime}</span>
                    </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No movies playing at this theatre.</p>
        )}
      </div>
    </div>
  );
};

export default TheatreShowings;
