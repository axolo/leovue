<template>
  <div id="leo-upload">
    <leo-dialog :title="title" :visible="visible" @close="close">
      <div class="leo-tips leo-message">
        <span>
          {{message}}
          <span v-if="failed" class="leo-span-a" @click="clear">[Reset]</span>
        </span>
        <button class="leo-button leo-upload" @click="upload(picks)" v-if="ready">Upload</button>
        <button class="leo-button leo-upload" @click="result" v-if="success.length">Send Result</button>
      </div>
      <input class="leo-input-file" type="file" @change="change" :multiple="multiple" v-if="draft">
      <div class="leo-tips" v-else>
        <table class="leo-table" v-if="picks.length">
          <caption class="leo-caption">Picks: {{picks.length}}</caption>
          <thead>
              <tr>
                <th class="leo-th">#</th>
                <th class="leo-th">Name</th>
                <th class="leo-th">Size</th>
                <th class="leo-th">Hash(MD5)</th>
                <th class="leo-th">Status</th>
                <th class="leo-th">
                  <button class="leo-button-circle" @click="clear" title="Clear" v-if="ready">-</button>
                  <button class="leo-button-circle" @click="again" title="Manual" v-else-if="failed">+</button>
                </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(file, index) in picks" :key="file.id">
              <td class="leo-td">{{++index}}</td>
              <td class="leo-td"><span class="leo-over" :title="file.name">{{file.name}}</span></td>
              <td class="leo-td leo-right">{{file.size | bytes}}</td>
              <td class="leo-td leo-code">{{file.hash}}</td>
              <td class="leo-td leo-center">
                <span v-if="file.detail" class="leo-span-a" :title="file.detail">{{file.status}}</span>
                <span v-else>{{file.status}}</span>
              </td>
              <td class="leo-td leo-center">
                <span v-if="file.status==status.ready">
                  <button class="leo-button-circle" @click="remove(file.id)" :title="'Remove '+file.id">-</button>
                </span>
                <span v-if="file.status==status.failed">
                  <button class="leo-button-circle" @click="retry(file.id)" :title="'Retry '+file.id">+</button>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <table class="leo-table" v-if="bans.length">
          <caption class="leo-caption">
            Bans: {{bans.length}}
            [<span class="leo-span-a" v-if="showBans" @click="showBans=false">hide</span>
            <span class="leo-span-a" v-else @click="showBans=true">show</span>]
          </caption>
          <thead v-if="showBans">
            <tr>
              <th class="leo-th">#</th>
              <th class="leo-th">Name</th>
              <th class="leo-th">Size</th>
              <th class="leo-th">Ext</th>
              <th class="leo-th">By</th>
              <th class="leo-th">Hash(MD5)</th>
            </tr>
          </thead>
          <tbody v-if="showBans">
            <tr v-for="(file, index) in bans" :key="file.id">
              <td class="leo-td">{{++index}}</td>
              <td class="leo-td"><span class="leo-over" :title="file.name">{{file.name}}</span></td>
              <td class="leo-td leo-right">{{file.size | bytes}}</td>
              <td class="leo-td leo-left">{{file.ext}}</td>
              <td class="leo-td leo-center">{{file.ban.join(', ')}}</td>
              <td class="leo-td leo-left">{{file.hash}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <template slot="footer">
        <div class="leo-filter">
          <span>Filter:</span>
          <span v-if="size">Size &lt;= {{size | bytes}}. </span>
          <span v-if="max">Max: {{max}}. </span>
          <span v-if="types.length">Types: {{types.join(',')}}.</span>
        </div>
      </template>
    </leo-dialog>
  </div>
</template>

<script>
/**
  * 多文件异步可筛选支持急速上传的上传组件
  * =======================================
  * 一、筛选
  * --------
  * 1. 赋值
  *    监听文件框变化，保存files，赋值给picks（注意ID对应）
  * 2. 过滤
  *    1). 类型：分析文件类型，允许的保留，其余的剔除。其结果转下一道筛选（ban: true）
  *    2). 大小：分析文件大小，超过的剔除。（ban: true）
  * 3. 超载
  *    统计经过各道筛选后剩余的数量，若仍超过允许数量，提示并要求重新选择。
  * 二、计算
  * --------
  * 1. 计算哈希、格式化大小、计算状态，展现经过筛选的文件列表
  * 2. 用户可对展现的文件类别动态操作（ban: 'remove'）
  * 三、上传
  * --------
  * 1. 若定义了急速上传，验证存在，则标记（status: 'rapid'）
  * 2. 异步上传筛选后经用户操作且未被标记可急速上传的文件（status: 'processor'）
  * 3. 上传成功，返回服务端hash（status: 'success'）
  * 4. 跟客户端hash对比一致（ban: 'hash'）
  * 5. 上传失败，允许重试上传，并更新状态（status: 'failed'）
  * 四、返回
  * --------
  * 1. 通过事件传递上传结果给父组件
*/
import moment from 'moment'
import bytes from 'bytes'
import browserMd5File from 'browser-md5-file'
import _ from 'lodash'
import axios from 'axios'
import LeoDialog from './LeoDialog'
export default {
  name: 'LeoUpload',
  components: { LeoDialog },
  props: {
    title: { type: String },                      // 对话框标题
    visible: { type: Boolean },                   // 对话框可见性
    types: { type: Array, default: () => [] },    // 文件格式
    size: { type: Number, default: 0 },           // 限制文件大小
    max: { type: Number, default: 0 },            // 限制文件数量
    multiple: { type: Boolean, default: true },   // 是否多文件上传
    action: { type: Object },                     // 上传地址
    rapid: { default: false }                     // 急速上传（验证MD5地址）
  },
  data() {
    return {
      draft: true,                // 文件可否供选
      message: '',                // 提示信息
      files: '',                  // Filelist对象
      picks: [],                  // 中选文件列表
      bans: [],                   // 落选文件列表
      ready: false,               // 是否准备就绪
      showBans: false,            // 落选显示开关
      success: [],                // 上传成功列表
      failed: 0,                  // 上传失败计数
      status: {                   // 文件状态
        init:       'Init',
        ready:      'Ready',
        hash:       'Hashing',
        uploading:  'Uploading',
        rapid:      'Rapid',
        success:    'Sucess',
        failed:     'Failed'
      },
      messages: {                 // 消息列表
        none: 'Not enough files.',
        over: 'Too many fiels. Max ' + this.max,
        failed: 'All failed. No file uploaded.',
        uploading: 'Uploading...'
      }
    }
  },
  filters: {
    bytes: function(n) {
      return bytes(n, {fixedDecimals: true, unitSeparator: ' '})
    },
    moment: function(s, f) {
      return moment(s).format(f)
    }
  },
  watch: {
    picks: function(nv, ov) {
      nv.length == 0 && (this.message = this.messages.none) && (this.draft = true)
      this.max < nv.length && (this.draft = true)
      && (this.message = this.messages.over + ', Picks ' + nv.length + ', Bans ' + nv.length + '. ')
    },
    bans: function(nv,ov) {
      nv.length && this.picks.length == 0 && (this.draft = true) && (this.ready = false)
      && (this.message = this.messages.none + ' Picks ' + nv.length + ', Bans ' + nv.length + '. ')
    },
    success: function(nv, ov) {
    }
  },
  mounted() {
  },
  methods: {
    normalUpload(file) {
      let i = _.findIndex(this.picks, { id: file.id })
      let len = this.picks.length
      let data = new FormData()
      let config = {
        onUploadProgress: progressEvent => {
          this.$set(this.picks[i], 'status',
          (progressEvent.loaded / progressEvent.total * 100).toFixed(1) + '%')
        }
      }
      data.append('file', this.files[file.id])
      Object.assign(this.action, { data: data }, config)
      this.$set(this.picks[i], 'status', this.status.uploading)
      this.$set(this.picks[i], 'detail', '')
      axios(this.action).then(res => {
        let hash = _.at(res.data, this.action.hash_path)[0]
        if(hash === file.hash) {
          this.success.push(res.data)
          this.$set(this.picks[i], 'status', this.status.success)
        } else {
          this.$set(this.picks[i], 'status', this.status.failed)
          this.$set(this.picks[i], 'detail', this.detail.hash)
        }
        this.failed = _.filter(this.picks, {status: this.status.failed}).length
        this.message = 'Success: ' + this.success.length + ', Failed: ' + this.failed + '.'
      }).catch(err => {
        this.$set(this.picks[i], 'status', this.status.failed)
        this.$set(this.picks[i], 'detail', err)
        this.failed = _.filter(this.picks, {status: this.status.failed}).length
        this.message = 'Success: ' + this.success.length + ', Failed: ' + this.failed + '.'
        console.log(err)
      })
    },
    rapidUpload(file) {
      let i = _.findIndex(this.picks, { id: file.id })
      let len = this.picks.length
      let url = this.rapid.url.replace(/%%hash_value%%/g, file.hash)
      this.$set(this.picks[i], 'status', this.status.uploading)
      this.$set(this.picks[i], 'detail', '')
      axios({ method: this.rapid.method, url: url}).then(res => {
        let hash = _.at(res.data, this.action.hash_path)[0]
        if(hash === file.hash) {
          this.success.push(res.data)
          this.$set(this.picks[i], 'status', this.status.rapid)
        } else {
          this.normalUpload(file, i)
        }
        this.failed = _.filter(this.picks, {status: this.status.failed}).length
        this.message = 'Success: ' + this.success.length + ', Failed: ' + this.failed + '.'
      }).catch(err => {
        this.$set(this.picks[i], 'status', this.status.failed)
        this.$set(this.picks[i], 'detail', err)
        this.failed = _.filter(this.picks, {status: this.status.failed}).length
        this.message = 'Success: ' + this.success.length + ', Failed: ' + this.failed + '.'
        console.log(err)
      })
      url = ''        // !!! 重新初始化url，否则不会被下一个hash替换
    },
    upload(files) {
      this.ready = false
      this.message = this.messages.uploading
      files.forEach((file) => {
        if(this.rapid) {
          this.rapidUpload(file)
        } else {
          this.normalUpload(file)
        }
      })
    },
    result() {
      this.$emit('result', this.success)
      this.close()
      this.clear()
    },
    close() {
      this.$emit('update:visible', false)
    },
    clear() {
      this.picks = []
      this.bans = []
      this.ready = false
      this.failed = 0
      this.success = []
    },
    remove(id) {
      let i = _.findIndex(this.picks, { id:id })
      this.picks[i].ban.push('remove')    // 落选原因
      this.bans.push(this.picks[i])       // 进入落选
      this.picks.splice(i, 1)             // 退出中选
    },
    retry(id) {
      this.upload(_.filter(this.picks, { id: id }))
    },
    again() {
      this.upload(_.filter(this.picks, {status: this.status.failed}))
    },
    change(e) {
      // 一、筛选
      this.clear()
      this.draft = false
      this.files = e.target.files
      let n = this.files.length
      for(let i=0; i<n; i++) {
        let file = {
          id: i,
          name: this.files[i].name,
          ext: this.files[i].name.split('.').pop().toLowerCase(),
          size: this.files[i].size,
          lastModified: this.files[i].lastModified,
          status: this.status.init,
          detail: '',
          ban: []
        }
        // 1. 文件类型错误
        if(this.types.length && -1 === this.types.indexOf(file.ext)) {
          file.ban.push('type')
          this.bans.push(file)
          continue
        }
        // 2. 文件大小超出
        if(this.size && this.size < file.size) {
          file.ban.push('size')
          this.bans.push(file)
          continue
        }
        // 3. 正常情况
        this.picks.push(file)
      }
      // 二、计算
      if(this.picks.length && this.max >= this.picks.length) {
        let len_picks = this.picks.length
        let len_hash = 0
        let len_unique = 0
        this.picks.forEach((file) => {
          file.status = this.status.hash
          browserMd5File(this.files[file.id], (err, md5) => {
            if(err) console.log(err)
            if(_.find(this.picks, { hash: md5 })) {                           // 剔除HASH一致的文件
              file.ban.push('hash')                                           // 落选原因
              this.bans.push(file)                                            // 进入落选
              this.picks.splice(_.findIndex(this.picks, {id: file.id}), 1)    // 退出中选
              len_unique++                                                             // 计数器
            }
            file.hash = md5
            file.status = this.status.ready
            this.message =
              'Hash '  + (++len_hash) + ' / ' + len_picks +
              ', Drop '  + len_unique + ' by UNIQUE.'
            len_picks == len_hash && (this.message += ' Ready!') && (this.ready = true)
          })
        })
      }
    }
  }
}
</script>

<style scoped>
.leo-button {
  border-radius: 3px;
  height: 24px;
}
.leo-button-circle {
  border-radius: 50%;
  border: none;
  cursor: pointer;
  color: darkslategrey;
}
.leo-main {
  padding: 10px;
}
.leo-tips {
  margin: 5px 0;
  font-size: small;
  color: darkslategrey;
}
.leo-tips ol {
  padding-left: 5px;
}
.leo-import {
  margin-top: 5px;
}
.leo-message {
  font-size: small;
  color: #8492a6;
}
.leo-table {
  font-family: monoca, 'DejaVu Sans Mono', 'Courier New', Courier, monospace;
  border-collapse: collapse;
  text-align: left;
}
.leo-caption {
  font-size: small;
  text-align: left;
  width: 200px;
}
.leo-td {
  border: 1px solid darkgray;
  padding: 2px 5px;
}
.leo-th {
  border: 1px solid darkgray;
  padding: 2px 5px;
  text-align: center;
  font-weight: bold;
}
.leo-right {
  text-align: right;
}
.leo-center {
  text-align: center;
}
.leo-over {
  max-width: 240px;
  text-overflow:ellipsis;
  white-space:nowrap;
  overflow:hidden;
  display:block;
}
.leo-span-a {
  cursor: pointer;
  text-decoration-line: underline;
  color: #43B17B;
}
.leo-filter {
  padding: 5px;
  color: darkslategrey;
}
.leo-upload {
  float: right;
}
</style>
