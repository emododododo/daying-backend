const getDailyZhihuList = require('./dailyZhihu').getDailyZhihuList;
const getJuejinList = require('./juejin').getJuejinList;
// 浏览器请求报文头部部分信息
function getList(params, callback) {
  Promise.all([
    getDailyZhihuList(),
    getJuejinList(),
  ]).then((values) => {
    let allDataList = [];
    values.forEach((item) => {
      allDataList = allDataList.concat(item);
    });
    const result = {};
    result.list = allDataList;
    callback(result);
  });
}
exports.getList = getList;
