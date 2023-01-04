/** resumes.js
 * Description: This file contains the routes for the resumes collection.
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
//   name: string,
// email: string,
// summary: string,
// skills: string[],
// activities: string[],
// awards: string[],
// experience: { company: string; title: string; description: string, startDate: string, endDate: string }[],
// education: { school: string; degree: string; field: string }[],
// phone: string
// }

// get all resumes
recordRoutes.route('/resumes').get(function (req, res) {
  // console.log('req', req);
  let db_connect = dbo.getDb('natangurfinkel');
  db_connect
    .collection('appointments')
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// get resume by id
recordRoutes.route('/resumes/:id').get(function (req, res) {
    let db_connect = dbo.getDb('natangurfinkel');
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect

        .collection('resumes')
        .findOne
        (myquery, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

// create resume
recordRoutes.route('/resumes/add').post(function (req, response) {
    let db_connect = dbo.getDb('natangurfinkel');
    let myobj = {
        identifier: req.body.identifier,

        name: req.body.name,
        email: req.body.email,
        summary: req.body.summary,
        skills: req.body.skills,
        activities: req.body.activities,
        awards: req.body.awards,
        experience: req.body.experience,
        education: req.body.education,
        phone: req.body.phone
    };
    db_connect.collection('resumes').insertOne(myobj, function (err, res) {
        if (err) throw err;
        response.json(res);
    });
});

// update resume
recordRoutes.route('/resumes/update/:id').post(function (req, response) {
    let db_connect = dbo.getDb('natangurfinkel');
    let myquery = { _id: ObjectId(req.params.id) };
    let newvalues = {
        $set: {
            identifier: req.body.identifier,
            name: req.body.name,
            email: req.body.email,
            summary: req.body.summary,
            skills: req.body.skills,
            activities: req.body.activities,
            awards: req.body.awards,
            experience: req.body.experience,
            education: req.body.education,
            phone: req.body.phone
        }
    };
    db_connect.collection('resumes').

        update
        (myquery, newvalues, function (err, res) {
            if (err) throw err;
            response.json(res);
        });
});

// delete resume
recordRoutes.route('/resumes/delete/:id').delete(function (req, response) {
    let db_connect = dbo.getDb('natangurfinkel');
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect.collection('resumes').deleteOne(myquery, function (err, res) {
        if (err) throw err;
        response.json(res);
    });
});


    

module.exports = recordRoutes;
