const superagent = require("superagent");
const feedparser = require("feedparser");
const moment = require('moment');
moment.locale('zh-cn');

const rss = {
  basket: 'http://sports.qq.com/basket/rss_basket.xml',
  soccer: 'http://sports.qq.com/isocce/rss_isocce.xml',
}

function qqSports(params, callback) {
  const url = rss[params.name.split('_')[1]];

  const req_stream = superagent
    .get(url)
    .buffer()
    .type('xml')
    .end(function(error, pres) {
      if (error) {
        callback({
          error,
        });
      }
    })

  const result = {};
  result.data = [];

  req_stream
    .pipe(new feedparser())
    .on("error", function(error) {
      callback({
        error,
      });
    }).on("meta", function(meta) {
        // console.log("===== %s =====", meta.title)
    }).on("readable", function() {
      const $stream = this;
      let item;

      if (item = $stream.read()) {
        result.data.push({
          title: item.title || item.description,
          url: item.link || item.guid,
          date: moment(item.date).format('MMMDo'),
        });
      } else {
        callback(result);
      }
    })

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
