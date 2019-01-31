<template>
  <div class="page-wrap">
    <pc-header/>
    <div class="main-contanier">
      <left-menu/>
      <div class="right-content" :style="{width:rightContentWidth, marginLeft:leftMenuWidth, minHeight: mainContentHeight}"
           v-loading="$store.getters.getAjaxLoading" element-loading-text="拼命加载中">
        <div class="pc-page-content">
          <pc-notice @close="$store.dispatch('close_notice')"/>
          <bread/>
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import PcHeader from '../../header/index.vue';
  import LeftMenu from '../../left/menu/index.vue';
  import Bread from '../../header/bread/index.vue';
  import PcNotice from 'components/notice/index.vue';

  export default {
    name: 'home',
    data() {
      return {
        win_size: {
          height: '',
          width: '',
          rightWidth: ''
        }
      };
    },
    created() {
      this.intBrowser();
    },
    mounted () {
      this.setSize();
    },
    methods: {
      setSize () {
        const that = this;
        window.onresize = function temp () {
          that.intBrowser();
        };
      },
      intBrowser() {
        const that = this;
        that.win_size.width = that.getBrowserWidth() + 'px';
        that.win_size.height = that.getBrowserHeight() + 'px';
        that.$store.dispatch('set_browser_width', that.win_size.width);
        that.$store.dispatch('set_browser_height', that.win_size.height);
      }
    },
    computed: {
      leftMenuWidth () {
        return this.$store.getters.getLeftMenuWidth;
      },
      rightContentWidth () {
        this.intBrowser();
        return this.$store.getters.getRightContentWidth;
      },
      mainContentHeight () {
        return this.$store.getters.getMainContentHeight;
      }
    },
    components: {
      PcHeader,
      LeftMenu,
      Bread,
      PcNotice
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
  .right-content {
    float: right;
    width: 100%;
    overflow-y: auto;
    position: absolute;
    top: 0;
    /*background: #f5f8f9;*/
  }
</style>
