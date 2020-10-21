const mongoose = require("mongoose");
const express = require("express");
const app = express(); // Creates app object that can be configured with routes to listen for incoming requests
const db = require("./config/keys").mongoURI; // String needed to connect to MongoDB
const bodyParser = require('body-parser'); // Used to parse data from requests
const passport = require('passport'); // Used for authentication

const users = require("./routes/api/users"); // users router
const books = require("./routes/api/books"); // books router
const reviews = require("./routes/api/reviews"); // reviews router

mongoose // Mongoose connecting to database takes mongoURI, and configuration objects
    .connect(db, { useUnifiedTopology: true }, { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch(err => console.log(err));

// Tells our app to respond to JSON requests, and also respond to requests from other software like Postman  
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/users", users); // If a request matches route in first argument, send router in second argument
app.use("/api/books", books);
app.use("/api/reviews", reviews);

app.use(passport.initialize());

require('./config/passport')(passport);

const port = process.env.PORT || 5000; // If ever deployed to heroku in production, heroku will use PORT variable

app.listen(port, () => console.log(`Server is running on port ${port}`)); // app object will listen on port variable