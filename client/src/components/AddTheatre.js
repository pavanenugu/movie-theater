import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "./Header";

function AddTheatre () {

    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState({ m: "", t: "" });

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const registerApi = (body) => {
        return axios.post("/theatres", body, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
    };

    const onAddTheatre = useCallback(async (event, values) => {
        event.preventDefault();
        const data = event.target;
        const body = {
          theatreName: data.theatreName.value,
          city: data.theatreLocation.value,
        };

        try {
            const res = await registerApi(body);
            setMsg({ m: res.data.message, t: "success" });
            setOpen(true);
            alert("Theatre added successfully");
            setTimeout(() => navigate("/addtheatre"), 4000);
          } catch (e) {
            setMsg({ m: e.response.data.error, t: "error" });
            alert("Failed to add Theatre");
            setOpen(true);
          }
        });


    return (
        <>
            <Header />
            <div className="auth-container">
                <h2>Add Theatre</h2>
                <form onSubmit={onAddTheatre}>
                    <input
                        type="text"
                        name="theatreName"
                        placeholder="Theatre name"
                        className="auth-input"
                    />
                    <input
                        type="text"
                        name="theatreLocation"
                        placeholder="Theatre Location"
                        className="auth-input"
                    />
                    <button type="submit" className="auth-button">Submit</button>
                </form>
            </div>
        </>
    );
}

export default AddTheatre;