const mongoose = require("mongoose");
const express = require("express");
const app = express();
const db = require("./config/keys").mongoURI;
const bodyParser = require('body-parser');
const passport = require('passport');


const users = require("./routes/api/users");
const books = require("./routes/api/books");
const reviews = require("./routes/api/reviews");
const User = require("./models/User");

mongoose
    .connect(db, { useUnifiedTopology: true }, { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Hello Wocsdrld"));

app.use("/api/users", users);
app.use("/api/books", books);
app.use("/api/reviews", reviews);

app.use(passport.initialize());


require('./config/passport')(passport);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));