<template>
  <div>
    <leo-dialog :title="title" :visible="visible" @close="close">
      <div class="leo-main">
        <div class="leo-file">
          <input type="file" ref="file" @change="change">
          <span class="leo-tips"><a v-bind:href="template">模板</a></span>
        </div>
        <div v-if="file && format && rows">
          <div class="leo-tips">
            <table class="leo-table">
              <tbody>
                <tr><td class="leo-th">文件名</td><td class="leo-td">{{file.name}}</td></tr>
                <tr><td class="leo-th">大小</td><td class="leo-td">{{file.size}} (Bytes)</td></tr>
                <tr><td class="leo-th">修改时间</td><td class="leo-td">{{file.lastModified}}</td></tr>
                <tr><td class="leo-th">MIME</td><td class="leo-td">{{file.type}}</td></tr>
                <tr><td class="leo-th">MD5</td><td class="leo-td">{{file.md5}}</td></tr>
                <tr><td class="leo-th">有效行数</td><td class="leo-td">{{rows}}（首行不计）</td></tr>
              </tbody>
            </table>
          </div>
          <div class="leo-import">
            <button class="leo-button" @click="insert">导入</button>
            <span class="leo-message">仅读取首个工作簿，请仔细核对以上数据</span>
          </div>
        </div>
        <div v-else>
          <div class="leo-tips">{{loading}}</div>
        </div>
      </div>
    </leo-dialog>
  </div>
</template>

<script>
import xlsx from 'xlsx'
import browserMd5File from 'browser-md5-file'
import moment from 'moment'
import LeoDialog from './LeoDialog'
export default {
  name: 'LeoImport',
  components: { LeoDialog },
  props: {
    title: { type: String },
    visible: { type: Boolean },
    template: { type: String },
    type: { type: Array, default: () => { return ['xls', 'csv', 'xlsx']} }
  },
  data() {
    return {
      data: '',
      file: '',
      rows: 0,
      loading: '',
      format: false
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    insert() {
      this.$emit('insert', this.data)
      this.close()
    },
    change(e) {
      this.rows = 0
      this.loading = 'loading...'
      let file = e.target.files[0]
      let ext = file.name.split('.').pop()
      if(-1 === this.type.indexOf(ext)) {
        this.format = false
        this.loading = '格式错误！仅允许以下格式：' + this.type.join(', ')
      } else {
        this.format = true
        browserMd5File(file, (err, md5) => {
          this.file = {
            name: file.name,
            md5: md5,
            size: file.size,
            type: file.type,
            lastModified: moment(file.lastModified).format('YYYY-MM-DD HH:mm:ss')
          }
        })
        let reader = new FileReader();
        let rABS = true
        let that = this   // 注意作用域
        reader.onload = function(e) {
          let result = e.target.result;
          if(!rABS) result = new Uint8Array(result);
          let workbook = xlsx.read(result, {type: rABS ? 'binary' : 'array'})
          that.data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
          that.rows = that.data.length
        }
        if(rABS) {
          reader.readAsBinaryString(file)
        } else {
          reader.readAsArrayBuffer(file)
        }
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
  text-align: left
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
</style>
