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
          <div class='content'>
            <div class='content-head'>
              <div class='content-head-one'>
                <span class='content-head-xing'>*</span>货物原值(元)
              </div>
              <div class='content-head-ttwd'>
                <span class='content-head-xing'>*</span>折率
              </div>
              <div class='content-head-ttwd'>
                <span class='content-head-xing'>*</span>年化利息
              </div>
              <div class='content-head-ttwd'>
                <span class='content-head-xing'>*</span>质押期(天)
              </div>
            </div>
            <div class='content-body'>
              <div class='content-body-one'>
                <el-input
                  v-model='justFrom.originalValue'
                  placeholder='必选项'
                  @keyup.native="verifyDecimal(justFrom, 'originalValue')"
                  class='conten-select'
                ></el-input>
              </div>
              <div class='content-body-tow'>
                <span class='content-text'>%</span>
                <el-input
                  v-model='justFrom.discountRate'
                  placeholder='必选项'
                  @keyup.native="verifyDecimal(justFrom, 'discountRate')"
                  class='conten-select'
                ></el-input>
              </div>
              <div class='content-body-three'>
                <span class='content-text'>%</span>
                <el-input
                  v-model='justFrom.annualRate'
                  placeholder='必选项'
                  @keyup.native="verifyDecimal(justFrom, 'annualRate')"
                  class='conten-select'
                ></el-input>
              </div>
              <div class='content-body-three'>
                <el-input
                  v-model='justFrom.pledgeDays'
                  placeholder='必选项'
                  @keyup.native="verifyInteger(justFrom, 'pledgeDays')"
                  class='conten-select'
                ></el-input>
              </div>
              <div class='content-body-but'>
                <el-button type='danger' @click='submit' class='submit' id="btn">运算</el-button>
              </div>
            </div>
            <!-- bottom -->
            <div class='bottom'>
              <div class='bottom-text'>利息收入:</div>
              <div class='bottom-show'>{{result}}</div>
            </div>
          </div>
          <div class='content'></div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import maValidate from 'utils/common-method/validate/index';
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
      default: '500'
    },
    height: {
      type: [String, Number],
      default: '470'
    }
  },
  data() {
    return {
      result: '',
      justFrom: {
        originalValue: '',
        discountRate: '',
        annualRate: '',
        pledgeDays: ''
      },
      futuresSize: {
        width: this.width + 'px',
        height: this.height + 'px'
      }
    };
  },
  methods: {
    // 校验整数
    verifyInteger(val, prop) {
      maValidate.verifyInteger(val, prop);
    },
    // 校验小数
    verifyDecimal(val, prop) {
      maValidate.verifyDecimal(val, prop);
    },

    closeMyself() {
      this.$emit('on-close');
      this.justFrom.originalValue = '';
      this.justFrom.discountRate = '';
      this.justFrom.annualRate = '';
      this.justFrom.pledgeDays = '';
    },
    submit() {
       // 解决快速点击button按钮
      let btn = document.getElementById('btn');
      btn.disabled = 'disabled';
      setTimeout(() => {
        btn.disabled = '';
      }, 3000);
      if (this.justFrom.originalValue === '') {
        this.errorTip('请先输入货物原值', 2000);
      } else if (this.justFrom.discountRate === '') {
        this.errorTip('请先输入折率', 2000);
      } else if (this.justFrom.annualRate === '') {
        this.errorTip('请先输入年化利息', 2000);
      } else if (this.justFrom.pledgeDays === '') {
        this.errorTip('请先输入质押期', 2000);
      } else if (isNaN(this.justFrom.originalValue)) {
        this.errorTip('请先输入正确的货物原值', 2000);
      } else if (
        isNaN(this.justFrom.discountRate) ||
        this.justFrom.discountRate > 100 ||
        this.justFrom.discountRate < 0
      ) {
        this.errorTip('请先输入正确的折率', 2000);
      } else if (
        isNaN(this.justFrom.annualRate) ||
        this.justFrom.annualRate > 100 ||
        this.justFrom.annualRate < 0
      ) {
        this.errorTip('请先输入正确的年化利息', 2000);
      } else if (isNaN(this.justFrom.pledgeDays)) {
        this.errorTip('请先输入正确的质押期', 2000);
      } else {
        let that = this;
        this.ajax({
          type: 'POST',
          url: '/malisk/client/macro/operationInterest',
          data: {
            annualRate: that.justFrom.annualRate / 100, // 年化利息
            discountRate: that.justFrom.discountRate / 100, // 折率
            originalValue: +that.justFrom.originalValue, // 货物原值(元)
            pledgeDays: +that.justFrom.pledgeDays // 质押期(天)
          },
          loading: true,
          success: res => {
            if (res.code === 200) {
              this.successTip('计算成功', 2000);
              this.result = res.result;
            } else {
              this.errorTip(res.message);
            }
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.bottom-show {
  position: absolute;
  width: 260px;
  height: 68px;
  color: #1a1a1a;
  font-size: 16px;
  text-align: center;
  line-height: 68px;
  top: 16px;
  right: 120px;
  border: #99a3bb solid 1px;
}
.bottom-text {
  position: absolute;
  font-size: 16px;
  color: #1a1a1a;
  top: 32px;
  left: 32px;
}
.bottom {
  width: 100%;
  height: 100px;
  position: relative;
  margin-top: 76px;
}
.content-head {
  margin-right: 0px;
}
.content-head-ttwd {
  color: #1a1a1a;
  height: 34px;
  margin-top: 10px;
  text-align: right;
  font-size: 14px;
  line-height: 34px;
}
.content-head-one {
  color: #1a1a1a;
  height: 34px;
  text-align: right;
  font-size: 14px;
  line-height: 34px;
}
.content-head-xing {
  color: #ff9c71;
  margin-right: 5px;
  line-height: 34px;
}
.content-head {
  width: 110px;
  height: 180px;
  position: relative;
}
.content-text {
  position: absolute;
  top: 10px;
  right: 48px;
  color: #1a1a1a;
  font-size: 14px;
  z-index: 200;
}
.iconmm {
  transform: rotate(90deg);
}
.submit {
  background: #990808;
  color: #fff;
  width: 100px;
  height: 35px;
  font-size: 14px;
}
.content-body-but {
  margin-top: 20px;
}
.content-body-one {
  width: 300px;
  height: 34px;
  overflow: hidden;
  margin-right: 0px;
  line-height: 10px;
  position: relative;
}
.content-body-tow {
  width: 300px;
  height: 34px;
  overflow: hidden;
  margin-right: 0px;
  line-height: 10px;
  /* border: #000 solid 1px; */
  margin-top: 10px;
  position: relative;
}
.content-body-three {
  position: relative;
  width: 300px;
  height: 34px;
  overflow: hidden;
  margin-right: 0px;
  line-height: 10px;
  /* border: #000 solid 1px; */
  margin-top: 10px;
}
.conten-select {
  width: 260px;
  border: #99a3bb solid 1px;
  border-radius: 4px;
}
.content-body {
  position: absolute;
  left: 120px;
  top: 0px;
  width: 300px;
  height: 180px;
}
.content {
  position: relative;
  width: 100%;
  height: 245px;
  top: -13px;
  /* background: #4fc08d; */
  border-bottom: 1px solid #e5e5e5;
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
</style>
