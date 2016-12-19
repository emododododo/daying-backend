// var course = require('./edu-course');
const log = require('bole')('customers/router');
const express = require('express');
const router = new express.Router();
const getGithub = require('./utils/get-github').getGithub;

function getGithubHandler(req, res) {
  getGithub({}, (result) => {
    res.json(JSON.parse(result.text));
  });
}

function api (req, res) {
  res.render('api/api');
}

router.get('/', api);

router.get('/getGithub', getGithubHandler);

module.exports = router;
