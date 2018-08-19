<template>
  <div>
    <h4>leo-export</h4>
    <p>数据导出组件</p>
    <table>
      <caption>工资表</caption>
      <thead>
        <tr>
          <th>姓名</th>
          <th>年龄</th>
          <th>工资</th>
          <th>岗位</th>
          <th>部门</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>{{item.name}}</td>
          <td>{{item.age}}</td>
          <td>{{item.salary}}</td>
          <td>{{item.post}}</td>
          <td>{{item.dept}}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td>月份：</td>
          <td colspan="2">2018年7月</td>
          <td>制表：</td>
          <td>张三</td>
        </tr>
      </tfoot>
    </table>
    <button @click="hits++">导出Excel</button>
    <leo-export
      :title="'工资表'"
      :sheet="'201807'"
      :type="'xls'"
      :data="data"
      :hits="hits">
    </leo-export>
  </div>
</template>

<script>
import { LeoExport } from '../../../dist/leovue'
export default {
  components: { LeoExport },
  data() {
    return {
      hits: 0,
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
      ]
    }
  }
}
</script>

<style scoped>
</style>
