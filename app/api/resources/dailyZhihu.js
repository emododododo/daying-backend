const superagent = require('superagent');
const moment = require('moment');

moment.locale('zh-cn');
// 浏览器请求报文头部部分信息
const browserMsg = {
  'Accept-Encoding': 'gzip, deflate',
  'Content-Type': 'text/html; charset=UTF-8',
  Host: 'daily.zhihu.com',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36',
};

function dailyZhihuThemes() {
  const promise = new Promise((resolve) => {
    superagent
      .get('http://news-at.zhihu.com/api/4/themes')
      .set(browserMsg)
      .end((error, response) => {
        if (error) {
          console.error(error);
        } else {
          const themes = JSON.parse(response.text).others.map(item => ({
            title: item.name,
            id: `dailyZhihu_theme_${item.id}`,
          }));
          resolve(themes);
        }
      });
  });
  return promise;
}

// get dailyZhihuSections list
function dailyZhihuSections() {
  const sections = [{
    title: '瞎扯',
    id: 'dailyZhihu_section_2',
  }, {
    title: '放映机',
    id: 'dailyZhihu_section_28',
  }, {
    title: '大误',
    id: 'dailyZhihu_section_29',
  }, {
    title: '小事',
    id: 'dailyZhihu_section_35',
  }, {
    title: '知乎好问题',
    id: 'dailyZhihu_section_38',
  }];
  return sections;
}

// getDailyZhihuList (需要添加失败情况)
function getDailyZhihuList() {
  const dailyZhihuList = {
    title: '知乎日报',
    id: 'dailyZhihu',
    data: [{
      title: '知乎日报热门',
      id: 'dailyZhihu',
      date: moment().format('MMMDo'),
    }],
  };
  const promise = new Promise((resolve) => {
    Promise.all([
      dailyZhihuThemes(),
      dailyZhihuSections(),
    ]).then((values) => {
      values.forEach((item) => {
        dailyZhihuList.data = dailyZhihuList.data.concat(item);
      });
      resolve([dailyZhihuList]);
    });
  });
  return promise;
}

function superagentHandler(url, handler) {
  superagent
    .get(url)
    .set(browserMsg)
    .end((error, response, body) => {
      handler(error, response, body);
    });
}

// handler dailyZhihu api
function dailyZhihu(params, callback) {
  let url = 'http://news-at.zhihu.com/api/4/news/latest';
  const storyUrl = 'http://daily.zhihu.com/story/';

  switch (params.name.split('_')[1]) {
    case 'section':
      url = `http://news-at.zhihu.com/api/4/section/${params.name.split('_')[2]}`;
      superagentHandler(url, (error, response) => {
        const result = {};
        if (error) {
          result.error = error;
        } else {
          result.data = JSON.parse(response.text).stories.map(item => ({
            url: `${storyUrl}${item.id}`,
            title: item.title,
            date: moment(item.date, 'YYYYMMDD').format('MMMDo'),
          }));
        }
        callback(result);
      });
      break;
    case 'theme':
      url = `http://news-at.zhihu.com/api/3/theme/${params.name.split('_')[2]}`;
      superagentHandler(url, (error, response) => {
        const result = {};
        if (error) {
          result.error = error;
        } else {
          result.data = JSON.parse(response.text).stories.map(item => ({
            url: `${storyUrl}${item.id}`,
            title: item.title,
            date: moment().format('MMMDo'),
          }));
        }
        callback(result);
      });
      break;
    default:
      url = 'http://news-at.zhihu.com/api/4/news/latest';
      superagentHandler(url, (error, response) => {
        const result = {};
        if (error) {
          result.error = error;
        } else {
          result.data = JSON.parse(response.text).stories.map(item => ({
            url: `${storyUrl}${item.id}`,
            title: item.title,
            date: moment(JSON.parse(response.text).date, 'YYYYMMDD').format('MMMDo'),
          }));
        }
        callback(result);
      });
  }
}

exports.dailyZhihu = dailyZhihu;
exports.getDailyZhihuList = getDailyZhihuList;
