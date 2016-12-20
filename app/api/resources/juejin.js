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
const superagent = charset(require('superagent'));

// 浏览器请求报文头部部分信息

const browserMsg = {
  "Accept-Encoding": "gzip, deflate",
  "Origin": "http://e.xitu.io",
  "Referer": "http://e.xitu.io",
  "Host": "api.xitu.io",
  "Content-Type": "application/json",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36",
};
const resourcesUrl = "http://api.xitu.io/resources/";

const data = {
  "category": "trending",
  "period": "day",
  "lang": "javascript",
  "offset": 0,
  "limit": 30
}

function getJuejin(params, callback) {
  const url = resourcesUrl + params.name;
  superagent
    .post(url)
    .send(data)
    .set(browserMsg)
    .end((error, response, body) => {
      const result = {};
      if (error) {
        result.error = error;
      } else {
        result.data = JSON.parse(response.text).data;
        if (params.name != 'github') {
          result.data = result.data.reduce((arr, item) => {
            arr.push({
              url: item.url,
              date: item.date.iso,
              title: item.title
            });
            return arr;
          }, []);
        }
      }

      callback(result);
    });
}
exports.getJuejin = getJuejin;
