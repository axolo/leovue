<template>
  <div>
  <h4>leo-upload</h4>
    <p>文件上传组件</p>
    <leo-upload
      :title="title"
      :visible.sync="visible"
      :types="types"
      :size="50000000"
      :max="10"
      :multiple="true"
      :action="action"
      :rapid="rapid"
      @result="result">
    </leo-upload>
    <div class="input">
      <label for="action">文件上传服务地址：</label>
      <input type="text" class="url" name="action" v-model="action.url">
    </div>
    <div class="input">
      <label for="rapid">急速上传传值地址：</label>
      <input type="text" class="url" name="rapid" v-model="rapid.url">
      <div class="tip">
        如：急速上上传传值地址为
        <code>http://localhost:7001/files?md5=25feb93e5e1b18f5596f384f214b1242</code>，<br>
        则：<code>%%hash_value%%</code>即对应<code>25feb93e5e1b18f5596f384f214b1242</code>。
      </div>
    </div>
    <div class="input">
      <label for="hash_key">急速上传验证键名：</label>
      <input type="text" class="url" name="hash_key" v-model="rapid.hash_key">
      <div class="tip">
        如：访问以上急速验证地址后，
        返回<code>{ "md5": "25feb93e5e1b18f5596f384f214b1242" }</code>，<br>
        则：<code>hash_key</code>为键名<code>md5</code>
      </div>
    </div>
    <div class="input">
    <button @click="open">上传</button>
    </div>
  </div>
</template>

<script>
import LeoUpload from '../../../src/components/LeoUpload'
export default {
  components: { LeoUpload },
  data() {
    return {
      title: '多文件过滤异步急速上传',
      visible: false,
      types: ['zip', 'txt', 'csv', 'jpg', 'png', 'pdf', 'exe', 'xls', 'xlsx'],
      action: { method: 'POST', url: 'http://localhost:7001/files' },
      rapid: { method: 'GET', url: 'http://localhost:7001/files/%%hash_value%%', hash_key: 'md5' }
    }
  },
  methods: {
    result(res) {
      console.log(res)
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
code {
  padding: 0 5px;
}
</style>
