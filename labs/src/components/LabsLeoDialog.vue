<template>
  <div>
    <h4>leo-dialog</h4>
    <p>对话框组件</p>
    <leo-dialog :visible="visible" :title="title" @close="close">
      <div class="main">{{content}}</div>
    </leo-dialog>
    <div>
      <label for="title">标题</label>
      <input type="text" name="title" v-model="title">
    </div>
    <div>
      <label for="content">内容</label>
      <input type="text" name="content" v-model="content">
    </div>
    <button @click="open">开启对话框</button>
  </div>
</template>

<script>
import LeoDialog from '../../../src/components/LeoDialog'
export default {
  components: { LeoDialog },
  data() {
    return {
      title: 'Hello',
      content: 'LeoVue',
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
  .main {
    padding: 20px;
  }
</style>
