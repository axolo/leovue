leo-lodop
=========

示例
----
<ClientOnly>
  <labs-leo-lodop/>
</ClientOnly>

说明
----
调用LODOP打印。[LODOP演示及文档](http://www.lodop.net/LodopDemo.html)细节不够完美，需要自行测试。如：
- HTM格式：矢量打印，文字非常清晰
- HTML格式：整个文档转换为低画质图片后打印 :(

#### 前提条件
- [LODOP](http://www.lodop.net/)
- [Lodash](https://www.lodashjs.com/)
- [doT.js](https://github.com/defunkt/dotjs)
- [axios](https://github.com/axios/axios)

#### 模板选择对话框
![模板选择对话框](./assets/leo-lodop-dialog.png)

#### 打印预览
![打印预览](./assets/leo-lodop-preview.png)


代码
----

```vue
<template>
  <div id="leo-lodop">
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
    <button @click="print">打印</button>
    <leo-lodop
      :visible.sync="visible"
      :title="'网站列表'"
      :data="data"
      :templates="templates">
    </leo-lodop>
  </div>
</template>

<script>
import { LeoLodop } from '@axolo/leovue'
export default {
  components: { LeoLodop },
  data() { return {
    visible: false,
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
      "url": "/leovue/static/lodop/site-a4.html",
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
      "url": "/leovue/static/lodop/site-80mm.html",
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
#leo-lodop {
  margin: 5px;
}
</style>
```

::: tip 打印模板
doT.js格式打印模板
:::

```html
<!-- site-80mm.html (HTML with doT.js Template) -->
<style>
  .label { font-weight: bold; }
  .label:after { content: '：'; }
  .main { font-size: small; margin-bottom: 10; }
  h4 { margin: 5 0; }
  hr { border: 1px dashed darkgray; }
</style>
<h4>网站列表</h4>
<hr>
<div class="main">{{~it:v:i}}
  <div>
    <span class="label">序号</span>
    <span class="content">{{=v.id}}</span>
  </div>
  <div>
    <span class="label">名称</span>
    <span class="content">{{=v.name}}</span>
  </div>
  <div>
    <span class="label">网址</span>
    <span class="content">{{=v.site}}</span>
  </div>
  </div>
  <hr>{{~}}
</div>
<div>制表：</div>

```

属性
----
|   名称    |  类型   |      说明      |      默认值      | 必填 |
| --------- | ------- | -------------- | ---------------- | ---- |
| visible   | Boolean | 可见性         |                  |      |
| title     | String  | 标题           |                  |      |
| data      | Object  | 需要打印的数据 |                  |      |
| templates | Array   | 打印模板列表   |                  | 是   |
| server    | String  | 指定打印服务器 | LODOP.strHostURI |      |

::: tip LODOP.strHostURI
通常情况下，默认值是：`http://localhost:8000`
:::

方法
----
|  名称  |      值      |            说明            |
| ------ | ------------ | -------------------------- |
