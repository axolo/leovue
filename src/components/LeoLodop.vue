<template>
  <div>
    <leo-dialog :title="title" :visible="visible" @close='close'>
      <div class="leo-main">
        <span class="leo-label">打印模板：</span>
        <select class="leo-select" v-model="templateId" placeholder="请选择打印模板">
          <option
            v-for="item in templates"
            :key="item.id"
            :value="item.id">
            {{item.name}}（{{item.bio}}）
          </option>
        </select>
        <button class="leo-button" @click="print" title="打印">打印</button>
        <div class="leo-tips">
          <ol>
            <li>请根据建议选择相应的纸张，以免格式混乱。</li>
            <li>非专业人士切勿擅自修改打印模板。</li>
            <li>如有疑问请及时咨询系统管理员。</li>
            <li>当前LODOP（出错则使用最近正确配置）：<br><strong>{{lodop}}</strong></li>
          </ol>
        </div>
      </div>
    </leo-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import LeoDialog from './LeoDialog'
export default {
  name: 'LeoLodop',
  components: { LeoDialog },
  props: {
    title:      { type: String, default: '打印' },    // 标题
    data:       { },                                  // 数据
    templates:  { type: Array, required: true },      // 模版集
    visible:    { type: Boolean },                    // 可见性
    lodop:      { type: String, default: 'http://localhost:8000/CLodopfuncs.js' }   // LODOP
  },
  data() { return {
    templateId: ''    // 选中模版id
  }},
  mounted() {
    const defaultTemplate = _.find(this.templates, { default: true })
    const loadScript = require('load-script')
    defaultTemplate && (this.templateId = defaultTemplate.id)   // 默认模板
    window.LODOP || loadScript(
      this.lodop,
      { attrs: { ref: 'LeoLodop' } },
      (err, script) => { err && console.log(err)
    })
  },
  watch: {
    lodop: function(nv, ov) {
      // TODO: remove this.$refs.LeoLodop
      // TODO: if lodop uri is illegal, keep last LODOP
      // LODOP = undefined
      const loadScript = require('load-script')
      loadScript(nv, { attrs: { ref: 'LeoLodop' } }, (err, script) => { err && console.log(err) })
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    print() {
      const template = _.find(this.templates, { id: this.templateId })
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
        LODOP.PRINT_INIT(this.title)
        // 多格式支持，默认为TABEL格式
        switch(template.format.toUpperCase()) {
          default:
            LODOP.ADD_PRINT_TABLE(
              template.params.top,
              template.params.left,
              template.params.width,
              template.params.height,
              doc)
            break
          case 'HTM':
            LODOP.ADD_PRINT_HTM(
              template.params.top,
              template.params.left,
              template.params.width,
              template.params.height,
              doc)
            break
        }
        LODOP.PREVIEW()
      }).catch(err => {
        console.log(err)
      })
      this.close()
    }
  }
}
</script>

<style scoped>
.leo-select {
  height: 24px;
  border-radius: 5px;
  margin-right: 5px;
}
.leo-button {
  border-radius: 3px;
  height: 24px;
}
.leo-main {
  padding: 10px;
}
.leo-label {
  font-size: small;
  color: #8492a6;
}
.leo-tips {
  margin: 5%;
  font-size: small;
  color: #8492a6;
}
.leo-tips ol {
  padding-left: 5px;
}
</style>
