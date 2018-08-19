LeoVue
=======

[LeoVue](https://axolo.github.io/leovue) is a Vue.js component library written by Leo.


Install
-------
```bash
npm install @axolo/leovue --save
```


Import
------
```vue
<template>
  <div>
    <leo-dialog :visible="visible" :title="title" @close="close">
      <div class="main">{{content}}</div>
    </leo-dialog>
    <button @click="open">Dialog</button>
  </div>
</template>

<script>
import { LeoDialog } from '@axolo/leovue'
export default {
  components: { LeoDialog },
  data() { return {
    title: 'Hello',
    content: 'LeoVue',
    visible: false
  }},
  methods: {
    open()  { this.visible = true  },
    close() { this.visible = false }
  }
}
</script>
```
