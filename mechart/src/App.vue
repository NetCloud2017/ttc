<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    watch: {
      '$route': 'rs'
    },
    methods: {
      rs() {
        if (!this.accessToken) {
          console.info('accessToken is null');
          window.location.href = process.env.JUMP_LOGIN_PAGE; // 'http://login.malicloud.net';
        }
      }
    },
    computed: {
      accessToken() {
        return this.$store.getters.getAccessToken;
      }
    },
    created() {
//      let comStatus = this.$store.getters.getCompanyStatus;
//      if (comStatus !== 1) {
//        this.loadPage('editinfo');
//      } else {
//        this.loadPage('Index');
//      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
  @import './assets/styles/index.scss';
</style>
