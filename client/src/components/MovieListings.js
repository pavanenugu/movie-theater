import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext'; // Import useAuth

const MovieListings = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [showUpcoming, setShowUpcoming] = useState(false);
  const navigate = useNavigate();
  const { auth } = useAuth(); // Use the hook to access auth state

  useEffect(() => {
    fetch("/movies")
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
        setFilteredMovies(data.filter((movie) => movie.status !== "upcoming"));
      })
      .catch((error) => console.error("There was an error fetching movies:", error));
  }, []);

  const handleUpcomingFilter = () => {
    setShowUpcoming(!showUpcoming);
    setFilteredMovies(showUpcoming ? movies.filter((movie) => movie.status !== "upcoming") : movies.filter((movie) => movie.status === "upcoming"));
  };

  const handleDelete = async (movieId) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`/movies/${movieId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          setFilteredMovies(filteredMovies.filter((movie) => movie._id !== movieId));
        } else {
          const data = await response.json();
          alert(data.message);
        }
      } catch (error) {
        console.error("There was an error deleting the movie:", error);
        alert("There was an error deleting the movie.");
      }
    }
  };

  const handleUpdate = (movieId) => {
    navigate(`/update-movie/${movieId}`);
  };

  return (
    <div className="mainListing">
      <button onClick={handleUpcomingFilter} className="filter-button">
        {showUpcoming ? "Show Current Movies" : "Show Upcoming Movies"}
      </button>
      <ul className="movies-list">
        {filteredMovies.map((movie) => (
          <li key={movie._id} className="movie-tile">
            {/* Wrap movie details in a Link component */}
            <Link to={`/movie/${movie._id}`}>
              <img
                src={movie.img}
                alt={movie.movieName}
                className="movie-image"
              />
            </Link>
            <div>
              <h2>{movie.movieName}</h2>
              <p>Status: {movie.status}</p>
              <p>Description: {movie.description.length > 250 ? `${movie.description.substring(0, 200)}...` : movie.description}</p>
              {auth.isAuthenticated && auth.role === 'admin' && (
                <div className="admin-controls">
                  <button onClick={() => handleUpdate(movie._id)}>Update</button>
                  <button onClick={() => handleDelete(movie._id)}>Delete</button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieListings;