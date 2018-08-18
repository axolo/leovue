<template>
  <div>
    <leo-dialog :title="title" :visible="visible" @close="close">
      <div class="main">
        <div class="file">
          <input type="file" ref="file" @change="change">
          <span class="tips"><a v-bind:href="template">模板</a></span>
        </div>
        <div v-if="file && format && rows">
          <div class="tips">
            <table>
              <tbody>
                <tr><td class="th">文件名</td><td>{{file.name}}</td></tr>
                <tr><td class="th">大小</td><td>{{file.size}} (Bytes)</td></tr>
                <tr><td class="th">修改时间</td><td>{{file.lastModified}}</td></tr>
                <tr><td class="th">MIME</td><td>{{file.type}}</td></tr>
                <tr><td class="th">MD5</td><td>{{file.md5}}</td></tr>
                <tr><td class="th">有效行数</td><td>{{rows}}（首行不计）</td></tr>
              </tbody>
            </table>
          </div>
          <div class="import">
            <button @click="insert">导入</button>
            <span class="message">仅读取首个工作簿，请仔细核对以上数据</span>
          </div>
        </div>
        <div v-else>
          <div class="tips">{{loading}}</div>
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
button {
  border-radius: 3px;
  height: 24px;
}
.main {
  padding: 10px;
}
.tips {
  margin: 5px 0;
  font-size: small;
  color: #8492a6;
}
.tips ol {
  padding-left: 5px;
}
.import {
  margin-top: 5px;
}
.message {
  padding-left: 10px;
  font-size: small;
  color: #8492a6;
}
table {
  border-collapse: collapse;
  text-align: left
}
td {
  border: 1px solid darkgray;
  padding: 2px 5px;
}
td.th {
  text-align: center;
  font-weight: bold;
}
</style>
