<template>
  <header class="head-nav">
    <keep-alive>
    <el-row>
      <el-col :span="4" class='logo-container'>
        <img src="../../../assets/images/logo.png" class='logo' alt="" @click="goHome">
      </el-col>
      <el-col :span="16">
        <top-nav/>
      </el-col>
      <el-col :span="4" class="user-info">
        <!--待办事项-->
					<!--<span class="item pending" id="willDo" style="float: left;" @click="pendingDialog">
						<span class="redMask" id="willDoRedP" v-show="showPaddingTaskTip"></span>
						<i class="icon maliiconfont maliicon-img_top_pending1"></i>
					</span>
        &lt;!&ndash;消息提醒&ndash;&gt;
					<span class="item remind" id="messageNote" style="float: left;" @click="remindDialog">
						<span class="redMask" id="messageRedP" v-show="showNotify"></span>

						<i class="icon maliiconfont maliicon-img_top_remind1"></i>
					</span>-->
        <span class='username'>
          <el-dropdown trigger="click" @command='setDialogInfo'>
            <span class="el-dropdown-link">
                 <img src="../../../assets/images/portrait.png" alt="">
                <span class="name">{{userName}}</span><i class="icon maliiconfont maliicon-img_select_down_x"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command='info'><i class="icon maliiconfont maliicon-img_register_user"></i>个人信息</el-dropdown-item>
              <el-dropdown-item command='pass'><i class="icon maliiconfont maliicon-img_Administrator_to"></i>修改密码</el-dropdown-item>
              <el-dropdown-item command='home'><i class="icon maliiconfont maliicon-img_register_home"></i>返回主页</el-dropdown-item>
              <el-dropdown-item command='logout' class="logout" divided><i class="icon maliiconfont maliicon-img_Administrator_qu"></i>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
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
      //页面刚进入时开启长连接
//      this.initWebSocket();
//      this.showNotify = this.shouldShowNotify;
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
//        console.log(" --computed-showNotify 1111: " + this.$store.getters.getShowNoticePoint);
        return this.$store.getters.getShowNoticePoint;
      },
      showPaddingTaskTip: function() {
//        console.log(" --computed-showPaddingTaskTip 111: " + this.$store.getters.getShowPaddingTaskPoint);
        return this.$store.getters.getShowPaddingTaskPoint;
      }
    },
    methods: {
//      initWebSocket(){ //初始化weosocket
//
////        const wsuri = dev.env.WS_API + "/websocket/threadsocket";//ws地址
////        this.websocket = new WebSocket("ws://127.0.0.1:9999/socketServer/sonar");
//
//        this.websocket = new WebSocket(this.$API_WESOCKET + "maliWebSocketServer?access_token=" + this.accessToken);
//        this.websocket.onopen = this.websocketonopen;
//
//        this.websocket.onerror = this.websocketonerror;
//
//        this.websocket.onmessage = this.onMessage;
//        this.websocket.onclose = this.websocketclose;
//      },
//
//      websocketonopen() {
//        // console.log("WebSocket连接成功");
//      },
//      websocketonerror(e) { //错误
//        // console.log("WebSocket连接发生错误");
//      },
//      onMessage(e){ //数据接收
//        this.openMessage(JSON.parse(e.data));
//        //注意：长连接我们是后台直接1秒推送一条数据，
//        //但是点击某个列表时，会发送给后台一个标识，后台根据此标识返回相对应的数据，
//        //这个时候数据就只能从一个出口出，所以让后台加了一个键，例如键为1时，是每隔1秒推送的数据，为2时是发送标识后再推送的数据，以作区分
////        this.showNotify = true;
//        this.$store.commit('setPaddingTaskTip', true);
//        this.$store.commit('setNotifyInfoTip', true);
//      },
//
//      websocketsend(agentData){ //数据发送
//        this.websocket.send(agentData);
//      },
//
//      websocketclose(e){ //关闭
//        // console.log("connection closed (" + e.code + ")");
//      },
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
      }
    },
    components: {
      topNav, pcUpdatePwd
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  .logo-container {
    height: 60px;
  }

  .logo {
    height: 50px;
    width: auto;
    margin-left: 10px;
    margin-top: 5px;
    cursor: pointer;
  }

  .fa-user {
    position: relative;
    top: -2px;
    margin-right: 4px;
  }

  .head-nav {
    width: 100%;

    height: 60px;
    background: #fafbfc;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 990;
    color: #333333;
    border-bottom: 1px solid #e6e6e6;

  .logout {
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    float: right;
    cursor: pointer;
  }

  }
  .user-info {
    text-align: right;
    box-sizing: border-box;
  }

  .username {
    height: 60px;
    line-height: 60px;
    cursor: pointer;
    float:left;
  }
  .username .el-dropdown{
    font-size:14px;
  }
  .user-info .item {
    position: relative;
    display: inline-block;
    width: 60px;
    text-align: center;
    cursor: pointer
  }

  .user-info .item .redMask {
    position: absolute;
    display: inline-block;
    top: 0;
    right: 12px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ff6c2b
  }

  .msgicon {
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    float: right;
    cursor: pointer;
  }
  .user-info .item i{
    margin-top:10px;
    display: inline-block;
    color:#333333;
    font-size:20px!important;
    position: relative;
  }
  .user-info .item i.maliicon-img_top_remind1{
    font-size:20px!important;
  }
  #willDo{
    border-right:1px solid #e3e4e6;
    margin-top:15px;
  }
  #messageNote{
    border-right:1px solid #e3e4e6;
    margin-top:15px;
    margin-right:20px;
  }
  .user-info .item i:before{
    top:-4px;
    position: relative;
  }
  .username .el-dropdown .el-dropdown-link img{
    margin-top:13px;
    vertical-align:top;
    margin-right:10px;
  }
  .el-dropdown-link .name{
    max-width:100px;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    display: inline-block;
    vertical-align: top;
    font-size:14px;
  }
  .el-dropdown-link .name+i{
    font-size: 24px;
    color: #000;
    position: relative;
    top: 1px;
  }
  .user-info .item .reddot{
    position: absolute;
    display: inline-block;
    top: 20px;
    right: 12px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ff6c2b;
  }
  .icon-clolr-notify-message {
    color: #ff6c2b;
  }
  .el-dropdown-menu__item{
    color:#333;
    font-size: 14px!important;
  }
  .logout{
    color:#808080!important;
  }
  .el-dropdown-menu--small .el-dropdown-menu__item i{
    width:20px;
    display: inline-block;
  }
</style>
