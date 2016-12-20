const cheerio = require("cheerio");
const superagent = require('superagent');

// 浏览器请求报文头部部分信息

const browserMsg = {
  "Accept-Encoding": "gzip, deflate",
  "Content-Type": "text/html; charset=UTF-8",
  "Host": "daily.zhihu.com",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36",
};

function dailyZhihu(params, callback) {
  superagent
    .get("http://daily.zhihu.com")
    .set(browserMsg)
    .end((error, response, body) => {
      const result = {};
      if (error) {
        result.error = error
      } else {
        const body = response.text;
        const $ = cheerio.load(body);

        result.data = [];
        const itemList = $('.main-content-wrap a');
        itemList.each(function(index) {
          const url = 'http://daily.zhihu.com' + $(this).attr('href');
          const title = $(this).children('span').text();
          result.data.push({
            url,
            title
          });
        });
      }

      callback(result);
    });
}

exports.dailyZhihu = dailyZhihu;
