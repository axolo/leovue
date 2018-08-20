<template>
  <div>
    <ul>
      <li><router-link to="/">起步</router-link></li>
      <li><router-link to="/leovue-cmpt">兼容测试</router-link></li>
      <li><router-link to="/leo-dialog">leo-dialog</router-link></li>
      <li><router-link to="/leo-lodop">leo-lodop</router-link></li>
      <li><router-link to="/leo-export">leo-export</router-link></li>
      <li><router-link to="/leo-import">leo-import</router-link></li>
      <li><router-link to="/leo-upload">leo-upload</router-link></li>
    </ul>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>
ul {
  margin: 0;
  padding: 0
}
li {
  list-style: none;
  margin-bottom: 5px;
}
</style>
