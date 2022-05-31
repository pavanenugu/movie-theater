import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';


const Showtimes = () => {
  const [moviesWithShowtimes, setMoviesWithShowtimes] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // New state for tracking loading
  const navigate = useNavigate();
  const { auth } = useAuth();

  useEffect(() => {
    const fetchMoviesAndShowtimes = async () => {
      try {
        setIsLoading(true); // Start loading
        // Fetch all movies
        const moviesResponse = await axios.get("/movies");
        const movies = moviesResponse.data;
        // Parallelize fetching theaters and showtimes for each movie
        const moviesPromises = movies.map(async (movie) => {
          const theatresResponse = await axios.get(
            `/movies?movieid=${movie._id}`
          );
          const theatres = theatresResponse.data;

          // Fetch showtimes for each theatre in parallel
          const theatrePromises = theatres.map(async (theatre) => {
            const showtimesResponse = await axios.get(
              `/movies?movieid=${movie._id}&theatreid=${theatre._id}`
            );
            theatre.showtimes = showtimesResponse.data;
            return theatre;
          });

          movie.theatres = await Promise.all(theatrePromises);
          return movie;
        });
        const combinedData = await Promise.all(moviesPromises);
        setMoviesWithShowtimes(combinedData);
      } catch (error) {
        console.error("Error fetching movies and showtimes:", error);
      } finally {
        setIsLoading(false); // Stop loading once data is fetched or an error occurs
      }
    };

    fetchMoviesAndShowtimes();
  }, []);
  const formatDateAndTime = (isoString) => {
    const date = new Date(isoString);
    const formattedDate = date.toISOString().slice(0, 10); // formats date
    return { formattedDate };
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center', marginTop: '20px' }}>Loading...</div>;
  }

  const handleDelete = async (showId) => {
    if (window.confirm("Are you sure you want to delete this showtime?")) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/showtimes/${showId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
        if (response.ok) {
          window.location.reload();
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

  const handleUpdate = (showId) => {
    navigate(`/update-showtime/${showId}`);
  };


  return (
    <>
      <div className="showtimes-container">
        <h1>All Movies and Showtimes</h1>
        {moviesWithShowtimes.map((movie) => (
          <div key={movie._id} className="movie-entry">
            <h2 className="movie-title">{movie.movieName}</h2>
            <img
              src={movie.img}
              alt={movie.movieName}
              className="movie-poster"
            />
            {movie.theatres.map((theatre) => (
              <div key={theatre._id} className="theatre-entry">
                <h3 className="theatre-name">{theatre.theatreName}</h3>
                <ul className="showtime-list">
                  {theatre.showtimes.map((showtime) => {
                    const { formattedDate} = formatDateAndTime(
                      showtime.showDate
                    );
                    return (
                      <li key={showtime._id} className="showtime-item">
                        <Link to={`/seating/${showtime._id}`}>
                          {formattedDate} at
                          {showtime.showStartTime}
                        </Link>
                        {auth.isAuthenticated && auth.role === 'admin' && (
                        <div className="admin-controls">
                          <button onClick={() => handleUpdate(showtime._id)}>Update</button>
                          <button onClick={() => handleDelete(showtime._id)}>Delete</button>
                        </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default Showtimes;