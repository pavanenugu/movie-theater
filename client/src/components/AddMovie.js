import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "./Header";



function AddMovie() {

    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState({ m: "", t: "" });

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const registerApi = (body) => {
        return axios.post("/movies", body, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
    };

    const onAddMovie = useCallback(async (event, values) => {
        event.preventDefault();
        const data = event.target;
        const body = {
            movieName: data.movieName.value,
            status: data.status.value,
            description: data.description.value,
            language: data.language.value,
            length: data.length.value,
            rating: data.rating.value,
            date: data.date.value,
            img: data.img.value
        };
        

        try {
            const res = await registerApi(body);
            console.log(res);
            setMsg({ m: res.data.message, t: "success" });
            setOpen(true);
            alert("Movie added successfully");
            setTimeout(() => navigate("/addtheatre"), 4000);
          } catch (e) {
            alert("Falied to add Movie");
            setMsg({ m: e.response.data.error, t: "error" });
            setOpen(true);
          }
        });


    return (
        <>
            <Header />
            <div className="auth-container">
                <h2>Add Movie</h2>
                <form onSubmit={onAddMovie}>
                    <input
                        type="text"
                        name="movieName"
                        placeholder="Movie name"
                        className="auth-input"
                    />
                    <input
                        type="text"
                        name="status"
                        placeholder="Status"
                        className="auth-input"
                    />
                    <input
                        type="textfield"
                        name="description"
                        placeholder="Description"
                        className="auth-input"
                    />
                    <input
                        type="text"
                        name="language"
                        placeholder="Language"
                        className="auth-input"
                    />
                    <input
                        type="text"
                        name="length"
                        placeholder="length"
                        className="auth-input"
                    />
                    <input
                        type="text"
                        name="rating"
                        placeholder="Rating"
                        className="auth-input"
                    />
                    <input
                        type="text"
                        name="date"
                        placeholder="Relese date (mm/dd/yyyy)"
                        className="auth-input"
                    />
                    <input
                        type="text"
                        name="img"
                        placeholder="Image URL"
                        className="auth-input"
                    />
                    <button type="submit" className="auth-button">Submit</button>
                </form>
            </div>
        </>
    );
}

export default AddMovie;