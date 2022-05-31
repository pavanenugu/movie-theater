import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/locations")
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((error) =>
        console.error("There was an error fetching theatres: ", error)
      );
  }, []);

  return (
    <div>
      <div className="hero"><h1>Locations</h1></div>
      <ul>
        {locations.map((location) => (
          <div className="theatre-tile">
            <li key={location}>
              <Link to={`/theatres/${location}`}>
                {location}
              </Link>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Locations;