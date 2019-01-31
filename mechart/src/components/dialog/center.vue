<template>
  <div>
    <div class="dialog-wrap-center" >
      <div class="dialog-cover-center"  v-if="isShow" @click.stop="closeMyself"></div>
      <transition name="dropc">
        <div class="dialog-content-center" :style="[dialogSize]"  v-if="isShow">
          <div class="top-title-center" :style="{width:dialogSize.width}">
            {{title}}
            <span class="dialog-close-center" @click.stop="closeMyself">x</span>
          </div>
          <div>
            <slot>empty</slot>
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
      },
      width: {
        type: [String, Number],
        default: '640'
      },
      height: {
        type: [String, Number],
        default: '400'
      }
    },
    data () {
      return {
        custom: false,
        dialogSize: {
          width: this.width + 'px',
          height: this.height + 'px'
        }
      };
    },
    methods: {
      closeMyself () {
        this.$emit('on-close');
      }
    }
  };
</script>

<style >
  .dropc-enter-active {
    transition: all .3s ease;
  }
  .dropc-leave-active {
    transition: all .3s ease;
  }
  .dropc-enter {
    transform: translateY(-20vh);
  }
  .dropc-leave-active {
    transform: translateY(-20vh);
  }

  .dialog-wrap-center {
    position: fixed;
    width: 1px;
    height: 100%;
    z-index:999;
    right:0;
  }
  .dialog-cover-center {
    background: #000;
    opacity: 0.4;
    position: fixed;
    z-index: 5;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }
  .top-title-center{
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
    width:640px;
  }
  .dialog-content-center {
    position: fixed;
    background: #fff;
    top: 20vh;
    right: 0;
    z-index: 1000;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-left:20px;
    padding-right:20px;
    padding-top:70px;
    overflow: hidden;
    box-sizing: border-box;
    left:0;
    margin:0 auto;
    border-radius:4px;
  }
  .dialog-close-center {
    position: absolute;
    right: 25px;
    top: 0;
    text-align: center;
    cursor: pointer;
    font-size: 16px!important;
  }
  .dialog-close-center:hover {
    color: #4fc08d;
  }
</style>
