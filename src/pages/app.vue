<template>
  <div id="app">
    <f7-views>
      <f7-view main>
        <f7-pages>
          <f7-page name="index"></f7-page>
        </f7-pages>
      </f7-view>
    </f7-views>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    mounted () {
      Vue.nextTick(() => {
        this.$f7.mainView.router.reloadPage(this.$store.state.meter ? '/detail/index' : '/index/choose');
      });
    }
  }
</script>
