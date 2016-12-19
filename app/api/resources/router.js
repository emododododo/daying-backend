// var course = require('./edu-course');
const log = require('bole')('customers/router');
const express = require('express');
const router = new express.Router();
const getJuejin = require('./juejin').getJuejin;

const juejinResources = {
  github: 'github',
  qianduan: 'qianduan',
  cnblogs: 'cnblogs',
  csdn: 'csdn',
  wanqu: 'wanqu',
  ithome: 'ithome',
  solidot: 'solidot'
}
function handler(req, res) {
  console.log(req.query.name);
  // juejin api
  if (juejinResources[req.query.name]) {
    getJuejin(req.query.name, (result) => {
      res.json(JSON.parse(result.text));
    });
  }
}

router.get('/', handler);

module.exports = router;
