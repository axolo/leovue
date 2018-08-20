<template>
  <div>
    <leo-dialog :title="title" :visible="visible" @close="close">
      <div class="leo-tips leo-status">{{status}}</div>
      <input class="leo-input-file" type="file" @change="change" :multiple="multiple" v-if="choose">
      <div class="leo-tips" v-else>
        <table class="leo-table">
          <thead>
              <tr>
                <th class="leo-th">#</th>
                <th class="leo-th">文件名</th>
                <th class="leo-th">大小</th>
                <th class="leo-th">MD5</th>
                <th class="leo-th">进度</th>
                <th class="leo-th">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(file, index) in files" :key="file.id">
              <td>{{++index}}</td>
              <td class="leo-td"><span class="leo-over" :title="file.name">{{file.name}}</span></td>
              <td class="leo-td leo-right">{{file.size}}</td>
              <td class="leo-td leo-code">{{file.md5}}</td>
              <td class="leo-td leo-center">{{file.id}}</td>
              <td class="leo-td leo-center">
                <button class="leo-button" @click="remove(index-1)">取消</button>
              </td>
            </tr>
          </tbody>
        </table>
        <button class="leo-button" @click="upload" v-if="completed">上传</button>
        <button class="leo-button" @click="cancel">取消</button>
      </div>
    </leo-dialog>
  </div>
</template>

<script>
import browserMd5File from 'browser-md5-file'
import moment from 'moment'
import axios from 'axios'
import LeoDialog from './LeoDialog'
export default {
  name: 'LeoUpload',
  components: { LeoDialog },
  props: {
    title: { type: String },                     // 对话框标题
    visible: { type: Boolean },                  // 对话框可见性
    types: { type: Array, default: () => [] },         // 文件格式
    size: { type: Number, default: 0 },         // 最大文件大小
    qty: { type: Number, default: 0 },          // 最多文件数量
    multiple: { type: Boolean, default: true }  // 多文件上传
  },
  data() {
    return {
      status: 'Step 1: Choose File(s)',
      choose: true,
      completed: false,
      files: [],
      ids: [],
      target: '',
    }
  },
  methods: {
    getSize(n) {
      if(n >= 1024 && n < 1048576) return (n/1024).toFixed(2) + ' KB'
      if(n >= 1048576) return (n/1048576).toFixed(2) + ' MB'
      return n + ' Bytes'
    },
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
      this.choose = true
      this.completed = false
      this.status = 'Step 1: Choose File(s)'
    },
    remove(i) {
      this.files.splice(i, 1)
    },
    change(e) {
      this.choose = false
      this.target = e.target.files
      let n = e.target.files.length
      let c = 0
      for(let i=0; i<n; i++) {
        let file = e.target.files[i]
        browserMd5File(file, (err, md5) => {
          this.files.push({
            id: i,
            name: file.name,
            size: this.getSize(file.size),
            type: file.type,
            md5: md5,
            lastModified: moment(file.lastModified).format('YYYY-MM-DD HH:mm:ss')
          })
          this.status = ['Step 2: Load', ++c, '/', n].join(' ')
          c == n && (this.status += ', Completed!') && (this.completed = true)
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
.leo-main {
  padding: 10px;
}
.leo-tips {
  margin: 5px 0;
  font-size: small;
  color: #8492a6;
}
.leo-tips ol {
  padding-left: 5px;
}
.leo-import {
  margin-top: 5px;
}
.leo-message {
  padding-left: 10px;
  font-size: small;
  color: #8492a6;
}
.leo-table {
  border-collapse: collapse;
  text-align: left;
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
.leo-code {
  font-family: monoca, 'Courier New', Courier, monospace
}
.leo-over {
  width: 240px;
  text-overflow:ellipsis;
  white-space:nowrap;
  overflow:hidden;
  display:block;
}
</style>
