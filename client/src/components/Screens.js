import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Header from "./Header";
import '../App.css';

const ScreenListings = () => {
  const [screens, setScreens] = useState([]);
  const [theatre, setTheatre] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/screens?theatreid=${id}`);
      const data = await response.json();
      setScreens(data);
    };

    const fetchTheatre = async () => {
        const response = await fetch(`/theatres/${id}`);
        const data = await response.json();
        setTheatre(data);
      };
  

    fetchData().catch(console.error);
    fetchTheatre().catch(console.error);
  }, [id]);

  const handleDelete = async (screenId) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`/screens/${screenId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            },
          });
          if (response.ok) {
            setScreens(screens.filter((screen) => screen._id !== screenId));
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

  const handleUpdate = (screenId) => {
    navigate(`/update-screen/${screenId}`);
  };

  

  return (
    <div className="mainListing">
      <Header />
      <center>{theatre.theatreName}</center>
      <ul className="movies-list">
        
        {screens.map((screen) => (
          <li key={screen._id} className="movie-tile">
            
            <div>
              <h2>Screen Number: {screen.screen_no}</h2>
              <p>Seat Rows: {screen.rows}</p>
              <p>Seat Cols: {screen.cols}</p>
              <div className="admin-controls">
                  <button onClick={() => handleUpdate(screen._id)}>Update</button>
                  <button onClick={() => handleDelete(screen._id)}>Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScreenListings;
