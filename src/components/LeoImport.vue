<template>
  <div id="import-xls">
    <h4>文件</h4>
    <div class="json">{{file}}</div>
    <h4>数据</h4>
    <div class="json">{{data}}</div>
    <h4>导入</h4>
    <div class="json todo result" v-if="result">{{result}}</div>
    <input type="file" ref="file" @change="change">
    <button @click="toJSON">导入</button>
    <div class="json">如果您不了解格式，请下载 <a href="static/excel/导入模板.xlsx">模板文件</a>。</div>
  </div>
</template>

<script>
import xlsx from 'xlsx'
import browserMd5File from 'browser-md5-file'
export default {
  data() {
    return {
      data: '',
      file: '',
      result: ''
    }
  },
  methods: {
    toJSON() {
      let row = this.data.length
      this.result = '数据已转换为纯文本格式，并清除了无效行（空行），得到有效数据 '  + row + ' 行，服务器执行导入后的结果、失败的行号及失败原因需返回客户端以便排查。'
    },
    change(e) {
      this.result = ''
      let file = e.target.files[0]
      browserMd5File(file, (err, md5) => {
        this.file = {
          name: file.name,
          md5: md5,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified
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
      }
      if(rABS) {
        reader.readAsBinaryString(file)
      } else {
        reader.readAsArrayBuffer(file)
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
.result {
  margin-bottom: 5px;
}
</style>
