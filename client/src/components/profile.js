import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const Profile = () => {
  const [memberData, setMemberData] = useState(null);
  const [movieHistory, setMovieHistory] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [ticketDetails, setTicketDetails] = useState([]);
  const [expandedTicket, setExpandedTicket] = useState(null);
  const { auth } = useAuth();

  //console.log("In Profile");
  //console.log(auth);
  const id = auth.id; // Adjust according to your auth object structure

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        // Fetch member details
        const response = await fetch(`/member/${id}/profile`);
        const memberData = await response.json();
        setMemberData(memberData);

        // Fetch movie history
        const historyResponse = await fetch(`/member/${id}/movie-history`);
        const historyData = await historyResponse.json();
        setMovieHistory(historyData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMemberData();
  }, [id]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // Fetch tickets purchased
        const ticketsResponse = await fetch(`/tickets`);
        const ticketsResponseData = await ticketsResponse.json();
        const filteredTickets = ticketsResponseData.filter((ticket) => ticket.memberid === id && ticket.memberid !== undefined);

        let memberTicketData = {};
        for (let i = 0; i < filteredTickets.length; i++) {
          console.log(filteredTickets[i]);
          const showtimeResponse = await fetch(
            `/showtimes/${filteredTickets[i].showid}`
          );
          const showtime = await showtimeResponse.json();
          
          const showDate = new Date(showtime.showDate).toISOString();
          const currentTime = new Date().toISOString();
          if (showDate < currentTime) {
            console.log('This movie already started: ' + showtime.movieid);
            continue;
          }

          const movieResponse = await fetch(`/movies/${showtime.movieid}`);
          const movieData = await movieResponse.json();

          memberTicketData[filteredTickets[i]._id] = {
            ticket: filteredTickets[i],
            show: showtime,
            movie: movieData,
          };
        }
        setTicketDetails(memberTicketData);
      } catch (error) {
        console.error("Error fetching member ticket data:", error);
      }
    };

    fetchTickets();
  }, [id, myTickets]);

  const toggleTickets = (ticketId) => {
    setExpandedTicket(expandedTicket === ticketId ? null : ticketId);
  };

  const handleCancel = async (ticketId) => {
    if (
      window.confirm(
        "Are you sure you want cancel your tickets for this movie?"
      )
    ) {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`/tickets/${ticketId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          setMyTickets((prevTickets) =>
            prevTickets.filter((ticket) => ticket._id !== ticketId)
          );

          setTicketDetails((prevDetails) => {
            const updatedDetails = { ...prevDetails };
            delete updatedDetails[ticketId];
            return updatedDetails;
          });

          alert(
            "Your tickets were cancelled successfully. Payment was refunded to the original method."
          );
          window.location.reload();
        } else {
          const data = await response.json();
          alert(data.message);
        }
      } catch (error) {
        console.error("There was an error cancelling your tickets:", error);
        alert("There was an error cancelling your ticket.");
      }
    }
  };

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      {memberData ? (
        <>
          <ul className="profile-details">
            <li>
              <strong>First Name:</strong> {memberData.firstName}
            </li>
            <li>
              <strong>Last Name:</strong> {memberData.lastName}
            </li>
            <li>
              <strong>Email:</strong> {memberData.email}
            </li>
            <li>
              <strong>Phone:</strong> {memberData.phone}
            </li>
            <li>
              <strong>Username:</strong> {memberData.username}
            </li>
            <li>
              <strong>Role:</strong> {memberData.role}
            </li>
            <li>
              <strong>Rewards:</strong> {memberData.rewards}
            </li>
          </ul>

          <h2>Past 30 Days Movie History</h2>
          <ul className="movie-history-list">
            {movieHistory.length > 0 ? (
              movieHistory.map((movie, index) => <li key={index}>{movie}</li>)
            ) : (
              <li>No recent movie history available.</li>
            )}
          </ul>

          <h2>My Tickets</h2>
          <ul className="purchased-tickets-list">
            {Object.keys(ticketDetails).length ? (
              Object.entries(ticketDetails).map(
                ([ticketId, { movie, show, ticket }]) => (
                  <li key={ticketId}>
                    <button onClick={() => toggleTickets(ticketId)}>
                      {movie.movieName} -{" "}
                      <i>
                        {show.showDate.split("-")[1]}/
                        {show.showDate.split("-")[2].substring(0, 2)}/
                        {show.showDate.split("-")[0]}
                      </i>
                      <span className="arrow">
                        {expandedTicket === ticketId ? "▲" : "▼"}
                      </span>
                    </button>
                    {expandedTicket === ticketId && (
                      <div className="ticket-expanded-tile">
                        <img
                          src={movie.img}
                          alt={movie.title}
                          className="movie-image"
                        />
                        <div>
                          <p>{movie.description}</p>
                          <p>
                            <strong>Time: </strong>
                            {show.showStartTime}
                          </p>
                          <p>
                            <strong>Seats: </strong>
                            {ticket.seatsBooked.join(",")}
                          </p>
                          <i>
                            {ticket.isPaymentViaRewards === true
                              ? "Purchased with rewards points."
                              : ""}
                          </i>
                        </div>
                      </div>
                    )}
                    {expandedTicket === ticketId && (
                      <div className="cancel-ticket">
                        <button onClick={() => handleCancel(ticketId)}>
                          Cancel Tickets
                        </button>
                      </div>
                    )}
                  </li>
                )
              )
            ) : (
              <li>You have no current movie tickets.</li>
            )}
          </ul>
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
