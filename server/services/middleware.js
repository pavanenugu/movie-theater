const Members = require("../models/membersModel");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const memberAuth = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    console.log("secret");
    if (!authHeader) return res.sendStatus(403);
    console.log(authHeader); // Bearer token
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "secret", (err, decoded) => {
      console.log("verifying");
      if (err) return res.sendStatus(403); //invalid token
  
      console.log(decoded); //for correct token
      next();
    });
  };
  
  /**
   * @DESC Check Role Middleware
   */
  const checkRole = (roles) => async (req, res, next) => {
    let { name } = req.body;
  
    //retrieve member info from DB
    const member = await Members.findOne({ name });
    !roles.includes("admin")
      ? res.status(401).json("Sorry you do not have access to this route")
      : next();
  };

  module.exports = { memberAuth: memberAuth, checkRole: checkRole};