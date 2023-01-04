// router js that combines all routes and exports them and is used in server.js

const express = require('express');
const router = express.Router();
const content = require('./content');
const resumes = require('./resumes');
// const users = require('./users');
const auth = require('./auth');

router.use('/content', content);
router.use('/resumes', resumes);
// router.use('/users', users);
router.use('/auth', auth);


module.exports = router;

// Path: routes\Router.js
