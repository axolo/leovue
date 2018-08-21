<template>
  <div class="leo-dialog-box" v-if="visible">
    <div class="leo-dialog">
      <div class="leo-header">
        <span class="leo-title">{{title}}</span>
        <button class="leo-close" @click="close" title="Close Dialog">X</button>
      </div>
      <div class="leo-content">
        <slot></slot>
      </div>
      <div class="leo-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeoDialog',
  props: ['visible', 'title'],
  methods: {
    close() {
      this.$emit('close', false)
    }
  }
}
</script>

<style scoped>
.leo-dialog-box {
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  text-align: center;
}
.leo-dialog {
  position: relative;
  display: inline-block;
  top: 20vh;
  margin: auto;
  text-align: left;
  z-index: 105;
  opacity: 1;
  background: white;
  border: 3px solid #43B17B;
  border-radius: 10px;
  word-wrap: break-word;
}
.leo-header {
  vertical-align: middle;
  background-color: #43B17B;
}
.leo-title {
  font-weight: bold;
  line-height: 175%;
  padding-left: 10px;
  color: #ffffff;
}
.leo-close {
  border-radius: 25%;
  cursor: pointer;
  float: right;
  margin: 5px;
}
.leo-footer {
  padding: 2px;
  background-color: #43B17B;
  vertical-align: middle;
  color: #ffffff;
  font-size: small;
}
.leo-content {
  padding: 5px;
}
</style>
