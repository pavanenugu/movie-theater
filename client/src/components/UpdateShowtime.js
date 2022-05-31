import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "./Header";
import '../App.css'; 

const UpdateShowtime = () => {
  const [showtime, setShowtime] = useState({
    movie_id: '',
    showDate: '',
    showStartTime: '',
    price: '',
    screen_id: '',
    seats_booked: []
  });
  const [date, setDate] = useState();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/showtimes/${id}`);
      const data = await response.json();
      setShowtime(data);
      const date = new Date(data.showDate);
      const formattedDate = date.toISOString().slice(0, 10);
      setDate(formattedDate);
    };

    fetchData().catch(console.error);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShowtime({ ...showtime, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/showtimes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(showtime)
      });
      const data = await response.json();
      if (response.ok) {
        alert('Showtime updated successfully!');
        navigate(`/showtimes`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('There was an error updating the showtime:', error);
      alert('There was an error updating the showtime.');
    }
  };

  return (
    <>
    <Header />
    <div className="update-movie-container">
      <h2>Update Showtime</h2>
      <form onSubmit={handleSubmit} className="update-movie-form">
        <div className="form-group">
          <label htmlFor="movieName">Show Date:</label>
          <input type="date" id="movieName" name="showDate" value={date} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="description">Price :</label>
          <input type="number" id="description" name="price" value={showtime.price} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="description">Show Start Time :</label>
          <input type="text" id="description" name="showStartTime" value={showtime.showStartTime} onChange={handleChange} />
        </div>
        
        <button type="submit" className="update-movie-btn">Update</button>
      </form>
    </div>
    </>
  );
};

export default UpdateShowtime;