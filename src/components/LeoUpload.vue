<template>
  <div>
    <leo-dialog :title="title" :visible="visible" @close="close">
      <div class="leo-tips leo-message">
        <span v-if="warning">{{warning}} <button class="leo-button" @click="cancel">retry</button></span>
        <span v-else>{{step}}</span>
        <button class="leo-button leo-upload" @click="upload" v-if="completed">Upload</button>
      </div>
      <input class="leo-input-file" type="file" @change="change" :multiple="multiple" v-if="choose">
      <div class="leo-tips" v-else>
        <table class="leo-table" v-if="files.length">
          <caption class="leo-caption">Picks: {{files.length}}</caption>
          <thead>
              <tr>
                <th class="leo-th">#</th>
                <th class="leo-th">Name</th>
                <th class="leo-th">Size</th>
                <th class="leo-th">Hash(MD5)</th>
                <th class="leo-th">Status</th>
                <th class="leo-th">
                  <button class="leo-button-circle" @click="cancel" title="Remove all">x</button>
                </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(file, index) in files" :key="file.id">
              <td>{{++index}}</td>
              <td class="leo-td"><span class="leo-over" :title="file.name">{{file.name}}</span></td>
              <td class="leo-td leo-right">{{file.size | bytes}}</td>
              <td class="leo-td leo-code">{{file.hash}}</td>
              <td class="leo-td leo-center">{{file.status}}</td>
              <td class="leo-td leo-center">
                <button class="leo-button-circle" @click="remove(index-1)" :title="'Remove '+index">x</button>
              </td>
            </tr>
          </tbody>
        </table>
        <table class="leo-table" v-if="bans.length">
          <caption class="leo-caption">
            Bans: {{bans.length}}
            [<span class="show-bans" v-if="showBans" @click="showBans=false">hide</span>
            <span class="show-bans" v-else @click="showBans=true">show</span>]
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
              <td>{{++index}}</td>
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
        <div class="leo-filter" v-if="filter">{{filter}}</div>
      </template>
    </leo-dialog>
  </div>
</template>

<script>
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
    title: { type: String },                     // 对话框标题
    visible: { type: Boolean },                  // 对话框可见性
    types: { type: Array, default: () => [] },   // 文件格式
    size: { type: Number, default: 0 },          // 最大文件大小
    max: { type: Number, default: 0 },         // 最多文件数量
    multiple: { type: Boolean, default: true },  // 多文件上传
    rapid: { type: String, default: '' },        // 急速上传（验证MD5地址）
    action: { type: String, default: '' }        // 上传地址
  },
  data() {
    return {
      step: '',               // 状态提示信息
      warning: '',                // 文件超量
      filter: [],             // 筛选器
      choose: true,           // 文件选择器可见
      completed: false,       // 加载完成（前端）
      files: [],              // 文件列表（中选）
      bans: [],               // 文件列表（落选）
      target: '',             // File对象（原始）
      showBans: false,        // 查看落选
      steps: {
        step1: 'Step 1: Choose',
        step2: 'Step 2: Ban / Pick',
        step3: 'Step 3: Upload',
        step4: 'Step 4: Response'
      },
      status: {
        ready: 'Ready',
        hash: 'Hash'
      }
    }
  },
  mounted() {
    let filter = []
    this.size && filter.push('Size<=' + bytes(this.size))
    this.max && filter.push('Max<=' + this.max)
    this.types.length && filter.push('Type: ' + this.types.join(', '))
    this.step = this.steps.step1
    filter.length && (this.filter = 'Filters: ' + filter.join(', '))
  },
  filters: {
    bytes: function(n) {
      return bytes(n, {fixedDecimals: true, unitSeparator: ' '})
    },
    moment: function(s, f) {
      return moment(s).format(f)
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    upload() {
      this.files.forEach((file) => {
        console.log(this.target[file.id])
      })
    },
    cancel() {
      this.warning = ''
      this.step = this.steps.step1
      this.choose = true
      this.completed = false
    },
    remove(i) {
      this.files[i].ban.push('remove')    // 落选原因
      this.bans.push(this.files[i])       // 进入落选
      this.files.splice(i, 1)             // 退出中选
    },
    change(e) {
      /**
       * 多文件异步可筛选支持急速上传的上传组件
       * =======================================
       * 一、筛选
       * 1. 赋值
       *    监听文件框变化，保存target，赋值给files（注意ID对应）
       * 2. 过滤
       *    1). 类型：分析文件类型，允许的保留，其余的剔除。其结果转下一道筛选（ban: true）
       *    2). 大小：分析文件大小，超过的剔除。（ban: true）
       * 3. 超载
       *    统计经过各道筛选后剩余的数量，若仍超过允许数量，提示并要求重新选择。
       * 二、计算
       * 1. 计算哈希、格式化大小、计算状态，展现经过筛选的文件列表
       * 2. 用户可对展现的文件类别动态操作（ban: 'remove'）
       * 三、上传
       * 1. 若定义了急速上传，验证存在，则标记（status: 'rapid'）
       * 2. 异步上传筛选后经用户操作且未被标记可急速上传的文件（status: 'processor'）
       * 3. 上传成功，返回服务端hash（status: 'success'）
       * 4. 跟客户端hash对比一致（ban: 'hash'）
       * 5. 上传失败，允许重试上传，并更新状态（status: 'failed'）
       * 四、返回
       * 1. TODO: HASH不一致的是否删除？
       * 2. 通过事件传递上传结果给父组件
       */
      // 一、筛选
      this.choose = false
      this.files = []
      this.bans = []
      this.target = e.target.files
      let n = e.target.files.length
      for(let i=0; i<n; i++) {
        let file = {
          id: i,
          name: this.target[i].name,
          ext: this.target[i].name.split('.').pop().toLowerCase(),
          size: this.target[i].size,
          lastModified: this.target[i].lastModified,
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
        this.files.push(file)

      }

      // 4. 数量判断
      let pick = this.files.length
      if(this.max < pick) {
        this.files = []
        this.bans = []
        this.warning = 'Too many files, Max: ' + this.max + ', Picked: ' + pick + '.'
      } else {
        // 二、计算
        let m = this.files.length
        let j = 0
        let k = 0
        this.files.forEach((file) => {
          file.status = this.status.hash
          browserMd5File(this.target[file.id], (err, md5) => {
            if(err) console.log(err)
            // 剔除 HASH一致的文件
            if(_.find(this.files, { hash: md5 })) {
              file.ban.push('hash')                                           // 落选原因
              this.bans.push(file)                                            // 进入落选
              this.files.splice(_.findIndex(this.files, {id: file.id}), 1)    // 退出中选
              k++                                                             // 计数器
            }
            // 提示信息
            file.hash = md5
            file.status = this.status.ready
            this.step =
              this.steps.step2 +
              ', Choose ' + this.target.length +
              ', Hash '  + (++j) + ' / ' + m +
              ', Drop '  + k + ' by unique HASH.'
            j == m && (this.step += ' Completed!') && (this.completed = true)
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
.show-bans {
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
