<template>
  <div id="lodop">
    <leo-dialog :title="title" :visible="visible" @close='close'>
      <div class="main">
        <span class="label">打印模板：</span>
        <select v-model="templateId" placeholder="请选择打印模板">
          <option
            v-for="item in templates"
            :key="item.id"
            :value="item.id">
            {{item.name}}（{{item.bio}}）
          </option>
        </select>
        <button @click="print" title="打印">打印</button>
        <div class="tips">
          <ol>
            <li>请根据建议选择相应的纸张，以免格式混乱。</li>
            <li>非专业人士切勿擅自修改打印模板。</li>
            <li>如有疑问请及时咨询系统管理员。</li>
            <li>当前打印服务器：<strong>{{lodop.strHostURI}}</strong></li>
          </ol>
        </div>
      </div>
    </leo-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import LeoDialog from './LeoDialog'
window.LODOP || require('./leo-lodop/CLodopfuncs')
export default {
  name: 'LeoLodop',
  components: { LeoDialog },
  props: {
    title:      { type: String, default: '打印' },                // 标题
    data:       { },                                              // 数据
    templates:  { type: Array, required: true },                  // 模版集
    visible:    { type: Boolean },                                // 可见性
    server:     { type: String, default: LODOP.strHostURI }       // 打印服务器
  },
  data() {
    return {
      lodop: LODOP,     // 本地LODOP
      templateId: ''    // 选中模版id
    }
  },
  mounted() {
    const defaultTemplate = _.find(this.templates, { default: true })
    defaultTemplate && (this.templateId = defaultTemplate.id)   // 默认模板
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    print() {
      const template = _.find(this.templates, {id: this.templateId})
      const axios = require('axios')
      let doc = ''
      axios.get(template.url).then(res => {
        // 多模板引擎支持，默认为doT.js
        switch(template.engine) {
          default:
            const doT = require('dot')
            doc = doT.template(res.data)(this.data)
            break
        }
        this.lodop.PRINT_INIT(this.title)
        // 多格式支持，默认为TABEL格式
        switch(template.format.toUpperCase()) {
          default:
            this.lodop.ADD_PRINT_TABLE(
              template.params.top,
              template.params.left,
              template.params.width,
              template.params.height,
              doc)
            break
          case 'HTM':
            this.lodop.ADD_PRINT_HTM(
              template.params.top,
              template.params.left,
              template.params.width,
              template.params.height,
              doc)
            break
        }
        this.lodop.PREVIEW()
      }).catch(err => {
        console.log(err)
      })
      this.close()
    }
  }
}
</script>

<style scoped>
select {
  height: 24px;
  border-radius: 5px;
  margin-right: 5px;
}
button {
  border-radius: 3px;
  height: 24px;
}
.main {
  padding: 10px;
}
.item-bio {
  float: right;
  font-size: x-small;
  color: #8492a6;
}
.label {
  font-size: small;
  color: #8492a6;
}
.tips {
  margin: 5%;
  font-size: small;
  color: #8492a6;
}
.tips ol {
  padding-left: 5px;
}
</style>
