'use strict'
module.exports = appInfo => {
  const config = exports = {}
  config.keys = appInfo.name + '_1534032268107_9445'
  config.middleware = []
  // 跨域需关闭CSRF，否则发起非GET请求报CSRF错误
  config.security = {
    csrf: {
      enable: false
    }
  }
  // 开启跨域，非内置插件请在plugin.js里面定义
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  }
  // multipart参数
  // https://eggjs.org/zh-cn/plugins/multipart.html
  config.multipart = {
    fileSize: '5000mb',
    fileExtensions: [
      '.csv',
      '.xls',
      '.xlsx',
      '.txt',
      '.pdf',
      '.rar',
      '.exe'
    ]
  }
  return config
}
