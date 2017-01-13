const cheerio = require("cheerio");
const superagent = require('superagent');

// 浏览器请求报文头部部分信息

const browserMsg = {
  "Accept-Encoding": "gzip, deflate",
  "Content-Type": "text/html; charset=UTF-8",
  "Host": "daily.zhihu.com",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36",
};

// function dailyZhihu(params, callback) {
//   superagent
//     .get("http://daily.zhihu.com")
//     .set(browserMsg)
//     .end((error, response, body) => {
//       const result = {};
//       if (error) {
//         result.error = error
//       } else {
//         const body = response.text;
//         const $ = cheerio.load(body);
//
//         result.data = [];
//         const itemList = $('.main-content-wrap a');
//         itemList.each(function(index) {
//           const url = 'http://daily.zhihu.com' + $(this).attr('href');
//           const title = $(this).children('span').text();
//           result.data.push({
//             url,
//             title
//           });
//         });
//       }
//
//       callback(result);
//     });
// }
// get dailyZhihuThemes list

function dailyZhihuThemes() {
  const promise = new Promise((resolve, reject) => {
    superagent
      .get("http://news-at.zhihu.com/api/4/themes")
      .set(browserMsg)
      .end((error, response, body) => {
        if (error) {
          console.log(error);
        } else {
          const themes = JSON.parse(response.text).others.map((item) => {
            return {
              title: item.name,
              id: `dailyZhihu_theme_${item.id}`,
            }
          });
          resolve(themes);
        }
    });
  });
  return promise;
}

// get dailyZhihuSections list
function dailyZhihuSections() {
  const promise = new Promise((resolve) => {
    superagent
      .get("http://news-at.zhihu.com/api/3/sections")
      .set(browserMsg)
      .end((error, response, body) => {
        const result = {};
        if (error) {
          console.log(error);
        } else {
          const sections = JSON.parse(response.text).data.map((item) => {
            return {
              title: item.name,
              id: `dailyZhihu_section_${item.id}`,
            }
          });
          resolve(sections);
        }
    });
  });
  return promise;
}

// getDailyZhihuList (需要添加失败情况)
function getDailyZhihuList() {
  const dailyZhihuList = {
    title: '知乎日报',
    id: 'dailyZhihu',
    data: [{
      title: '知乎日报热门',
      id: 'dailyZhihu',
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
      resolve([dailyZhihuList])
    });
  });
  return promise;
}

// handler dailyZhihu api
function dailyZhihu(params, callback) {
  let url = 'http://news-at.zhihu.com/api/4/news/latest';
  const storyUrl = 'http://daily.zhihu.com/story/';

  switch (params.name.split('_')[1]) {
    case 'section':
      url = `http://news-at.zhihu.com/api/4/section/${params.name.split('_')[2]}`;
      superagentHandler(url, (error, response, body) => {
        const result = {};
        if (error) {
          result.error = error;
        } else {
          result.data = JSON.parse(response.text).stories.map((item) => {
            return {
              url: `${storyUrl}${item.id}`,
              title: item.title,
            }
          });
        }
        callback(result);
      });
      break;
    case 'theme':
      url = `http://news-at.zhihu.com/api/3/theme/${params.name.split('_')[2]}`;
      superagentHandler(url, (error, response, body) => {
        const result = {};
        if (error) {
          result.error = error;
        } else {
          result.data = JSON.parse(response.text).stories.map((item) => {
            return {
              url: `${storyUrl}${item.id}`,
              title: item.title,
              date: item.display_date,
            }
          });
        }
        callback(result);
      });
      break;
    default:
      url = 'http://news-at.zhihu.com/api/4/news/latest';
      superagentHandler(url, (error, response, body) => {
        const result = {};
        if (error) {
          result.error = error;
        } else {
          result.data = JSON.parse(response.text).stories.map((item) => {
            return {
              url: `${storyUrl}${item.id}`,
              title: item.title,
              date: JSON.parse(response.text).date,
            }
          });
        }
        callback(result);
      });
  };
}

function superagentHandler(url, handler) {
  superagent
    .get(url)
    .set(browserMsg)
    .end((error, response, body) => {
      handler(error, response, body);
    });
}

exports.dailyZhihu = dailyZhihu;
exports.getDailyZhihuList = getDailyZhihuList;
