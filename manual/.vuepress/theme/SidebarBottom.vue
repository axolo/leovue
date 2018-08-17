<template>
  <div class="sidebar-bottom">
    <div class="coding-net">
      Hosted by <a href="https://pages.coding.me" style="font-weight: bold">Coding Pages</a>
    </div>
    <div class="google-ads">
      <ins class="adsbygoogle"
        style="display:block"
        data-ad-client="ca-pub-4521521675997745"
        data-ad-slot="8498299482"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      js: [
        // { src: '/leovue/js/baidu-hm.js' },
        { src: '/leovue/js/google-ads.js' }
      ]
    }
  },
  mounted() {
    this.load(this.js)
  },
  methods: {
    load(js) {
      js.forEach(i => {
        let s = document.createElement('script')
        Object.assign(s, i)
        this.$el.appendChild(s)
      })
    }
  }
}
</script>

<style scoped>
.coding-net {
  border-top: 1px solid #E7EAED;
  font-size: 0.9em;
  text-align: center;
  padding: 5px 0;
  color: #909090;
}
.google-ads {
  margin: auto;
  text-align: center;
  max-height: 300px;
}
</style>
