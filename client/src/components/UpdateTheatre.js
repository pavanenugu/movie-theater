import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "./Header";
import '../App.css'; 

const UpdateTheatre = () => {
  const [theatre, setTheatre] = useState({
    theatreName: '',
    city: '',
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/theatres/${id}`);
      const data = await response.json();
      setTheatre(data);
    };

    fetchData().catch(console.error);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTheatre({ ...theatre, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/theatres/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(theatre)
      });
      const data = await response.json();
      if (response.ok) {
        alert('Theatre updated successfully!');
        navigate('/theatrelocations');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('There was an error updating the theatre:', error);
      alert('There was an error updating the theatre.');
    }
  };

  return (
    <>
    <Header />
    <div className="update-movie-container">
      <h2>Update Movie</h2>
      <form onSubmit={handleSubmit} className="update-movie-form">
        <div className="form-group">
          <label htmlFor="movieName">Theatre Name:</label>
          <input type="text" id="movieName" name="theatreName" value={theatre.theatreName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="description">Location:</label>
          <input id="description" name="city" value={theatre.city} onChange={handleChange} />
        </div>
        <button type="submit" className="update-movie-btn">Update Theatre</button>
      </form>
    </div>
    </>
  );
};

export default UpdateTheatre;