<template>
  <div class="dialog_box" v-if="visible">
    <div class="dialog">
      <div class="header">
        <span class="title">{{title}}</span>
        <button class="close" @click="close">X</button>
      </div>
      <div>
        <slot></slot>
      </div>
      <div class="footer">
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
.dialog_box {
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  text-align: center;
}
.dialog {
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
.header {
  vertical-align: middle;
  background-color: #43B17B;
}
.title {
  font-weight: bold;
  line-height: 175%;
  padding-left: 10px;
  color: #ffffff;
}
.close {
  border-radius: 25%;
  float: right;
  margin: 5px;
}
.footer {
  padding: 2px;
  background-color: #43B17B;
  vertical-align: middle;
  color: #ffffff;
  font-size: small;
}
</style>
