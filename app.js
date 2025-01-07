require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');

require('./db/db')();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRoutes);
app.use("/captains", captainRoutes);
app.get("/", (req, res) => {
    res.send("Welcome to the backend server");
});

module.exports = app;
