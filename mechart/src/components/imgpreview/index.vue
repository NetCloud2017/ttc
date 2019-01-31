<template>
  <div>
    <div class="img-dialog-wrap" >
      <div class="img-dialog-cover"  v-if="isShow" @click.stop="closeMyself"></div>
        <div class="img-dialog-content"  v-if="isShow">
          <div class="img-top-title">
            <span class="img-dialog-close" @click.stop="closeMyself">x</span>
          </div>
          <div class="img-content-scroll-box">
            <div class="img-content-scroll">
              <slot>empty</slot>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ''
      }
    },
    data () {
      return {};
    },
    methods: {
      closeMyself () {
        this.$emit('on-close');
      }
    }
  };
</script>

<style >
  .img-dialog-wrap {
    position: fixed;
    width: 1px;
    height: 100%;
    z-index:999;
    right:0;
  }
  .img-dialog-cover {
    background: #000;
    opacity: 0.4;
    position: fixed;
    z-index: 5;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .img-top-title{
    background:#fff;
    border-bottom:1px solid #e3e4e6;
    height:50px;
    line-height:50px;
    font-size:16px!important;
    color:#333;
    text-indent:20px;
    position: fixed;
    top:0;
    right:0;
    width:1000px;
  }
  .img-dialog-content {
    width: 1000px;
    position: fixed;
    height: 100vh;
    background: #f5f6f7;
    top: 0;
    right: 0;
    z-index: 1000;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-left:20px;
    padding-right:20px;
    padding-top:70px;
    overflow: hidden;
  }
  .img-dialog-close {
    position: absolute;
    right: 25px;
    top: 0;
    text-align: center;
    cursor: pointer;
    font-size: 16px!important;
  }
  .img-dialog-close:hover {
    color: #4fc08d;
  }
  .img-content-scroll-box{
    height:100%;
    width:960px;
    overflow:hidden;
  }
  .img-content-scroll{
    height:100%;
    width:976px;
    overflow-y:scroll;
  }
</style>
