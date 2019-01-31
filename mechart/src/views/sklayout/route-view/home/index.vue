<template>
  <!--<div class="page-wrap">-->
    <!--<pc-header/>-->
    <!--<div class="main-contanier">-->
      <!--<left-menu/>-->
      <!--<div class="right-content" :style="{width:rightContentWidth, marginLeft:leftMenuWidth, minHeight: mainContentHeight}"-->
           <!--v-loading="$store.getters.getAjaxLoading" element-loading-text="拼命加载中">-->
        <!--<div class="pc-page-content">-->
          <!--<pc-notice @close="$store.dispatch('close_notice')"/>-->
          <!--<bread/>-->
          <!--<router-view></router-view>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
  <!--</div>-->
  <div class="sk">
    <pc-header/>
    <div class="sk-container" :style="{minHeight:skHeight}" v-loading="$store.getters.getAjaxLoading" element-loading-text="拼命加载中">
      <pc-notice @close="$store.dispatch('close_notice')"/>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <pc-footer></pc-footer>
  </div>
</template>
<script>
  import PcHeader from '../../header/index.vue';
  import LeftMenu from '../../left/menu/index.vue';
  import Bread from '../../header/bread/index.vue';
  import PcNotice from 'components/notice/index.vue';
  import PcFooter from '../../footer/index.vue';

  export default {
    name: 'home',
    data() {
      return {
        win_size: {
          height: '',
          width: '',
          rightWidth: ''
        },
        skHeight: '600px'
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
        that.win_size.width = that.getBrowserWidth();
        that.win_size.height = that.getBrowserHeight();
        console.log('that.win_size.height ' + that.win_size.height.replace(/px/, ''));
        that.skHeight = (that.win_size.height.replace(/px/, '') - 80) + 'px';
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
      PcNotice,
      PcFooter
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
.sk{
  padding-top:40px;
  box-sizing: border-box;
}
.sk-container{
  width:100%;
  color:#fff;
  box-sizing: border-box;
  padding:10px 20px;
}
</style>
