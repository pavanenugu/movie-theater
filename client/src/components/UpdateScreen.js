import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "./Header";
import '../App.css'; 

const UpdateScreen = () => {
  const [screen, setScreen] = useState({
    screen_no: '',
    theatre_id: '',
    rows: '',
    cols: '',
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/screens/${id}`);
      const data = await response.json();
      setScreen(data);
    };

    fetchData().catch(console.error);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScreen({ ...screen, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/screens/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(screen)
      });
      const data = await response.json();
      if (response.ok) {
        alert('Screen updated successfully!');
        navigate(`/screens/${screen.theatre_id}`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('There was an error updating the screen:', error);
      alert('There was an error updating the screen.');
    }
  };

  return (
    <>
    <Header />
    <div className="update-movie-container">
      <h2>Update Screen</h2>
      <form onSubmit={handleSubmit} className="update-movie-form">
        <div className="form-group">
          <label htmlFor="movieName">Screen Number:</label>
          <input type="text" id="movieName" name="screen_no" value={screen.screen_no} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="description">Seat rows :</label>
          <input id="description" name="rows" value={screen.rows} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="description">Seat cols :</label>
          <input id="description" name="cols" value={screen.cols} onChange={handleChange} />
        </div>
        <button type="submit" className="update-movie-btn">Update Screen</button>
      </form>
    </div>
    </>
  );
};

export default UpdateScreen;