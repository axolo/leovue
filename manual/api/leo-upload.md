leo-upload
==========

示例
----


说明
----
多文件可控制急速异步文件上传。尽量避免占用服务器资源，最大限度利用服务器已有资源，
纯客户端实现哈希计算，绿色环保。解耦设计，不过分依赖服务器数据结构。

![文件上传](./assets/leo-upload.png)

服务器
------
必须有可以处理文件上传的服务器，任何支持文件上传的服务器都可以。本文以[Egg.js](https://eggjs.org/zh-cn/)为例，
`Egg.js`默认以内置插件[egg-multipart](https://eggjs.org/zh-cn/plugins/multipart.html)处理文件上传。

#### 安装
```bash
# 1. egg.js 安装
npm i egg-init -g
egg-init file-server --type=simple
cd file-server
npm i
npm run dev
open localhost:7001
```

#### 配置
```js
// 2. config/plugin.js 安装egg-cors，并开启
exports.cors = {
  enable: true,
  package: 'egg-cors'
}
```

```js
// config/config.default.js
// 3. 简单起见，直接关闭CSRF，否则发起非GET请求报CSRF错误
config.security = { csrf: { enable: false }}
// 4. 开启跨域，egg-cors为非内置插件，已在plugin.js里面开启
config.cors = {
  origin: '*',
  allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
}
// 5. egg-multipart参数设置
config.multipart = {
  fileSize: '5000mb',
  fileExtensions: ['.xls','.xlsx','.txt', '.pdf' ]
}
```

#### 实现

```js
// app/controller/files.js
const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const crypto = require('crypto')
const sendToWormhole = require('stream-wormhole')
const awaitReadStream = require('await-stream-ready').read
const Controller = require('egg').Controller

class FilesController extends Controller {
  constructor(ctx) {
    super(ctx)    
    this.files = [  // 测试用数据，实际应用应该结合 service 和数据库
      { "md5": "808e3dbe48915685d1597c7b789888d8" },
      { "md5": "aae7f6464638dec6616489ef5bd404bb" },
      { "md5": "25feb93e5e1b18f5596f384f214b1242" },
      { "md5": "6fdf1caf3f77017f5a6622c133dafbc7" },  // FoxitPhantom224cn.exe
      { "md5": "e922301da3512247ab71407096ab7810" }   // HashCalc.exe
    ]
  }

  async index() {
    this.ctx.body = this.files
  }

  async show() {
    let file = _.find(this.files, { "md5": this.ctx.params.id })
    this.ctx.body = file ? file : { "error": 404 }
  }

  // 此处为简单测试，不考虑文件夹逻辑，简单粗暴的放在固定目录下，也不考虑后台操作失败处理。
  // 请注意新建 files 和 tmp 目录后运行代码，否则404。请留意 .gitignore 配置。
  async create() {
    const { ctx } = this
    const rs = await ctx.getFileStream()
    const dir = fs.mkdtempSync('tmp/leovue-')
    const tmp = path.join(dir, rs.filename)
    const ws = fs.createWriteStream(tmp)
    const hash = crypto.createHash('md5')
    rs.on('data', chunk => { hash.update(chunk) && ws.write(chunk) })
    rs.on('end', () => { ws.end() })
    rs.on('error', () => { sendToWormhole(rs) && console.log(err) })
    await awaitReadStream(rs)           // 你走，我断后！！！
    const md5 = hash.digest('hex')      // MD5可以在 on end 里计算
    ctx.body = { md5: md5 }             // 输出到前端，后端继续执行（非主流）
    const fix = path.join('files', md5 + path.extname(rs.filename).toLocaleLowerCase())
    fs.rename(tmp, fix, (err) => { err && console.log(err) || fs.rmdir(dir) }) // 后端继续
  }
}
module.exports = FilesController
```

```js
// app/router.js 开启路由
router.resources('files', '/files', controller.files)
```
