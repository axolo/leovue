<template>
  <div id="leo-dialog">
    <button @click="open">leo-dialog对话框</button>
    <leo-dialog :visible="visible" :title="'弹窗标题'" @close="close">
      <div class="main">弹窗内容</div>
    </leo-dialog>
  </div>
</template>

<script>
import { LeoDialog } from '../../../dist/leovue'
export default {
  components: { LeoDialog },
  data() {
    return {
      visible: false
    }
  },
  methods: {
    open() {
      this.visible = true
    },
    close() {
      this.visible = false
    }
  }
}
</script>

<style scoped>
  #leo-dialog {
    margin-top: 10px;
  }
  .main {
    padding: 20px;
    width: 80px;
    height: 40px;
  }
</style>
