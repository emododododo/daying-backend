const cheerio = require("cheerio");
const superagent = require('superagent');

// 浏览器请求报文头部部分信息

const browserMsg = {
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Encoding": "gzip, deflate, sdch",
  "Host": "www.smzdm.com",
  "Referer": "http://www.smzdm.com/jingxuan/",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36",
};

function smzdm(params, callback) {
  superagent
    .get("http://www.smzdm.com/jingxuan/")
    .set(browserMsg)
    .end((error, response, body) => {
      const result = {};
      if (error) {
        result.error = error
      } else {
        const body = response.text;
        const $ = cheerio.load(body);

        result.data = [];
        const itemList = $('.article-list .have-img');
        itemList.each(function(index) {
          const $tT = $(this).find('.title a');
          const url = 'http://www.jianshu.com' + $tT.attr('href');
          const title = $tT.text();
          result.data.push({
            url,
            title
          });
        });
      }

      callback(result);
    });
}

exports.smzdm = smzdm;
