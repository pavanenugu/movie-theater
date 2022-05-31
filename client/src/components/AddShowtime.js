import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "./Header";

function AddShowtime() {

    const [movies, setMovies] = useState([]);
    const [theatres, setTheatres] = useState([]);
    const [screens, setScreens] = useState([]);
    const [theatre_id, setTheatreID] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/movies")
        .then((response) => response.json())
        .then((data)=>{
            setMovies(data);
        })
        .catch((error) =>
            console.log("There was error fetching movies data", error)
        );
    },[]);

    useEffect(() => {
        fetch("/theatres")
            .then((response) => response.json())
            .then((data)=>{
                setTheatres(data);
            })
            .catch((error) =>
            console.log("There was error fetching theatres data", error)
            );
    }, []);

    const getScreens = useCallback(async (event, values) => {
        event.preventDefault();
        const data = event.target.value;
        const theatre_id = theatres.find(item => item.theatreName==data)
        setTheatreID(theatre_id._id);
    });

    useEffect(() => {
        if (theatre_id) {
            fetch(`/screens?theatreid=${ theatre_id }`)
                .then((response) => response.json())
                .then((data)=>{
                    setScreens(data);
                })
                .catch((error) =>
                console.log("There was error fetching screens data", error)
                );
        }
    }, [theatre_id]);

    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState({ m: "", t: "" });
    const token = localStorage.getItem('token');
    const registerApi = (body) => {
        return axios.post("/showtimes", body, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
    };

    const onAddShowtime = useCallback(async (event, values) => {
        event.preventDefault();
        const data = event.target;
        const movieid = movies.find(item => item.movieName==data.movieName.value)._id
        const screenid = screens.find(item => item.screen_no==data.screenNo.value)._id
        const body = {
          movieid: movieid,
          showDate: data.showDate.value,
          showStartTime : data.showStartTime.value,
          price : data.price.value,
          screen_id : screenid,
        };

        try {
            const res = await registerApi(body);
            setMsg({ m: res.data.message, t: "success" });
            setOpen(true);
            alert("Showtime added successfully");
            setTimeout(() => navigate("/addshowtime"), 4000);
          } catch (e) {
            setMsg({ m: e.response.data.error, t: "error" });
            alert("Failer to add showtime");
            setOpen(true);
          }
        });

    return (
        <>
            <Header />
            <div className="auth-container">
                <h2>Add Showtime</h2>
                <form onSubmit={onAddShowtime}>
                <select name="movieName">
                    {movies.map((movie) => (
                        <option> {movie.movieName} </option>
                    ))}
                </select>
                    <input
                        type="date"
                        name="showDate"
                        placeholder="Show Date"
                        className="auth-input"
                    />
                    <input
                        type="text"
                        name="showStartTime"
                        placeholder="Show Start Time"
                        className="auth-input"
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        className="auth-input"
                    />
                    <select name="theatreName" onChange={getScreens}>
                        {theatres.map((theatre) => (
                            <option> {theatre.theatreName} </option>
                        ))}
                    </select>
                    
                    <select name="screenNo">
                        {screens.map((screen) => (
                            <option> {screen.screen_no} </option>
                        ))}
                    </select>

                    <button type="submit" className="auth-button">Submit</button>
                </form>
            </div>
        </>
    );
}

export default AddShowtime;
