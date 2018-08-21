<template>
  <div>
    <leo-dialog :title="title" :visible="visible" @close="close">
      <div class="leo-tips leo-message">{{status}}</div>
      <input class="leo-input-file" type="file" @change="change" :multiple="multiple" v-if="choose">
      <div class="leo-tips" v-else>
        <table class="leo-table">
          <thead>
              <tr>
                <th class="leo-th">#</th>
                <th class="leo-th">Name</th>
                <th class="leo-th">Size</th>
                <th class="leo-th">MD5</th>
                <th class="leo-th">Status</th>
                <th class="leo-th">
                  <button class="leo-button-circle" @click="cancel" title="Remove all">x</button>
                </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(file, index) in files" :key="file.id">
              <td>{{++index}}</td>
              <td class="leo-td"><span class="leo-over" :title="file.name">{{file.name}}</span></td>
              <td class="leo-td leo-right">{{file.size | byte}}</td>
              <td class="leo-td leo-code">{{file.md5}}</td>
              <td class="leo-td leo-center">{{file.status}}</td>
              <td class="leo-td leo-center">
                <button class="leo-button-circle" @click="remove(index-1)" :title="'Remove '+index">x</button>
              </td>
            </tr>
          </tbody>
        </table>
        <button class="leo-button" @click="upload" v-if="completed">Upload</button>
      </div>
    </leo-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import browserMd5File from 'browser-md5-file'
import axios from 'axios'
import LeoDialog from './LeoDialog'
export default {
  name: 'LeoUpload',
  components: { LeoDialog },
  props: {
    title: { type: String },                     // 对话框标题
    visible: { type: Boolean },                  // 对话框可见性
    types: { type: Array, default: () => [] },   // 文件格式
    size: { type: Number, default: 0 },          // 最大文件大小
    count: { type: Number, default: 0 },         // 最多文件数量
    multiple: { type: Boolean, default: true },  // 多文件上传
    rapid: { type: String, default: '' },        // 急速上传（验证MD5地址）
    action: { type: String, default: '' }        // 上传地址
  },
  data() {
    return {
      status: '',             // 状态提示信息
      step: {},               // 步骤
      choose: true,           // 文件选择器可见
      completed: false,       // 加载完成（前端）
      files: [],              // 文件列表（中选）
      lose: [],               // 文件列表（落选）
      target: '',             // File对象（原始）
    }
  },
  mounted() {
    this.step.s1 = 'Step 1: Choose File'
    this.size && (this.step.s1 += ', size<=' + this.size)
    this.count && (this.step.s1 += ', qty<=' + this.count)
    this.types.length && (this.step.s1 += ', type: ' + this.types.join(', '))
    this.status = this.step.s1
  },
  filters: {
    byte: function(n) {
      if(n >= 1024 && n < 1048576) return (n/1024).toFixed(2) + ' KB'
      if(n >= 1048576) return (n/1048576).toFixed(2) + ' MB'
      return n + ' Bytes'
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    upload() {
      this.files.forEach((file) => {
        console.log(this.target[file.id])
      })
    },
    cancel() {
      this.files = []
      this.choose = true
      this.completed = false
      this.status = this.step.s1
    },
    remove(i) {
      this.files[i].ban.push('remove')    // 落选原因
      this.lose.push(this.files[i])       // 进入落选
      this.files.splice(i, 1)             // 退出中选
    },
    change(e) {
      /**
       * 多文件异步可筛选支持急速上传的上传组件
       * =======================================
       * STEP 1: 筛选
       * 1. 赋值
       *    监听文件框变化，保存target，赋值给files（注意ID对应）
       * 2. 过滤
       *    1). 类型：分析文件类型，允许的保留，其余的剔除。其结果转下一道筛选（ban: true）
       *    2). 大小：分析文件大小，超过的剔除。（ban: true）
       * 3. 超载
       *    统计经过各道筛选后剩余的数量，若仍超过允许数量，提示并要求重新选择。
       * STEP 2: 计算
       * 1. 计算哈希、格式化大小、计算状态，展现经过筛选的文件列表
       * 2. 用户可对展现的文件类别动态操作（ban: 'remove'）
       * STEP 3: 上传
       * 1. 若定义了急速上传，验证存在，则标记（status: 'rapid'）
       * 2. 异步上传筛选后经用户操作且未被标记可急速上传的文件（status: 'processor'）
       * 3. 上传成功，返回服务端hash（status: 'success'）
       * 4. 跟客户端hash对比一致（ban: 'hash'）
       * 5. 上传失败，允许重试上传，并更新状态（status: 'failed'）
       * STEP 4: 返回
       * 6. TODO: HASH不一致的是否删除？
       * 7. 通过事件传递上传结果给父组件
       */
      this.choose = false
      // STEP 1.1
      this.target = e.target.files
      let n = e.target.files.length
      for(let i=0; i<n; i++) {
        this.files.push({
          id: i,
          name: this.target[i].name,
          size: this.target[i].size,
          type: this.target[i].type,
          ext: this.target[i].name.split('.').pop().toLowerCase(),
          md5: '',
          ban: [],
          status: '',
          lastModified: this.target[i].lastModified
        })
      }
      console.log(this.files)
      // Step 1.2
    },
        //     let file = e.target.files[i]
        // Object.assign(file, { ban: [] })
        // let ext = file.name.split('.').pop()
        // this.types.length && -1 === this.types.indexOf(ext) && this.file.ban.push('type')
        // this.file.size > this.size  && this.file.ban.push('type')

    // change(e) {
    //   this.choose = false
    //   this.target = e.target.files
    //   //
    //   let n = e.target.files.length
    //   let c = 0
    //   for(let i=0; i<n; i++) {
    //     let file = e.target.files[i]
    //     let ext = file.name.split('.').pop()
    //     // 文件格式不符合要求，剔除
    //     if(this.types.length && -1 === this.types.indexOf(ext)) {
    //       this.files.splice(i, 1)
    //     } else {
    //       browserMd5File(file, (err, md5) => {
    //         this.files.push({
    //           id: i,
    //           name: file.name,
    //           size: this.getSize(file.size),
    //           type: file.type,
    //           md5: md5,
    //           lastModified: moment(file.lastModified).format('YYYY-MM-DD HH:mm:ss'),
    //           status: 'Ready'
    //         })
    //         this.status = ['Step 2: File loading... ', ++c, '/', n].join(' ')
    //         c == n && (this.status += ', Completed!') && (this.completed = true)
    //       })
    //     }
    //   }
    // }
  }
}
</script>

<style scoped>
.leo-button {
  border-radius: 3px;
  height: 24px;
}
.leo-button-circle {
  border-radius: 50%;
  border: none;
  cursor: pointer;
  color: darkslategrey;
}
.leo-main {
  padding: 10px;
}
.leo-tips {
  margin: 5px 0;
  font-size: small;
  color: darkslategrey;
}
.leo-tips ol {
  padding-left: 5px;
}
.leo-import {
  margin-top: 5px;
}
.leo-message {
  font-size: small;
  color: #8492a6;
}
.leo-table {
  font-family: monoca, 'DejaVu Sans Mono', 'Courier New', Courier, monospace;
  border-collapse: collapse;
  text-align: left;
}
.leo-td {
  border: 1px solid darkgray;
  padding: 2px 5px;
}
.leo-th {
  border: 1px solid darkgray;
  padding: 2px 5px;
  text-align: center;
  font-weight: bold;
}
.leo-right {
  text-align: right;
}
.leo-center {
  text-align: center;
}
.leo-over {
  width: 240px;
  text-overflow:ellipsis;
  white-space:nowrap;
  overflow:hidden;
  display:block;
}
</style>
