<template>
  <div class="leo-export">
  </div>
</template>

<script>
import xlsx from 'xlsx'
import fileSaver from 'file-saver'
import mime from 'mime'
import moment from 'moment'
export default {
  name: 'LeoExport',
  props: {
    title: { type: String, default: 'export' },
    data:  { required: true },
    sheet: { type: String, default: 'Sheet1' },
    type:  { type: String, default: 'xls' },
    hits:  { type: Number, default: 0 }
  },
  watch: {
    hits: function(nv, ov) {
      this.download()
    }
  },
  methods: {
    download() {
      /**
       * 1. 定义工作表
       * 2. 定义工作簿
       * 3. 将转换好的数据写入工作簿（json_to_sheet）
       * 4. 转为Blob或File对象
       * 5. 调用fileSaver另存（也可以构建隐藏element，模拟点击下载）
       */
      const wopts = { bookType: this.type, bookSST: false, type: 'binary' }
      const wb = { SheetNames: [this.sheet], Sheets: {}, Props: {} }
      wb.Sheets[this.sheet] = xlsx.utils.json_to_sheet(this.data)
      const filename = [this.title, moment().format('YYYYMMDDHHmmss'), '.', this.type].join('')
      const filetype = mime.getType(this.type) + ";charset=utf-8"
      const file = new File([this.s2ab(xlsx.write(wb, wopts))], filename, { type: filetype })
      fileSaver.saveAs(file)
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
  display: none;
}
</style>
