import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../App.css'; // Make sure this path is correct based on your project structure

const UpdateMovie = () => {
  const [movie, setMovie] = useState({
    movieName: '',
    status: '',
    description: '',
    language: '',
    length: '',
    rating: '',
    date: '',
    img: ''
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/movies/${id}`);
      const data = await response.json();
      setMovie(data);
    };

    fetchData().catch(console.error);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie({ ...movie, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/movies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(movie)
      });
      const data = await response.json();
      if (response.ok) {
        alert('Movie updated successfully!');
        navigate('/movielistings');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('There was an error updating the movie:', error);
      alert('There was an error updating the movie.');
    }
  };

  return (
    <div className="update-movie-container">
      <h2>Update Movie</h2>
      <form onSubmit={handleSubmit} className="update-movie-form">
        {/* Movie Name */}
        <div className="form-group">
          <label htmlFor="movieName">Movie Name:</label>
          <input type="text" id="movieName" name="movieName" value={movie.movieName} onChange={handleChange} />
        </div>
        {/* Status */}
        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select id="status" name="status" value={movie.status} onChange={handleChange}>
            <option value="showing">Showing</option>
            <option value="upcoming">Upcoming</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" value={movie.description} onChange={handleChange} />
        </div>
        {/* Language */}
        <div className="form-group">
          <label htmlFor="language">Language:</label>
          <input type="text" id="language" name="language" value={movie.language} onChange={handleChange} />
        </div>
        {/* Length */}
        <div className="form-group">
          <label htmlFor="length">Length:</label>
          <input type="text" id="length" name="length" value={movie.length} onChange={handleChange} />
        </div>
        {/* Rating */}
        <div className="form-group">
          <label htmlFor="rating">Rating:</label>
          <input type="text" id="rating" name="rating" value={movie.rating} onChange={handleChange} />
        </div>
        {/* Release Date */}
        <div className="form-group">
          <label htmlFor="date">Release Date:</label>
          <input type="text" id="date" name="date" value={movie.date} onChange={handleChange} />
        </div>
        {/* Image URL */}
        <div className="form-group">
          <label htmlFor="img">Image URL:</label>
          <input type="text" id="img" name="img" value={movie.img} onChange={handleChange} />
        </div>
        {/* Submit Button */}
        <button type="submit" className="update-movie-btn">Update Movie</button>
      </form>
    </div>
  );
};

export default UpdateMovie;