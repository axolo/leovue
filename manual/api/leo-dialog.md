leo-dialog
==========

说明
----
对话框。

![对话框](./assets/leo-dailog.png)


代码
----

```vue
<template>
  <div>
    <button @click="open">leo-dialog对话框</button>
    <leo-dialog :visible="visible" :title="'弹窗标题'" @close="close">
      弹窗内容
    </leo-dialog>
  </div>
</template>

<script>
import LeoDialog from '@axolo/leovue'
export default {
  components: { LeoDialog },
  data() { return {
    visible: false
  }},
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
```

属性
----
|  名称   |  说明  |
| ------- | ------ |
| title   | 标题   |
| visible | 可见性 |


方法
----
| 名称  | 参数 |       说明        |
| ----- | ---- | ----------------- |
| close |      | 关闭`leo-dialong` |
