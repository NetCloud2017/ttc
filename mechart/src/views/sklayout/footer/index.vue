<template>
<div class="sk-footer">
  <span id="recover" @click="recover" class="sk-customer-recover" v-if="fromType">{{recoverLabel}}</span>
  <span id="btn" @click="imccClick" class="sk-customer">在线客服</span>
  <span>客服电话 0755-21650090</span>
</div>
</template>
<script type="text/javascript">
  export default {
    data() {
      return {
        recoverLabel: '回收站',
        showRecover: false, // 是否显示回收站标签
        isRecover: false, // 当前是否显示的是回收站,
        fromType: null
      };
    },
    created () {
      this.rs();
    },
    watch: {
      '$route': 'rs'
    },
    methods: {
      imccClick() {
        var imNumber = '4910';  // 接入号码，请按正确修改
        var hastab = false;  // 是否存在右侧标签页，（ true 存在，不存在不需要该参数。）
        var isstatic = false;  // true=弹出框不可隐藏,false弹出框可隐藏
        var openid = '0';  // 访问者唯一标识(可选参数，默认为0或者为空)
        var params = ''; // 自定义参数, JSON字符串格式UTF8编码经base64转码
        this.$imcc.WebchatPop(imNumber, hastab, isstatic, openid, params, function (webchat) {
          this.$imcc.imccShow();
        });
      },
      recover() {
        this.isRecover = !this.isRecover;
        this.recoverLabel = this.isRecover ? '退出回收站' : '回收站';
        this.$pcBus.$emit('show-recover', this.isRecover);
      },
      rs () {
        var type = parseInt(this.$route.query.fromPage);
        if (type === 1 || type === 2) {
          this.recoverLabel = '回收站'; // 路由变化时设置回收站不显示
          this.isRecover = false;  // 路由变化时设置回收站不显示
          this.fromType = true;
        } else {
          this.fromType = false;
        }
      }
    }
  };
</script>
<style>
.sk-footer{
  position:fixed;
  bottom:0;
  left: 0;
  width:100vw;
  height:40px;
  line-height: 40px;
  background: #1f2533;
  color:#fff;
  font-size:14px;
  box-sizing: border-box;
  padding-right:20px;
  text-align: right;
}
.sk-footer .sk-customer-recover{
  position: fixed;
  left: 20px;
}
.sk-customer{
  cursor: pointer;
  margin-right:10px;
}
</style>
