<template>
  <div class="auth-contanier">
    <pc-auth-header></pc-auth-header>
    <div class="main">
      <div class="main-big w">
        <pc-notice @close="$store.dispatch('close_notice')"></pc-notice>
        <router-view></router-view>
      </div>
    </div>
    <pc-auth-footer></pc-auth-footer>
  </div>
</template>
<script>
  import PcAuthHeader from './header/index.vue';
  import PcAuthFooter from './footer/index.vue';
  import PcNotice from 'components/notice/index.vue';
  export default {
    components: {
      PcAuthHeader,
      PcAuthFooter,
      PcNotice
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
  .w {
    width: 100%;
    margin: 0 auto;
  }
  .auth-contanier {
    background-color: #f8f8f8;
    height: 100%;
  }

  .main-big {
    width: 1000px;
    height: 500px;
  }
</style>
