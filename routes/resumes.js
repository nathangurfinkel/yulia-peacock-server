/** resumes.js
 * Description: This file contains the routes for the resumes collection.
 *
 * Author: Nathan Gurfinkel
 */
const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const jwt = require("jsonwebtoken");
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
const secret = "kL4Z4Ggfh5K7JvBBapQ947y9c68gGJY7";

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

// get all resumes by user id

recordRoutes.route("/resumes").get(function (req, res) {
  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, secret, { debug: true }, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" + err });
    }
    // the token is valid
    let db_connect = dbo.getDb("yulia_peacock");
    // get user id from params
    let user_id = req.query.user_id;
    console.log("user_id", user_id);
    // filter by user id and sort by date
    db_connect
      .collection("resumes")
      .find({ user_id: user_id })
      .sort({ last_updated: -1 })
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
      });
  });
});

// get resume by id
recordRoutes.route("/resumes/:id").get(function (req, res) {
  let db_connect = dbo.getDb("yulia_peacock");
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("resumes").findOne(myquery, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

// create resume
recordRoutes.route("/resumes/add").post(function (req, response) {
  console.log("req.body", req.body);
  console.log("resume add    ");
  let db_connect = dbo.getDb("yulia_peacock");
  let myobj = {
    user_id: req.body.user_id,
    identifier: req.body.identifier,
    name: req.body.name,
    email: req.body.email,
    summary: req.body.summary,
    skills: req.body.skills,
    activities: req.body.activities,
    awards: req.body.awards,
    experience: req.body.experience,
    education: req.body.education,
    phone: req.body.phone,
    last_updated: new Date(),
  };
  db_connect.collection("resumes").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// update resume
// example of resume schema
//{
//     "_id": "63b4fe741dbb286ee15e0d2b",
//     "identifier": "Hello Kostia",
//     "name": null,
//     "email": null,
//     "summary": null,
//     "skills": null,
//     "activities": null,
//     "awards": null,
//     "experience": null,
//     "education": null,
//     "phone": null
// }
recordRoutes.route("/resumes/update/:id").post(function (req, response) {
  let db_connect = dbo.getDb("yulia_peacock");

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
      phone: req.body.phone,
      last_updated: new Date(),
    },
  };
  db_connect
    .collection("resumes")
    .update(myquery, newvalues, function (err, res) {
      if (err) throw err;
      response.json(res);
    });
});

// delete resume
recordRoutes.route("/resumes/delete/:id").delete(function (req, response) {
  let db_connect = dbo.getDb("yulia_peacock");
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("resumes").deleteOne(myquery, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

module.exports = recordRoutes;
