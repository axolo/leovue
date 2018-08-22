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
      :action="action">
    </leo-upload>
    <button @click="open">上传</button>
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
      types: ['zip', 'txt', 'jpg', 'png', 'pdf', 'exe', 'xls', 'xlsx'],
      action: {
        method: 'POST',
        url: 'https://sh.file.myqcloud.com'
      },
      rapid: {
        method: 'GET',
        url: 'http://localhost:7001/files/{{hash}}?token=666'
      }
    }
  },
  methods: {
    open() {
      this.visible = true
    }
  }
}
</script>

<style scoped>
</style>
