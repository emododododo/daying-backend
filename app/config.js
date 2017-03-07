const config = module.exports;
const PRODUCTION = process.env.NODE_ENV === 'production';

config.express = {
  port: process.env.EXPRESS_PORT || 4007,
  ip: '127.0.0.1',
};

if (PRODUCTION) {
  config.express.ip = '0.0.0.0';
}
