<template>
  <div>
    <leo-import
      :title="title"
      :visible.sync="visible"
      :template="template"
      @insert="insert">
    </leo-import>
    <button @click="open">导入</button>
  </div>
</template>

<script>
import LeoImport from '../../../src/components/LeoImport'
export default {
  components: { LeoImport },
  data() {
    return {
      title: '导入工资表',
      visible: false,
      template: window.location.pathname + 'static/import/employees.xls',
      data: ''
    }
  },
  methods: {
    open() {
      this.visible = true
    },
    insert(data) {
      console.log(data)
    }
  }
}
</script>

<style scoped>
</style>
