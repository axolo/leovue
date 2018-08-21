<template>
  <div>
    <leo-dialog :title="title" :visible="visible" @close="close">
      <div class="leo-tips leo-message">{{step}}</div>
      <input class="leo-input-file" type="file" @change="change" :multiple="multiple" v-if="choose">
      <div class="leo-tips" v-else>
        <table class="leo-table" v-if="files">
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
        <button class="leo-button" @click="upload" v-if="completed">Upload</button>
        <table class="leo-table" v-if="bans">
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
            </tr>
          </thead>
          <tbody v-if="showBans">
            <tr v-for="(file, index) in bans" :key="file.id">
              <td>{{++index}}</td>
              <td class="leo-td"><span class="leo-over" :title="file.name">{{file.name}}</span></td>
              <td class="leo-td leo-right">{{file.size | bytes}}</td>
              <td class="leo-td leo-left">{{file.ext}}</td>
              <td class="leo-td leo-center">{{file.ban.join(', ')}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="leo-tips leo-message" v-if="filter">{{filter}}</div>
    </leo-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import browserMd5File from 'browser-md5-file'
import axios from 'axios'
import moment from 'moment'
import bytes from 'bytes'
import LeoDialog from './LeoDialog'
export default {
  name: 'LeoUpload',
  components: { LeoDialog },
  props: {
    title: { type: String },                     // 对话框标题
    visible: { type: Boolean },                  // 对话框可见性
    types: { type: Array, default: () => [] },   // 文件格式
    size: { type: Number, default: 0 },          // 最大文件大小
    count: { type: Number, default: 0 },         // 最多文件数量
    multiple: { type: Boolean, default: true },  // 多文件上传
    rapid: { type: String, default: '' },        // 急速上传（验证MD5地址）
    action: { type: String, default: '' }        // 上传地址
  },
  data() {
    return {
      step: '',               // 状态提示信息
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
        step3: 'Step 3: Hash',
        step4: 'Step 4: Upload',
        step5: 'Step 5: Response'
      }
    }
  },
  mounted() {
    let filter = []
    this.size && filter.push('size<=' + bytes(this.size))
    this.count && filter.push('qty<=' + this.count)
    this.types.length && filter.push('type: ' + this.types.join(', '))
    this.step = this.steps.step1
    filter.length && (this.filter = 'Filter: ' + filter.join(', '))
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
      this.files = []
      this.bans = []
      this.choose = true
      this.completed = false
      this.status = filter
    },
    remove(i) {
      this.files[i].ban.push('remove')    // 落选原因
      this.bans.push(this.files[i])       // 进入落选
      this.files.splice(i, 1)             // 退出中选
      console.log(this.files)
      console.log(this.bans)
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
      this.step = this.steps.step2
      this.choose = false
      this.target = e.target.files
      let n = e.target.files.length
      for(let i=0; i<n; i++) {
        let file = {
          id: i,
          name: this.target[i].name,
          ext: this.target[i].name.split('.').pop().toLowerCase(),
          size: this.target[i].size,
          lastModified: this.target[i].lastModified,
          hash: '',
          ban: [],
          status: ''
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

      // 二、计算
      let m = this.files.length
      let j = 0
      this.files.forEach((file) => {
        browserMd5File(this.target[file.id], (err, md5) => {
          j++
          this.step = this.steps.step3 + ' ' + j + '/' + m
          this.files[file.id].hash = md5
          console.log(err)
        })
      })
    },
    // change(e) {
    //   this.choose = false
    //   this.target = e.target.files
    //   //
    //   let n = e.target.files.length
    //   let c = 0
    //   for(let i=0; i<n; i++) {
    //     let file = e.target.files[i]
    //     let ext = file.name.split('.').pop()
    //     // 文件格式不符合要求，剔除
    //     if(this.types.length && -1 === this.types.indexOf(ext)) {
    //       this.files.splice(i, 1)
    //     } else {
    //       browserMd5File(file, (err, md5) => {
    //         this.files.push({
    //           id: i,
    //           name: file.name,
    //           size: this.getSize(file.size),
    //           type: file.type,
    //           md5: md5,
    //           lastModified: moment(file.lastModified).format('YYYY-MM-DD HH:mm:ss'),
    //           status: 'Ready'
    //         })
    //         this.status = ['Step 2: File loading... ', ++c, '/', n].join(' ')
    //         c == n && (this.status += ', Completed!') && (this.completed = true)
    //       })
    //     }
    //   }
    // }
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
  width: 240px;
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
</style>
