<template>
  <div>
    <div class="dialog-wrap" >
      <div class="dialog-cover"  v-if="isShow" @click.stop="closeMyself"></div>
      <transition name="drop">
        <div class="dialog-content"  v-if="isShow">
          <div class="top-title">
            {{title}}
            <span class="dialog-close" @click.stop="closeMyself">x</span>
          </div>
          <div class="content-scroll-box">
            <div class="content-scroll">
              <slot>empty</slot>
            </div>
          </div>
        </div>
      </transition>
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
  .drop-enter-active {
    transition: all .3s ease;
  }
  .drop-leave-active {
    transition: all .3s ease;
  }
  .drop-enter {
    transform: translateX(1000px);
  }
  .drop-leave-active {
    transform: translateX(1000px);
  }

  .dialog-wrap {
    text-align: left;
    position: fixed;
    width: 1px;
    height: 100%;
    z-index:999;
    right:0;
  }
  .dialog-cover {
    background: #000;
    opacity: 0.4;
    position: fixed;
    z-index: 5;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .top-title{
    background:#fff;
    border-bottom:1px solid #e3e4e6;
    height:50px;
    line-height:50px;
    font-size:16px!important;
    color:#333;
    text-indent:20px;
    position: absolute;
    top:0;
    right:0!important;
    width:1000px;
  }
  .dialog-content {
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
  .dialog-close {
    position: absolute;
    right: 25px;
    top: 0;
    text-align: center;
    cursor: pointer;
    font-size: 16px!important;
  }
  .dialog-close:hover {
    color: #4fc08d;
  }
  .content-scroll-box{
    height:100%;
    width:960px;
    overflow:hidden;
  }
  .content-scroll{
    height:100%;
    width:976px;
    overflow-y:scroll;
  }
</style>
