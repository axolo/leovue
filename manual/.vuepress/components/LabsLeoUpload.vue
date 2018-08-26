<template>
  <div>
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
    <h4>文件上传与服务器配置和返回密切相关，参数务必配合服务器</h4>
    <div class="input">
      <label for="action">文件上传地址：</label>
      <input type="text" class="url" name="action" v-model="action.url">
    </div>
    <div class="input">
      <label for="action_hash_path">上传验证键址：</label>
      <input type="text" class="url" name="action_hash_path" v-model="action.hash_path">
    </div>
    <div class="tip">
      若，上传成功返回：
      <code>{"data":[{"md5":"25feb93e5e1b18f5596f384f214b1242"}]}</code><br>
      则，<code>action.hash_path</code>对应为<code>data[0].md5</code><br>
      强烈建议服务器端再次验证本地hash，以防客户端伪装欺骗！！！
    </div>
    <hr>
    <div class="input">
      <label for="rapid">急速验证地址：</label>
      <input type="text" class="url" name="rapid" v-model="rapid.url">
      <div class="tip">
        <code>%%hash_value%%</code>占位符代表验证地址中的HASH字串</code>，提交时被替换
      </div>
    </div>
    <div class="input">
      <label for="rapid_hash_path">急速返回键址：</label>
      <input type="text" class="url" name="rapid_hash_path" v-model="rapid.hash_path">
      <div class="tip">
        若，验证成功返回：
        <code>{"data":[{"md5":"25feb93e5e1b18f5596f384f214b1242"}]}</code><br>
        则，<code>rapid.hash_path</code>对应为<code>data[0].md5</code><br>
        本示例配合本文档的 <a href="#服务器">服务器</a> 代码实现，请留意本示例的参数设置
      </div>
    </div>
    <hr>
    <div class="input">
      <button @click="open">上传</button>
      <button @click="clear" v-if="files.length">清除MD5列表</button>
    </div>
    <ol v-if="files.length" class="file-list">上传成功的文件MD5列表
      <li v-for="(file,index) in files" :key="index">
        <a :href="'http://localhost:7001/files/'+file.md5" target="_blank">{{file.md5}}</a></li>
    </ol>
  </div>
</template>

<script>
import { LeoUpload } from '@axolo/leovue'
export default {
  components: { LeoUpload },
  data() {
    return {
      files: [],
      title: '多文件过滤异步急速上传',
      visible: false,
      size: 5 * 1024 * 1024 * 1024,  // 500MB
      types: ['zip', 'txt', 'csv', 'jpg', 'png', 'pdf', 'exe', 'xls', 'xlsx', 'iso'],
      action: {
        method: 'POST',
        url: 'http://localhost:7001/files',
        hash_path: 'md5'
      },
      rapid: {
        method: 'GET',
        url: 'http://localhost:7001/files/%%hash_value%%',
        hash_path: 'md5'
      }
    }
  },
  methods: {
    result(res) {
      this.files = res
    },
    open() {
      this.visible = true
    },
    clear() {
      this.files = []
    }
  }
}
</script>

<style scoped>
#leo-upload {
  margin: 5px;
}
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
