<template>
  <div class="leo-export" @click="download">
    <slot></slot>
  </div>
</template>

<script>
import xlsx from 'xlsx'
import fileSaver from 'file-saver'
export default {
  name: 'LeoExport',
  props: ['data', 'sheet' ,'type'],
  methods: {
    download() {
      // 1. 定义文件格式
      const wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' }
      // 2. 定义工作簿
      const wb = { SheetNames: ['工资表'], Sheets: {}, Props: {} }
      // 3. 将转换好的数据写入工作簿
      wb.Sheets['工资表'] = xlsx.utils.json_to_sheet(this.data)
      // 4. 转为Blob格式
      const blob = new Blob([this.s2ab(jsXlsx.write(wb, wopts))])
      // 5. 调用fileSaver另存（也可以构建隐藏element，模拟点击下载）
      fileSaver.saveAs(blob, 'json.xlsx')
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
