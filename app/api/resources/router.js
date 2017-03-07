const express = require('express');

const router = new express.Router();
const getJuejin = require('./juejin').getJuejin;
const dailyZhihu = require('./dailyZhihu').dailyZhihu;
const jianshu = require('./jianshu').jianshu;
const smzdm = require('./jianshu').smzdm;
const getList = require('./getList').getList;
const qqSports = require('./qqSports').qqSports;

const resources = {
  github: getJuejin,
  qianduan: getJuejin,
  cnblogs: getJuejin,
  csdn: getJuejin,
  wanqu: getJuejin,
  ithome: getJuejin,
  solidot: getJuejin,
  // jujin ↑
  dailyZhihu,
  jianshu,
  smzdm,
  qqSports,

  getList,
};

function handler(req, res) {
  const getResource = resources[req.query.name.split('_')[0]];

  if (getResource) {
    getResource({
      name: req.query.name,
    }, (result) => {
      if (result.error) {
        res.status(501).send(result);
      } else {
        res.json(result);
      }
    });
  } else {
    // error
    res.status(501).send({
      error: 'Not found this resource',
    });
  }
}

router.get('/', handler);

module.exports = router;
