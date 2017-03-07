const express = require('express');

const router = new express.Router();

function api(req, res) {
  res.render('api/api');
}

router.get('/', api);

router.use('/resources', require('./resources/router'));

module.exports = router;
