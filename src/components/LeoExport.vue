<template>
  <div class="leo-export" @click="download">
    <slot></slot>
  </div>
</template>

<script>
import xlsx from 'xlsx'
import fileSaver from 'file-saver'
import moment from 'moment'
export default {
  name: 'LeoExport',
  props: {
    title:  { type: String, default: 'export' },
    data:   { required: true },
    sheet:  { type: String, default: 'Sheet1' },
    type:   { type: String, default: 'xls' }
  },
  methods: {
    download() {
      // 1. 定义文件格式
      const wopts = { bookType: this.type, bookSST: false, type: 'binary' }
      // 2. 定义工作簿
      const wb = { SheetNames: [this.sheet], Sheets: {}, Props: {} }
      // 3. 将转换好的数据写入工作簿
      wb.Sheets[this.sheet] = xlsx.utils.json_to_sheet(this.data)
      // 4. 转为Blob格式
      const blob = new Blob([this.s2ab(xlsx.write(wb, wopts))])
      const filename = [this.title, moment().format('YYYYMMDDHHmmss'), '.', this.type].join('')
      // 5. 调用fileSaver另存（也可以构建隐藏element，模拟点击下载）
      fileSaver.saveAs(blob, filename)
    },
    s2ab(s) {
      if (typeof ArrayBuffer !== 'undefined') {
          var buf = new ArrayBuffer(s.length);
          var view = new Uint8Array(buf);
          for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
          return buf;
      } else {
          var buf = new Array(s.length);
          for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
          return buf;
      }
    }
  }
}
</script>

<style scoped>
.leo-export {
  display: inline-block;
}
</style>
