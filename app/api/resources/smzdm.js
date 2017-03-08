const cheerio = require('cheerio');
const superagent = require('superagent');

// 浏览器请求报文头部部分信息

const browserMsg = {
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate, sdch',
  Host: 'www.smzdm.com',
  Referer: 'http://www.smzdm.com/jingxuan/',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36',
};

function smzdm(params, callback) {
  superagent
    .get('http://www.smzdm.com/jingxuan/')
    .set(browserMsg)
    .end((error, response) => {
      const result = {};
      if (error) {
        result.error = error;
      } else {
        const body = response.text;
        const $ = cheerio.load(body);

        result.data = [];
        const itemList = $('#feed-main-list .feed-row-wide');
        itemList.each(function handler() {
          const $tT = $(this).find('.feed-block-title a');
          const url = $tT.attr('href');
          const title = $tT.text().replace(/\s/g, '');
          result.data.push({
            url,
            title,
          });
        });
      }

      callback(result);
    });
}

function getSmzdmList() {
  const smzdmList = {
    title: '什么值得买精选',
    id: 'smzdm',
  };
  return smzdmList;
}
exports.smzdm = smzdm;
exports.getSmzdmList = getSmzdmList;
