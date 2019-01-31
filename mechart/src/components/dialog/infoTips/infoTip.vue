<template>
  <div class="info-tip-box" :class="type" v-if="visible">
    <div class="info-tip-box-wrap"></div>
    <div class="message" >
      <span class="icon maliiconfont maliicon-img_comm_success"></span>
      <div class="content">{{content}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MyMessage',
    data() {
      return {
        content: '',
        time: 2500,
        visible: false,
        type: 'info', // 'success','warning','error'
        hasClose: false
      };
    },
    mounted() {
      this.close();
    },
    methods: {
      close() {
        window.setTimeout(() => {
          this.visible = false;
        }, this.time);
      }
    }
  };
</script>
<style scoped>
.info-tip-box{
  width:100vw;
  height:100vh;
}
.info-tip-box .info-tip-box-wrap{
  width:100vw;
  height:100vh;
  position:fixed;
  top:0;
  left:0;
  background:rgba(0,0,0,0);
}
.info-tip-box .message{
  width:140px;
  height:140px;
  margin:0 auto;
  position:fixed;
  left:0;
  right:0;
  top:40vh;
  z-index:2000;
  border-radius:4px;
  text-align:center;
}
.info-tip-box.white .message{
    background:#fff;
}
.info-tip-box.black .message{
  background:rgba(0,0,0,.5);
}
.info-tip-box .message span{
  font-size:40px;
  margin-top:35px;
  display:inline-block;
}
.info-tip-box.white .message span{
  color:#181d29;
}
.info-tip-box.black .message span{
  color:#fff;
}
.info-tip-box .message .content{
  font-size:16px;
  font-weight:bold;
  margin-top: 20px;
}
.info-tip-box.white .message .content{
  color:#181d29;
}
.info-tip-box.black .message .content{
  color:#fff;
}
</style>
