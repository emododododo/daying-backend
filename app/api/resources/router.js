const log = require('bole')('customers/router');
const express = require('express');
const router = new express.Router();
const getJuejin = require('./juejin').getJuejin;
const dailyZhihu = require('./dailyZhihu').dailyZhihu;
const jianshu = require('./jianshu').jianshu;

const resources = {
  github: getJuejin,
  qianduan: getJuejin,
  cnblogs: getJuejin,
  csdn: getJuejin,
  wanqu: getJuejin,
  ithome: getJuejin,
  solidot: getJuejin,
  // jujin ↑
  dailyZhihu: dailyZhihu,
  jianshu: jianshu,
}
function handler(req, res) {
  const getResource = resources[req.query.name];

  if (getResource) {
    getResource({
      name: req.query.name
    }, (result) => {
      if (result.error) {
        res.status(501).send(result);
      } else {
        result.data = JSON.stringify(result.data);
        res.json(result);
      }
    });
  } else {
    // error
    res.status(501).send({
      error: "Not found this resource"
    });
  }

}

router.get('/', handler);

module.exports = router;
