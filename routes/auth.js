// auth.js allows two endpoints : signup and signin

// signup creates a new user in the mongo database

// signin checks if the user exists in the database and returns a JWT token



const express = require('express');
const recordRoutes = express.Router();
const dbo = require('../db/conn');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require('mongodb').ObjectId;

// signup

recordRoutes.route('/signup').post(function (req, response) {
    let db_connect = dbo.getDb('yulia_peacock');
    let myobj = {
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    };
    db_connect.collection('users').insertOne(myobj, function (err, res) {
        if (err) throw err;
        response.json(res);
    });
    }
);

// signin

recordRoutes.route('/signin').post(function (req, response) {


    let db_connect = dbo.getDb('yulia_peacock');
    let myquery = { email: req.body.email };
    db_connect.collection('users').findOne

(myquery, function (err, result) {


        if (err) throw err;
        if (!result) return response.status(404).send('No user found.');
        let passwordIsValid = bcrypt.compareSync(req.body.password, result.password);
        if (!passwordIsValid) return response.status(401).send({ auth: false, token: null });
        let token = jwt.sign({ id: result._id }, 'secret', {
            expiresIn: 86400 // expires in 24 hours
        });
        response.status(200).send({ auth: true, token: token });
    });
});



module.exports = recordRoutes;


// Path: routes\auth.js

