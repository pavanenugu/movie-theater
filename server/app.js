const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Theatres = require('./models/theatresModel');
const Users = require('./models/usersModel');
const Members = require('./models/membersModel');
const Movies = require('./models/moviesModel');
const Screens = require('./models/screensModel');
const Showtimes = require('./models/showtimesModel');
const Tickets = require('./models/ticketsModel');
const theatresRoutes = require('./endpointRoutes/theatresEndpoint');
const registrationRoutes = require('./endpointRoutes/registrationEndpoint');
const regularMembersRoutes = require('./endpointRoutes/regularMembersEndpoint');
const premiumMembersRoutes = require('./endpointRoutes/premiumMembersEndpoint');
const moviesRoutes = require('./endpointRoutes/moviesEndpoint');
const screensRoutes = require('./endpointRoutes/screensEndpoint');
const showtimesRoutes = require('./endpointRoutes/showtimesEndpoint');
const ticketsRoutes = require('./endpointRoutes/ticketsEndpoint');
const signInRoutes = require('./endpointRoutes/SignInEndpoint');
const analyticsRoutes = require('./endpointRoutes/analyticsEndpoint');
const verifyTokenRoutes = require('./endpointRoutes/verifyTokenEndpoint');
const memberRoutes = require('./endpointRoutes/memberEndpoint');


const cors = require('cors');
const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());

app.use(moviesRoutes);
app.use(registrationRoutes);
app.use(regularMembersRoutes);
app.use(premiumMembersRoutes);
app.use(theatresRoutes);
app.use(screensRoutes);
app.use(showtimesRoutes);
app.use(ticketsRoutes);
app.use(signInRoutes);
app.use(analyticsRoutes);

app.use(verifyTokenRoutes);
app.use(memberRoutes);
module.exports = app;
