const log = require('bole')('customers/router');
const express = require('express');
const router = new express.Router();
const getJuejin = require('./juejin').getJuejin;
const dailyZhihu =  require('./dailyZhihu').dailyZhihu;

const resources = {
  github: getJuejin,
  qianduan: getJuejin,
  cnblogs: getJuejin,
  csdn: getJuejin,
  wanqu: getJuejin,
  ithome: getJuejin,
  solidot: getJuejin,

  dailyZhihu: dailyZhihu,
}
function handler(req, res) {
  const getResource = resources[req.query.name];

  if (getResource) {
    getResource({
      name: req.query.name
    }, (result) => {
      if (result.error) {
        res.status(500).send(result.error);
      } else {
        res.json(result.data);
      }
    });
  } else {
    // error
    res.status(500).send('not found resource!!!');
  }

}

router.get('/', handler);

module.exports = router;
