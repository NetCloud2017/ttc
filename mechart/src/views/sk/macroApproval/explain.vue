<template>
  <div>
    <div class='futures-wrap-center'>
      <div class='futures-cover-center' v-if='isShow' @click.stop='closeMyself'></div>
      <transition name='dropc'>
        <!-- title -->
        <div class='futures-content-center' :style='[futuresSize]' v-if='isShow'>
          <div class='top-title-center' :style='{width:futuresSize.width}'>
            {{title}}
            <span class='futures-close-center' @click.stop='closeMyself'>x</span>
          </div>
          <!-- content -->
            <div class="explainhWrp">
             <p class="echartstext">{{echartsData}}</p>
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
      default: '460'
    },
    height: {
      type: [String, Number],
      default: '460'
    },
    echartsData: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      futuresSize: {
        width: this.width + 'px',
        height: this.height + 'px'
      }
    }/* eslint-disable semi */
  },
  methods: {
    closeMyself() {
      this.$emit('on-close');
    }
  }
};
</script>

<style>
.echartstext{
  margin-top: -20px;
 line-height: 17px;
 text-indent:1.5em;
}
.explainhWrp{
    width: 420px;
    height: 300px;
    color: #000;
    margin-left: 20px;
}
.futures-wrap-center {
  position: fixed;
  width: 1px;
  height: 100%;
  z-index: 999;
  right: 0;
}
.futures-cover-center {
  background: #000;
  opacity: 0.4;
  position: fixed;
  z-index: 5;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
.top-title-center {
  background: rgb(153, 8, 8);
  border-bottom: 1px solid #e3e4e6;
  height: 50px;
  line-height: 50px;
  font-size: 16px !important;
  color: #fff;
  text-indent: 20px;
  position: absolute;
  top: 0;
  right: 0 !important;
  width: 640px;
}
.futures-content-center {
  position: fixed;
  background: #fff;
  top: 20vh;
  right: 0;
  z-index: 1000;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  padding-left: 00px;
  padding-right: 00px;
  padding-top: 90px;
  overflow: hidden;
  box-sizing: border-box;
  left: 0;
  margin: 0 auto;
  border-radius: 4px;
}
.futures-close-center {
  position: absolute;
  right: 25px;
  top: 0;
  text-align: center;
  cursor: pointer;
  font-size: 16px !important;
}
.futures-close-center:hover {
  color: #4fc08d;
}
.dropc-enter-active {
  transition: all 0.3s ease;
}
.dropc-leave-active {
  transition: all 0.3s ease;
}
.dropc-enter {
  transform: translateY(-20vh);
}
.dropc-leave-active {
  transform: translateY(-20vh);
}

</style>
