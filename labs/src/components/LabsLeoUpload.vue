<template>
  <div>
  <h4>leo-upload</h4>
    <p>文件上传组件</p>
    <leo-upload
      :title="title"
      :visible.sync="visible"
      :types="types"
      :size="size"
      :max="10"
      :multiple="true"
      :action="action"
      :rapid="rapid"
      @result="result">
    </leo-upload>
    <div class="input">
      <label for="action">文件上传地址：</label>
      <input type="text" class="url" name="action" v-model="action.url">
    </div>
    <div class="input">
      <label for="rapid">急传取值地址：</label>
      <input type="text" class="url" name="rapid" v-model="rapid.url">
      <div class="tip">
        如：急传取值地址为<code>http://localhost:7001/files?md5=25feb93e5e1b18f5596f384f214b1242</code>，<br>
        则：<code>%%hash_value%%</code>即对应地址中的<code>25feb93e5e1b18f5596f384f214b1242</code>。
      </div>
    </div>
    <div class="input">
      <label for="hash_key">急传返回键名：</label>
      <input type="text" class="url" name="hash_key" v-model="rapid.hash_key">
      <div class="tip">
        如：从急传取值地址返回<code>{ "md5": "25feb93e5e1b18f5596f384f214b1242" }</code>，<br>
        则：<code>hash_key</code>为返回中对应的键名<code>md5</code>
      </div>
    </div>
    <div class="input">
      <button @click="open">上传</button>
    </div>
    <ol v-if="files.length" class="file-list">上传成功的文件MD5列表
      <li v-for="(file,index) in files" :key="index">{{file.md5}}</li>
    </ol>
  </div>
</template>

<script>
import LeoUpload from '../../../src/components/LeoUpload'
export default {
  components: { LeoUpload },
  data() {
    return {
      files: [],
      title: '多文件过滤异步急速上传',
      visible: false,
      size: 5 * 1024 * 1024 * 1024,  // 500MB
      types: ['zip', 'txt', 'csv', 'jpg', 'png', 'pdf', 'exe', 'xls', 'xlsx', 'iso'],
      action: { method: 'POST', url: 'http://localhost:7001/files' },
      rapid: { method: 'GET', url: 'http://localhost:7001/files/%%hash_value%%', hash_key: 'md5' },
      download: { method: 'GET', url: 'http://localhost:7001/files/%%hash_value%%?download=true' }
    }
  },
  methods: {
    result(res) {
      this.files = res
    },
    open() {
      this.visible = true
    }
  }
}
</script>

<style scoped>
.input {
  margin-bottom: 5px;
}
.url {
  width: 300px;
}
.tip {
  font-size: small;
  color: darkcyan;
}
.file-list {
  font-family: 'Courier New', Courier, monospace;
  font-size: small;
}
code {
  padding: 0 5px;
}
</style>
