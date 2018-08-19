<template>
  <div>
    <h4>leo-lodop</h4>
    <p>LODOP打印组件</p>
    <table>
      <thead>
        <tr>
          <th>编号</th>
          <th>名称</th>
          <th>网址</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id">
          <td>{{item.id}}</td>
          <td>{{item.name}}</td>
          <td>{{item.site}}</td>
        </tr>
      </tbody>
    </table>
    打印服务器：<input type="text" v-model="server">
    <button @click="print">打印</button>
    <leo-lodop
      :visible.sync="visible"
      :title="'网站列表'"
      :data="data"
      :templates="templates"
      :server="server">
    </leo-lodop>
  </div>
</template>

<script>
import { LeoLodop } from '../../../dist/leovue'
export default {
  components: { LeoLodop },
  data() { return {
    visible: false,
    server: 'http://localhost:8000',
    data: [
      { id: 1, name: '西阁码农', site: 'www.woodso.com' },
      { id: 2, name: 'Vue.js',   site: 'cn.vuejs.org'   },
      { id: 3, name: 'GitHub',   site: 'www.github.com' }
    ],
    templates: [{
      "id": 1,
      "label": "accounts",
      "name": "A4竖版",
      "bio": "自适应纸张",
      "url": window.location.pathname + "static/lodop/site-a4.html",
      "engine": "dot",
      "format": "TABLE",
      "params": {
        "left": "7.5%",
        "top": "7.5%",
        "width": "RightMargin:7.5%",
        "height": "BottomMargin:7.5%"
      },
      "default": false
    }, {
      "id": 2,
      "label": "accounts",
      "name": "POS小票",
      "bio": "80mm热敏纸",
      "url": window.location.pathname + "static/lodop/site-80mm.html",
      "engine": "dot",
      "format": "HTM",
      "params": {
        "left": "5%",
        "top": "1.0cm",
        "width": "RightMargin:5%",
        "height": "BottomMargin:1.0cm"
      },
      "default": true
    }]
  }},
  methods: {
    print() {
      this.visible = true
    },
    info(lodop) {
      console.log(lodop)
    }
  }
}
</script>

<style scoped>
</style>
