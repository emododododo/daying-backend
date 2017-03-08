const superagent = require('superagent');
const Feedparser = require('feedparser');
const moment = require('moment');

moment.locale('zh-cn');

const rss = {
  basket: 'http://sports.qq.com/basket/rss_basket.xml',
  soccer: 'http://sports.qq.com/isocce/rss_isocce.xml',
};

function qqSports(params, callback) {
  const url = rss[params.name.split('_')[1]];

  const reqStream = superagent
    .get(url)
    .buffer()
    .type('xml')
    .end((error) => {
      if (error) {
        callback({
          error,
        });
      }
    });

  const result = {};
  result.data = [];

  reqStream
    .pipe(new Feedparser())
    .on('error', (error) => {
      callback({
        error,
      });
    }).on('readable', function handler() {
      const $stream = this;
      const item = $stream.read();

      if (item) {
        result.data.push({
          title: item.title || item.description,
          url: item.link || item.guid,
          date: moment(item.date).format('MMMDo'),
        });
      } else {
        callback(result);
      }
    });
}

function getqqRssList() {
  const qqRssList = {
    title: '腾讯体育',
    id: 'qqSports',
    data: [{
      title: '腾讯篮球',
      id: 'qqSports_basket',
    }, {
      title: '腾讯足球',
      id: 'qqSports_soccer',
    }],
  };
  return qqRssList;
}

exports.qqSports = qqSports;
exports.getqqRssList = getqqRssList;
