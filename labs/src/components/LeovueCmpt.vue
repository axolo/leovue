<template>
  <div>
    <h4>兼容性测试</h4>
    <div>
      <ul>
        <li>不带元素的功能插件，利用watch属性来实现。</li>
        <li>实现UI兼容性，避免侵入是设计</li>
        <li>实现风格统一，功能都以标签化实现</li>
      </ul>
    </div>
    <div>
      <h4>本次兼容测试采用ElementUI，标签组依次为</h4>
      <ol>
        <li>ElementUI自带的组件：el-dialog</li>
        <li>带UI的LeoVue组件：leo-dialog</li>
        <li>不带UI的LeoVue组件：leo-export</li>
      </ol>
    </div>
    <leo-dialog :title="'LeoVue'" :visible="visible" @close="close">LeoVue Dialog</leo-dialog>
    <leo-export :title="'工资表'" :sheet="'201807'" :type="'xls'" :data="data" :hits="hits"/>
    <el-dialog :title="'ElementUI'" :visible.sync="elVisible">ElementUI Dialog</el-dialog>
    <div>
      <el-button-group>
        <el-button type="primary" icon="el-icon-warning" @click="dialog"></el-button>
        <el-button type="primary" icon="el-icon-info" @click="open"></el-button>
        <el-button type="primary" class="el-icon-download" @click="hits++"></el-button>
      </el-button-group>
      <address>其实Element自身也做不到标签兼容</address>
    </div>
  </div>
</template>

<script>
import { LeoExport, LeoDialog } from '../../../dist/leovue'
export default {
  components: { LeoExport, LeoDialog },
  data() { return {
    data: [
      { name: '张三', age: 28, salary: 4500, post: '专员', dept: '行政' },
      { name: '李四', age: 30, salary: 5300, post: '设计师', dept: '设计' },
      { name: '王五', age: 29, salary: 4200, post: '前台', dept: '行政' },
      { name: '麻六', age: 25, salary: 4600, post: '专员', dept: '行政' },
      { name: '吴七', age: 24, salary: 4400, post: '专员', dept: '设计' },
      { name: '赵钱孙', age: 28, salary: 5200, post: '设计师', dept: '设计' },
      { name: '郭巨侠', age: 31, salary: 6100, post: '经理', dept: '行政' },
      { name: '李大嘴', age: 36, salary: 8000, post: '总经理', dept: '行政' },
      { name: '钱贵', age: 27, salary: 3900, post: '专员', dept: '设计' },
      { name: '孙无忌', age: 26, salary: 5400, post: '主管', dept: '行政' }
    ],
    visible: false,
    elVisible: false,
    hits: 0
  }},
  methods: {
    open() {
      this.visible = true
    },
    close() {
      this.visible = false
    },
    dialog() {
      this.elVisible = true
    }
  }
}
</script>

<style scoped>
</style>
