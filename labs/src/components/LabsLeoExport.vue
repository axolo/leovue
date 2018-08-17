<template>
  <div id="export-xls">
    <div>
      <h4>数据</h4>
      <span class="json">{{data}}</span>
    </div>
    <div>
      <h4>方法一、<a href="https://github.com/zheeeng/export-from-json">Export From JSON</a></h4>
      <button @click="toCSV">Export From JSON 导出 csv</button>
      <span class="warning">（XLS格式是HTML的TABLE）</span>
    </div>
    <div>
      <h4>方法二、<a href="https://github.com/SheetJS/js-xlsx">js-xlsx</a></h4>
      <button @click="toXls">js-xlsx 导出 xls</button>
      <ol>
        <li>定义Excle文件对象</li>
        <li>定义Sheet工作簿对象</li>
        <li>将转换好的数据写入工作簿对象</li>
        <li>将文件对象转为Blob格式</li>
        <li>调用fileSaver另存，实现下载</li>
        <li>也可以构建隐藏element，模拟点击下载</li>
      </ol>
    </div>
  </div>
</template>

<script>
import exportFromJSON from 'export-from-json'
import xlsx from 'xlsx'
import fileSaver from 'file-saver'
export default {
  data() {
    return {
      data: [
        { name: '张三', age: 28, salary: 4500, post: '专员', dept: '行政' },
        { name: '李四', age: 30, salary: 5300, post: '设计师', dept: '设计' },
        { name: '王五', age: 29, salary: 4200, post: '前台', dept: '行政' },
        { name: '麻六', age: 25, salary: 4600, post: '专员', dept: '行政' },
        { name: '吴七', age: 24, salary: 4400, post: '专员', dept: '设计' },
        { name: '赵钱孙', age: 28, salary: 5200, post: '设计师', dept: '设计' },
        { name: '郭巨侠', age: 31, salary: 6100, post: '经理', dept: '行政' },
        { name: '李大嘴', age: 36, salary: 8000, post: '总经理', dept: '行政' },
        { name: '钱贵', age: 27, salary: 3900, post: '专员', dept: '设计' },
        { name: '孙无忌', age: 26, salary: 5400, post: '主管', dept: '行政' }
      ]
    }
  },
  methods: {
    toCSV() {
      exportFromJSON({
        data: this.data,
        fileName: 'download',
        exportType: exportFromJSON.types.csv
      })
    },
    toXls() {
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
.json {
  font-size: 0.9em;
}
.warning {
  background-color: lightyellow;
  padding: 2px;
}
</style>
