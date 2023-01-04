/** server.js
 *
 * Description: This is the main server file for the application.
 *
 * Author: Nathan Gurfinkel
 *
 */

// initialize express
const jwt = require("jsonwebtoken");

const express = require('express');
const app = express();
app.use(express.json());

// import modules
const listEndpoints = require('express-list-endpoints');
const path = require('path');
const cors = require('cors');
require('dotenv').config({ path: './config.env' });

// set up port
const port = process.env.PORT || 3001;

//cors
app.use(cors());
app.options('*', cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// routes

app.use('/api', require('./routes/Router'));


// driver for connecting to MongoDB
const dbo = require('./db/conn');

// root returns a list of all endpoints
app.get('/', (req, res) => {
  res.send(listEndpoints(app));
});

// start the server
app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});
