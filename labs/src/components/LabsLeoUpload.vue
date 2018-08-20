<template>
  <div>
  <h4>leo-import</h4>
    <p>数据导入组件</p>
    <leo-upload
      :title="title"
      :visible.sync="visible">
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
      title: '实验室上传',
      visible: false,
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
