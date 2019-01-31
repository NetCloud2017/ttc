<template>
  <div class="left" :style="{'height':mainContentHeight,'width':leftMenuWidth}" id='admin-left'>
    <div id='left-menu' :style="{'width':leftMenuWidthWrap}">
      <div class="toggle-menu" :style="{'width':leftMenuWidth}" @click='toggleMenu'>
        <i class="fa fa-bars" aria-hidden="true"></i>
      </div>
      <el-row class='tac'>
        <el-col :span="24">
          <!--defaultActive: {{defaultActive}}-->

          <el-menu :default-active="defaultActive" class="el-menu-vertical-demo" background-color="#fff" text-color="#1a1a1a" active-text-color="#ffd04b" router>
            <el-submenu :index="item.url" v-if='item.hasMenu' v-for='item in subMenuData' :key="item.id">
              <!--{{item.id}}-->
              <template slot="title">
                <i :class="item.icon"></i>
                <span class='menu-name' v-if="menuFlag">{{item.menuName}}</span>
              </template>

              <el-menu-item :style="{'padding-left':menuFlag? '20px' : '20px'}" :route='{path: subItem.url}' :index="subItem.url" v-for='subItem in item.subMenu' :key="subItem.id"
                            v-if='item.hasMenu'><!--{{subItem.id}}-->
                <el-tooltip class="item" effect="dark" placement="right" :disabled="menuFlag" :content="subItem.menuName">
                  <!--<i :class="subItem.icon"></i>-->
                  <!--<img src="../../../../assets/images/sidebar-arrow.png" alt="">-->
                  <i class="mali-menu-arrow"></i>
                </el-tooltip>
                <span class='menu-name' v-if="menuFlag">{{subItem.menuName}}</span>
              </el-menu-item>

            </el-submenu>

            <el-menu-item :index="item.url" v-else>
              <i :class="item.icon"></i>
              <span slot="title">{{item.menuName}}</span>
            </el-menu-item>

          </el-menu>

        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        subMenuData: [],
        defaultActive: '',
        win_size: {
          height: ''
        }
      };
    },
    computed: {
      leftMenuWidth () {
        return this.$store.getters.getLeftMenuWidth;
      },
      leftMenuWidthWrap() {
        let temp = this.$store.getters.getLeftMenuWidth.replace('px', '');
        return (Number(temp) + 15) + 'px';
      },
      menuFlag () {
        return this.$store.getters.getMenuFlag;
      },
      mainContentHeight () {
        return this.$store.getters.getMainContentHeight;
      },
      menuList () {
        return this.$store.getters.getMenuList;
      }
    },
    watch: {
      '$route': {
        handler: function(to, from) {
          let pathList = this.$route.path;
          let onePath = pathList.split('/')[1];
          if (onePath === 'index') {
            onePath = 'uas';
          }
          this.getMenuItem(onePath);
          this.$nextTick(() => {
            this.defaultActive = pathList;
          });
        },
        deep: true,
        immediate: true
      }
    },
    created() {
      let _this = this;
      let roleIdtemp = null;
      this.$pcBus.$on('roleId', function(roleId) {
        roleIdtemp = parseInt(roleId);
      });
      this.$pcBus.$on('logined', function(allMenuData) {
        console.log('roleId----', roleIdtemp);
        let code = _this.$route.path.split('/')[1];
        if (code === 'index' && roleIdtemp === 1) {
          code = 'uas';
        } else {
          code = 'wms';
        }
        if (allMenuData) {
          allMenuData.some((subItem) => {
            if (subItem.menuCode === code) {
              if (subItem.hasMenu) {
                _this.subMenuData = subItem.subMenu ? subItem.subMenu : [];
              }
            }
          });
        }
      });
    },
    methods: {
      getMenuItem (menuCode) {
        let allMenuData = this.menuList;
        if (allMenuData) {
          allMenuData.some((subItem) => {
            if (subItem.menuCode === menuCode) {
              if (subItem.hasMenu) {
                this.subMenuData = subItem.subMenu ? subItem.subMenu : [];
              }
            }
          });
        }
      },
      toggleMenu () {
        // 隐藏那个三角号的
        if (this.menuFlag) {
          document.querySelectorAll('.el-icon-arrow-down').forEach((item) => {
            item.style.display = 'none';
          });
        } else {
          document.querySelectorAll('.el-icon-arrow-down').forEach((item) => {
            item.style.display = 'block';
          });
        }
        this.$store.dispatch(this.menuFlag ? 'set_menu_close' : 'set_menu_open');
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  .tac {
    top: 0;
  }

  .fa {
    margin-right: 8px;
  }

  .left {
    position: fixed;
    float: left;
    top: 60px;
    overflow:hidden;
  }

  #left-menu {
    height: 100%;
    background: #fff;
    overflow-x: hidden;
    overflow-y: auto;

  }

  .toggle-menu {
    height: 27px;
    background: #fff;
    position: relative;
    top: 0;
    z-index: 1000;
    cursor: pointer;
    line-height: 27px;
    text-align: center;
    color: #333333;
    font-size: 14px;
    opacity: 1;
    transition: opacity .3s ease-out;

    &:hover {
      color: #1383f2;
      opacity: 1;
    }
  }
  .el-submenu__title:hover i,.el-submenu__title:hover i{
    color: #1383f2;
    opacity: 1;
  }
  .el-submenu.is-opened .el-submenu__icon-arrow{

  }
  .mali-menu-arrow{
    display: inline-block;
    width: 6px;
    height: 6px;
    background: url(../../../../assets/images/sidebar-arrow.png) no-repeat;
    position: relative;
    margin-right:12px;
  }
  .el-menu-item.is-active .mali-menu-arrow,.el-menu-item:hover .mali-menu-arrow{
    background: url(../../../../assets/images/sidebar-arrow-blue.png) no-repeat;
  }
  .el-submenu__title i{
    width:16px!important;
  }
  .el-submenu__title i{
    margin-right:3px;
  }
</style>
