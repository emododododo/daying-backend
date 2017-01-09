var express = require('express')

var app = express();

// templat
app.set('views', __dirname);
app.set('view engine', 'ejs');

//

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

// page
app.use(require('./site/router'));
// education information api
app.use('/api', require('./api/router'));

// app.use(require('errors/not-found'));

module.exports = app;
