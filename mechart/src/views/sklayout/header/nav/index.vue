<template>
  <el-menu :default-active="activeIndex" mode="horizontal" background-color="#1f2533" text-color="#fff" active-text-color="#990808" router>
    <el-menu-item v-for="(item,index) in menuList" :route='{path: item.url}' :key="item.id" :index="index + 'sk' " >{{item.menuName}}</el-menu-item>
  </el-menu>
</template>

<script>
  export default {
    data () {
      return {
        activeIndex: '0sk'
      };
    },
    mounted () {
//      this.$router.push({path: '/skclient/home'});
//      this.activeOneIndex();
      this.active();
    },
    watch: {
      '$route': 'active'
    },
    computed: {
      menuList () {
        var menu = this.$store.getters.getMenuList;
        var MenuList;
        if (menu) {
          menu.forEach(function(item, index) {
            if (item.menuCode === 'skclient') {
              MenuList = item.subMenu;
            }
          });
          MenuList[0].menuCode = 'home';
          MenuList[1].menuCode = 'marketIndex';
          MenuList[2].menuCode = 'projectIndex?fromPage=2';
          MenuList[3].menuCode = 'gradeIndex';
          MenuList[4].menuCode = 'projectIndex?fromPage=1';
        }
        return MenuList;
      }
    },
    methods: {
      active () {
        var href = window.location.href;
        var index = '0' + 'sk';
        if (href.indexOf('home') > 0) {
          index = '0' + 'sk';
        }
        if (href.indexOf('marketIndex') > 0) {
          index = '1' + 'sk';
        }
        if (href.indexOf('projectIndex?fromPage=2') > 0) {
          index = '2' + 'sk';
        }
        if (href.indexOf('macroIndex') > 0) {
          index = '3' + 'sk';
        }
        if (href.indexOf('gradeIndex') > 0) {
          index = '4' + 'sk';
        }
        if (href.indexOf('projectIndex?fromPage=1') > 0) {
          index = '5' + 'sk';
        }
        console.log('index ' + index);
        this.activeIndex = index;
      }
    }
  };
</script>
<style scoped>
  .sk .el-menu{
    margin-top:0px;
  }
  .sk .el-menu--horizontal>.el-menu-item{
    height: 40px;
    line-height: 45px;
  }
  .sk .el-menu--horizontal > .el-menu-item.is-active{
    background: transparent!important;
  }
  .sk .el-menu-item:hover {
    background: transparent!important;
    color: #990808 !important;
    font-weight: bold;
  }
  .sk .el-menu-item.is-active {
    color: #990808 !important;
    border-bottom-color: #990808 !important;
    font-weight: bold;
  }
  .sk .el-menu--horizontal > .el-menu-item.is-active:before{
    background: #990808 !important;
  }
  .sk .el-menu-item:hover:before{
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background: #990808 !important;
  }
  .sk .el-menu.el-menu--horizontal{
    border-bottom:none!important;
  }
</style>
