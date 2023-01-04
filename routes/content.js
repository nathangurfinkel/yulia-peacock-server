/** appointment.js
 * Description: This file contains the routes for the content mongo collection.
 *
 * Author: Nathan Gurfinkel
 */

/**
 * @api {get} /content Get all content
 * @apiName GetAllContent
 * @apiGroup Content
 * @apiVersion 1.0.0
 * @apiDescription Get all content
 * @apiSuccess {String} _id Content id
 * @apiSuccess {String} title Content title
 * @apiSuccess {String} body Content body
 *
 */

const express = require('express');
const recordRoutes = express.Router();
const dbo = require('../db/conn');

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require('mongodb').ObjectId;

// get all content
recordRoutes.route('/content').get(function (req, res) {
  let db_connect = dbo.getDb('yulia_peacock');
  db_connect
    .collection('content')
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// get content by id
recordRoutes.route('/content/:id').get(function (req, res) {
  let db_connect = dbo.getDb('yulia_peacock');
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection('content').findOne(myquery, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

// create content
recordRoutes.route('/content/add').post(function (req, response) {
  let db_connect = dbo.getDb('yulia_peacock');
  let myobj = {
    col: req.body.col,
    body: req.body.body,
    image: req.body.image,
  };
  db_connect.collection('content').insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});
// update content
recordRoutes.route('/content/update/:id').post(function (req, response) {
  let db_connect = dbo.getDb('yulia_peacock');
  let myquery = { _id: ObjectId(req.params.id) };
  let newvalues = {
    $set: {
      col : req.body.col,
      body: req.body.body,
      image: req.body.image,
    },
  };
  db_connect
    .collection('content')
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      response.json(res);
    });
});

module.exports = recordRoutes;

