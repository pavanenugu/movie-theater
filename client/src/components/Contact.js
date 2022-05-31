
// Contact.js
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
//import Header from "./Header";

function Contact() {
    return (
        <>
        {/* <Header /> */}
        <div className="container mt-5">
      <h1 className="text-center">Get in Touch with Silver Screen Cinemas</h1>

      <div className="mt-4">
        <h2>Address</h2>
        <p>123 Movie Lane<br />Cityville, State, 12345</p>
      </div>

      <div className="mt-4">
        <h2>Phone</h2>
        <p>(555) 123-4567</p>
      </div>

      <div className="mt-4">
        <h2>Email</h2>
        <p>info@silverscreencinemas.com</p>
      </div>

      {/* Other sections go here */}

    </div></>
    );
}

export default Contact;