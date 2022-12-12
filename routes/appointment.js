/** appointment.js
 * Description: This file contains the routes for the appointment collection.
 * 
 * Author: Nathan Gurfinkel
 */

const express = require('express');
const recordRoutes = express.Router();
const dbo = require('../db/conn');

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require('mongodb').ObjectId;

//  example of appointment schema
// {
//     "name": "Nathan Gurfinkel",
//     "email": "natan.gurfinkel@gmail.com",
//     "phonenumber": "+972542197713",
//     "date": "2022-12-12",
//     "time": "10:30"
// }

// get all appointments
recordRoutes.route('/appointments').get(function (req, res) {
  // console.log('req', req);
  let db_connect = dbo.getDb('yulia_peacock');
  db_connect
    .collection('appointments')
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// get appointment by id
recordRoutes.route('/appointments/:id').get(function (req, res) {
  let db_connect = dbo.getDb('yulia_peacock');
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect
    .collection('appointments')
    .findOne(myquery, function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// create appointment
recordRoutes.route('/appointments/add').post(function (req, response) {
  let db_connect = dbo.getDb('yulia_peacock');
  let myobj = {
    name: req.body.name,
    email: req.body.email,
    tel: req.body.tel,
    date: req.body.date,
    time: req.body.time,
  };
  db_connect.collection('appointments').insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// update appointment
recordRoutes.route('/appointments/update').patch(function (req, response) {
  let db_connect = dbo.getDb('yulia_peacock');
  let myquery = { _id: ObjectId(req.query.id) };
  let newvalues = { $set: { name: req.body.name, time: req.body.time } };
  db_connect
    .collection('appointments')
    .update(myquery, newvalues, function (err, res) {
      if (err) throw err;
      response.json(res);
    });
});

// delete appointment
recordRoutes.route('/appointments/delete/:id').delete(function (req, res) {
  let db_connect = dbo.getDb('yulia_peacock');
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection('appointments').deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    res.json(obj);
  });
});

module.exports = recordRoutes;
