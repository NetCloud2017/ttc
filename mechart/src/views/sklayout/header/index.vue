<template>
  <header class="head-nav">
    <keep-alive>
    <el-row>
      <el-col :span="3" class='logo-container'>
        <span><img src="../../../assets/images/sk/logo.png" class='logo' alt="" @click="goHome"></span>
      </el-col>
      <el-col :span="17">
        <top-nav/>
      </el-col>
      <el-col :span="4" class="user-info">

        <span class="refresh" @click="reFresh"><i class="icon maliiconfont maliicon-img_comm_refresh"></i>&nbsp;刷新</span>
        <span class="name">{{userName}}</span>
        <span @click="logout" class="logout"><i class="icon maliiconfont maliicon-img_Administrator_qu"></i></span>
      </el-col>
    </el-row>
      </keep-alive>
    <el-dialog :title="dialog.title" :append-to-body="true"  :visible.sync="dialog.show" size="tiny" @close="dialog.show = false">
      <pc-update-pwd :loginName="loginName" v-if="dialog.show" ref="updatePwdForm"/>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" :loading="$store.getters.getButtonLoading" type="primary" @click="updatePwdFn">确认
        </el-button>
        <el-button size="small" @click="dialog.show = false">取消</el-button>
      </div>
    </el-dialog>
  </header>
</template>

<script type="text/ecmascript-6">
  /* eslint-disable */
  import topNav from './nav/index.vue';
  import pcUpdatePwd from '../../../views/uac/user/update-pwd/index.vue';
  import messageWindow from './messageWindow.vue';
  import Vue from 'vue';
  import layer from 'vue-layer';
  import {validateTips} from 'utils/tips';
  Vue.prototype.$layer = layer(Vue, {
    msgtime: 3
  });
  export default {
    data() {
      return {
        dialog: {
          show: false,
          title: '修改密码'
        },
        websocket: null
      };
    },
    created () {
    },
    computed: {
      loginName() {
        return this.$store.getters.getLoginName;
      },
      userName() {
        return this.$store.getters.getUserName;
      },
      accessToken() {
        return this.$store.getters.getAccessToken;
      },
      showNotify: function() {
        return this.$store.getters.getShowNoticePoint;
      },
      showPaddingTaskTip: function() {
        return this.$store.getters.getShowPaddingTaskPoint;
      }
    },
    methods: {
      openMessage(msg) {
        this.$notify({
          iconClass: 'icon icon-clolr-notify-message maliiconfont maliicon-img_detailse_authstr',
          title: msg.title,
          message: msg.msg,
          position: 'bottom-right'
        });
      },
      updatePwdFn() {
        this.$refs.updatePwdForm.submitForm((res) => {
          if (res && res.code === 200) {
            this.dialog.show = false;
            this.logout();
          }
        });
      },
      logoutFn() {
        this.$confirm(validateTips.IS_SURE_EXIST, '确认退出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.logout();
        });
      },
      setDialogInfo(cmdItem) {
        if (!cmdItem) {
          this.errorTip(validateTips.LACK_COMMAND);
          return;
        }
        switch (cmdItem) {
          case 'info':
            this.loadPage('userView', {'loginName': this.loginName});
            break;
          case 'pass':
            this.dialog.show = true;
            break;
          case 'home':
            this.goHome();
            break;
          case 'logout':
            this.logoutFn();
            break;
        }
      },
      pendingDialog(){
        this.$store.commit('setPaddingTaskTip', false);
        this.$layer.iframe({
          title: '待办事项',
          type: 2,
          skin: 'layer-alert-slider',
          offset: 'rt',
          move: false,
          area: ['400px', "360px"],
          icon: -1,
          btn: '确定',
          time: 0,
          shade: true,
          yes: '',
          cancel: '',
          tips: [2, {}],
          tipsMore: false,
          content: {
            content: messageWindow,
            parent: this,
            data: []
          }
        });
      },
      remindDialog(){
        this.$store.commit('setNotifyInfoTip', false);
        this.$layer.iframe({
          title: '消息提醒',
          type: 2,
          skin: 'layer-alert-slider',
          offset: 'rt',
          move: false,
          area: ['400px', "360px"],
          icon: -1,
          btn: '确定',
          time: 0,
          shade: true,
          yes: '',
          cancel: '',
          tips: [2, {}],
          tipsMore: false,
          shadeClose: true,
          content: {
            content: messageWindow,
            parent: this,
            data: []
          }
        });
      },
      reFresh() {
        var page = {};
        page.path = this.$route.path.split('/')[2];
        if(page.path == 'projectIndex') {
          page.query = this.$route.query.fromPage
        } else {
          page.query = '';
        }

        this.$pcBus.$emit('reFresh',page);
      },
    },
    components: {
      topNav, pcUpdatePwd
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  .sk .logo-container {
    height: 40px;
  }

  .sk .logo {
    height: 30px;
    width: auto;
    margin-left: 10px;
    margin-top: 5px;
    cursor: pointer;
  }

  .sk .fa-user {
    position: relative;
    top: -2px;
    margin-right: 4px;
  }

  .sk .head-nav {
    min-width:1000px;
    width: 100%;
    height: 40px;
    background: #1f2533;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 990;
    color: #333333;
    border-bottom:none!important;
  }
  .sk .head-nav .logout {
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    float: right;
    cursor: pointer;
  }

  .sk .user-info {
    text-align: right;
    box-sizing: border-box;
  }

  .sk .username {
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    float:left;
  }
  .sk .username .el-dropdown{
    font-size:14px;
  }
  .sk .user-info .item {
    position: relative;
    display: inline-block;
    width: 40px;
    text-align: center;
    cursor: pointer
  }

  .sk .user-info .item .redMask {
    position: absolute;
    display: inline-block;
    top: 0;
    right: 12px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ff6c2b
  }

  .sk .msgicon {
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    float: right;
    cursor: pointer;
  }
  .sk .user-info .item i{
    margin-top:10px;
    display: inline-block;
    color:#333333;
    font-size:20px!important;
    position: relative;
  }
  .sk .user-info .item i.maliicon-img_top_remind1{
    font-size:20px!important;
  }
  .sk #willDo{
    border-right:1px solid #e3e4e6;
    margin-top:15px;
  }
  .sk #messageNote{
    border-right:1px solid #e3e4e6;
    margin-top:15px;
    margin-right:20px;
  }
  .sk .user-info .item i:before{
    top:-4px;
    position: relative;
  }
  .sk .username .el-dropdown .el-dropdown-link img{
    margin-top:2px;
    vertical-align:top;
    margin-right:10px;
  }
  .sk .el-dropdown-link .name{
    max-width:100px;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    display: inline-block;
    vertical-align: top;
    font-size:14px;
  }
  .sk .el-dropdown-link .name+i{
    font-size: 24px;
    color: #000;
    position: relative;
    top: 1px;
  }
  .sk .user-info .item .reddot{
    position: absolute;
    display: inline-block;
    top: 20px;
    right: 12px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ff6c2b;
  }
  .sk .icon-clolr-notify-message {
    color: #ff6c2b;
  }
  .sk .el-dropdown-menu__item{
    color:#333;
    font-size: 14px!important;
  }
  .sk .logout{
    color:#fff!important;
  }
  .sk .el-dropdown-menu--small .el-dropdown-menu__item i{
    width:20px;
    display: inline-block;
  }
  .sk .user-info {
    color: #fff;
    height: 40px;
    line-height: 40px;
  }
  .sk .head-nav .user-info .logout{
    cursor:pointer;
  }
  .sk .user-info .refresh{
    margin-right:10px;
    cursor: pointer;
  }
  .sk .maliicon-img_comm_refresh{
    font-weight: 400;
    font-size:12px;
  }
</style>
