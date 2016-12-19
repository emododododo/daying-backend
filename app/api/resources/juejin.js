/*
  github
  qianduan
  cnblogs
  csdn
  wanqu
  ithome
  solidot
*/
const cheerio = require("cheerio");
const iconv = require("iconv-lite");
const charset = require('superagent-charset');
const superagent = charset(require('superagent'));

// 浏览器请求报文头部部分信息
const browserMsg = {
  "Accept-Encoding": "gzip, deflate",
  "Origin": "http://e.xitu.io",
  "Referer": "http://e.xitu.io",
  "Content-Type": "application/json",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36",
};
const resourcesUrl = "http://api.xitu.io/resources/";
const resourcesObj = {
  github: 'github',
  qianduan: 'qianduan',
  cnblogs: 'cnblogs',
  csdn: 'csdn',
  wanqu: 'wanqu',
  ithome: 'ithome',
  solidot: 'solidot'
}
const data = {

}
function getJuejin(name, callback) {
  const url = `http://api.xitu.io/resources/${name}`;
  superagent
    .post(url)
    .send({
      "category": "trending",
      "period": "day",
      "lang": "javascript",
      "offset": 0,
      "limit": 30
    })
    .set(browserMsg)
    .end((err, response, body) => {
      if (err) {
        console.log(err);
      } else {
        callback(response);
      }
    });
}
exports.getJuejin = getJuejin;
