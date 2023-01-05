// auth.js allows two endpoints : signup and signin

// signup creates a new user in the mongo database

// signin checks if the user exists in the database and returns a JWT token


const express = require('express');
const recordRoutes = express.Router();
const dbo = require('../db/conn');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secret = 'kL4Z4Ggfh5K7JvBBapQ947y9c68gGJY7';

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require('mongodb').ObjectId;

// signup

recordRoutes.route('/signup').post(function (req, response) {
    let db_connect = dbo.getDb('yulia_peacock');
    let hashedPassword = bcrypt.hashSync(req.body.password, 8);
    let myobj = {
        
        email: req.body.email,
        password: hashedPassword,
    };
    //check if user exists in the database by email then create user if not
    let myquery = { email: req.body.email };
    db_connect.collection('users').
findOne(myquery, function (err, result) {

        if (err) throw err;
        if (result) return response.status(404).send('User already exists.');
        db_connect.collection('users').insertOne(myobj, function (err, res) {
            if (err) throw err;
            response.json(res);
        });
    });
});


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
        let token = jwt.sign({ id: result._id }, secret, {
            expiresIn: 720 * 60 * 60
        });
        //get expiresAt from token
        let decoded = jwt.decode(token);
        let expiresAt = decoded.exp * 1000;

        response.status(200).send({ userId: result._id, token: token, expiresAt: expiresAt });
    });//   code: 'ERR_HTTP_HEADERS_SENT' this is  waht i get from the above code



});

//get user id by token




module.exports = recordRoutes;


// Path: routes\auth.js

