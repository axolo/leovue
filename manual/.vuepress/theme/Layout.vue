<template>
  <Layout>
    <SidebarBottom slot="sidebar-bottom"/>
  </Layout>
</template>

<script>
import Layout from '@default-theme/Layout.vue'
import SidebarBottom from './SidebarBottom.vue'
export default {
  components: {
    Layout,
    SidebarBottom
  }
}
</script>
