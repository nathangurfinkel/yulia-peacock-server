// router js that combines all routes and exports them and is used in server.js

const express = require('express');
const router = express.Router();
const content = require('./content');
const appointments = require('./appointment');
const resumes = require('./resumes');
// const users = require('./users');
const auth = require('./auth');


router.use('/auth', auth);
router.use('/', content);
router.use('/', resumes);
// router.use('/users', users);



module.exports = router;

// Path: routes\Router.js
