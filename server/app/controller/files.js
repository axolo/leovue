/**
 * 要点在于只读一次文件，计算MD5，改名，等这些做完了再输出信息
 * 异步会导致客户端错误，因为在传输完成前，内容已经被输出了
 * await-stream-ready 的 await ready 充当了等待者的角色
 */
'use strict'
const path = require('path')
const fs = require('fs-extra')
const _ = require('lodash')
const crypto = require('crypto')
const sendToWormhole = require('stream-wormhole')
const awaitReadStream = require('await-stream-ready').read
const Controller = require('egg').Controller

class FilesController extends Controller {
  constructor(ctx) {
    super(ctx)
    // 测试用数据，实际应用应该结合 service 和数据库
    this.files = [
      { "md5": "808e3dbe48915685d1597c7b789888d8" },
      { "md5": "aae7f6464638dec6616489ef5bd404bb" },
      { "md5": "25feb93e5e1b18f5596f384f214b1242" },
      { "md5": "6fdf1caf3f77017f5a6622c133dafbc7" },  // FoxitPhantom224cn.exe
      { "md5": "e922301da3512247ab71407096ab7810" }   // HashCalc.exe
    ]
  }

  async download(id) {
    const filePath = path.resolve(this.app.config.static.dir, 'hello.txt');
    this.ctx.attachment('hello.txt');
    this.ctx.set('Content-Type', 'application/octet-stream');
    this.ctx.body = fs.createReadStream(filePath);
  }

  async index() {
    this.ctx.body = this.files
  }

  async show() {
    const { ctx } = this
    let file = _.find(this.files, { "md5": ctx.params.id })
    if(file) {
      if(ctx.queries.download !== 'true') {
        ctx.body = file
      } else {
        await this.download(ctx.params.id)
      }
    } else {
      ctx.body = { "error": 404 }
    }
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
    await awaitReadStream(rs)           // !!! 你走，我断后
    const md5 = hash.digest('hex')
    ctx.body = { md5: md5 }
    // 继续后台相关操作，移动文件，删除临时目录，相关信息写入数据库，等等
    const fix = path.join('files', md5 + path.extname(rs.filename).toLocaleLowerCase())
    fs.move(tmp, fix, { overwrite: true }, (err) => { err && console.log(err) || fs.remove(dir) })
  }

}

module.exports = FilesController
