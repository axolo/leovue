<template>
  <div id="app">
    <div class="header">
      <h4>LeoVue</h4>
    </div>
    <div class="main">
      <div class="left">
        <Menu/>
      </div>
      <div class="right">
        <router-view/>
      </div>
    </div>
    <div class="footer">
      <address>&copy;2018, woodso.com.</address>
    </div>
  </div>
</template>

<script>
import Menu from './components/Menu'
export default {
  name: 'App',
  components: { Menu }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.main {
  padding: 10px;
}
.left {
  width: 150px;
  float: left;
  border-right: 1px solid darkgray;
}
.right {
  margin-left: 180px;
}
.header {
  border-bottom: 1px solid darkgray;
}
.footer {
  clear: both;
  border-top: 1px solid darkgray;
}
.header h4 {
  margin: 5px;
}
table {
  border-collapse: collapse;
  text-align: center;
}
caption {
  font-size: large;
  font-weight: bold;
}
th, td {
  border: 1px solid darkgray;
  padding: 3px 8px;
}
tfoot td {
  border: none;
}
</style>
