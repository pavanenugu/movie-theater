// Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <Link to={`/contactus`}>Contact us &nbsp;</Link>
      <Link to={'/about'} >About</Link>
      <p>&copy; 2023 Movie Theatre</p>
    </footer>
  );
};

export default Footer;
