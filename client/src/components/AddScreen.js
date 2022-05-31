import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "./Header";

function AddScreen() {

    const [theatres, setTheatres] = useState([]);
    const navigate = useNavigate();

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
    
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState({ m: "", t: "" });

    const token = localStorage.getItem('token');

    const registerApi = (body) => {
        return axios.post("/screens", body, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        });
    };

    const onAddScreen = useCallback(async (event, values) => {
        event.preventDefault();
        const data = event.target;
        const theatre_id = theatres.find(item => item.theatreName==data.theatreName.value)._id
        const body = {
          screen_no: data.screen_no.value,
          theatre_id: theatre_id,
          rows : data.rows.value,
          cols : data.cols.value,
        };

        try {
            const res = await registerApi(body);
            setMsg({ m: res.data.message, t: "success" });
            setOpen(true);
            alert("Screen added successfully");
            setTimeout(() => navigate("/addscreen"), 4000);
          } catch (e) {
            setMsg({ m: e.response.data.error, t: "error" });
            alert("Failer to add Screen");
            setOpen(true);
          }
        });

    return (
      <>
        <Header />
        <div className="auth-container">
          <h2>Add Screen to Theatre</h2>
          <form onSubmit={onAddScreen}> 

            <select name="theatreName">
                {theatres.map((theatre) => (
                    <option> {theatre.theatreName} </option>
                ))}
            </select>
  
            <input
              type="text"
              name="screen_no"
              placeholder="Screen Number"
              className="auth-input"
            />

            <input
              type="number"
              name="rows"
              placeholder="Rows"
              className="auth-input"
            />
            <input
              type="number"
              name="cols"
              placeholder="Columns"
              className="auth-input"
            />
            <button type="submit" className="auth-button">
              Submit
            </button>
          </form>
        </div>
      </>
    );
  }
  
  export default AddScreen;
  