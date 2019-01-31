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
          <!-- head -->
          <div class='head'>
            <div class='head-title' @click='showClinckCIF()'>
              <div :class="titleindex?'head-title-text-active':'head-title-text'">
                CIF价格
                <i class='el-icon-sort-up iconmm'></i>RMB现货价格
              </div>
            </div>
            <div class='head-title' @click='showClinckRMB()'>
              <div :class="!titleindex?'head-title-text-active':'head-title-text'">
                RMB现货价格
                <i class='el-icon-sort-up iconmm'></i>CIF价格
              </div>
            </div>
          </div>
          <!-- content -->
          <div class='content'>
            <div class='content-head'>
              <div class='content-head-one'>
                <span class='content-head-xing'>*</span>国家
              </div>
              <div class='content-head-ttwd'>
                <span class='content-head-xing'>*</span>
                {{titlecoin}}
              </div>
              <div class='content-head-ttwd'>
                <span class='content-head-xing'>*</span>代理费
              </div>
            </div>
            <div class='content-body'>
              <div class='content-body-one'>
                <!-- <div v-show='showTextOne' class='content-text'>请选择国家</div> -->
                <el-form
                  :inline='true'
                  label-width='260'
                  :model='formInline'
                  class='demo-form-inline'
                >
                  <el-form-item>
                    <el-select
                      class='conten-select'
                      v-model='formInline.region'
                      placeholder='请选择国家'
                    >
                      <el-option
                        v-for='(item, index) in countryList'
                        :key='index'
                        :label='item.country'
                        :value='item.country'
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item></el-form-item>
                </el-form>
              </div>
              <div class='content-body-tow'>
                <span class='content-text'>{{titleunit}}</span>
                <el-input
                  v-model='justFrom.soptPriceRmb'
                  placeholder='必选项'
                  @keyup.native="verifyDecimal(justFrom, 'soptPriceRmb')"
                  class='conten-select'
                ></el-input>
              </div>
              <div class='content-body-three'>
                <span class='content-text'>元/吨</span>
                <el-input
                  v-model='justFrom.agencyFee'
                  placeholder='必选项'
                  @keyup.native="verifyDecimal(justFrom, 'agencyFee')"
                  class='conten-select'
                ></el-input>
              </div>
              <div class='content-body-but'>
                <el-button type='danger' @click='submit' class='submit' id="btn">运算</el-button>
              </div>
            </div>
            <!-- bottom -->
            <div class='bottom'>
              <div class='bottom-text'>{{bottomcoin}}:</div>
              <div class='bottom-show'>
                {{result}}
                <span>{{bottomunit}}</span>
              </div>
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
      countryList: [],
      custom: false,
      justFrom: {
        agencyFee: '',
        soptPriceRmb: ''
      },
      result: '',
      titleindex: true,
      futuresSize: {
        width: this.width + 'px',
        height: this.height + 'px'
      },
      formInline: {
        user: '',
        region: ''
      },
      bottomcoin: 'RMB现货价格',
      titlecoin: 'CIF价格',
      bottomunit: '元/KG',
      titleunit: '美元/KG',
      triffRate: '',
      vatRate: ''
    };
  },
  created() {
    this.ajax({
      type: 'GET',
      url: '/malisk/client/macro/countryList',
      data: {},
      loading: true,
      success: res => {
        setTimeout(() => {
          this.$pcNProgress.done();
        }, 300);
        if (res.code === 200) {
          this.countryList = res.result;
        } else {
          this.errorTip(res.message);
        }
      }
    });
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
      this.justFrom.agencyFee = '';
      this.justFrom.soptPriceRmb = '';
      this.formInline.region = '';
    },
    showClinckRMB() {
      this.titleindex = false;
      this.titlecoin = 'RMB现货价格';
      this.bottomcoin = 'CIF价格';
      this.titleunit = '元/KG';
      this.bottomunit = '美元/KG';
      this.justFrom.agencyFee = '';
      this.justFrom.soptPriceRmb = '';
      this.formInline.region = '';
      this.result = '';
    },
    showClinckCIF() {
      this.titleindex = true;
      this.bottomcoin = 'RMB现货价格';
      this.titlecoin = 'CIF价格';
      this.bottomunit = '元/KG';
      this.titleunit = '美元/KG';
      this.justFrom.agencyFee = '';
      this.justFrom.soptPriceRmb = '';
      this.formInline.region = '';
      this.result = '';
    },
    submit() {
      // 解决快速点击button按钮
      let btn = document.getElementById('btn');
      btn.disabled = 'disabled';
      setTimeout(() => {
        btn.disabled = '';
      }, 3000);
      for (let i = 0; i < this.countryList.length; i++) {
        if (this.countryList[i].country === this.formInline.region) {
          this.triffRate = this.countryList[i].triffRate;
          this.vatRate = this.countryList[i].vatRate;
        }
      }
      if (this.formInline.region === '') {
        this.errorTip('请先输入国家', 2000);
      } else if (this.justFrom.soptPriceRmb === '') {
        this.errorTip('请先输入价格', 2000);
      } else if (this.justFrom.agencyFee === '') {
        this.errorTip('请先输入代理费', 2000);
      } else if (isNaN(this.justFrom.soptPriceRmb)) {
        this.errorTip('请先输入正确的价格', 2000);
      } else if (isNaN(this.justFrom.agencyFee)) {
        this.errorTip('请先输入正确的代理费', 2000);
      } else {
        let that = this;
        if (this.titleindex) {
          // CIF-> RMB

          this.ajax({
            type: 'POST',
            url: '/malisk/client/macro/operationFuture',
            data: {
              country: that.formInline.region,
              caclType: '1',
              agencyFee: +that.justFrom.agencyFee,
              cifPrice: +that.justFrom.soptPriceRmb,
              triffRate: that.triffRate,
              vatRate: that.vatRate
            },
            loading: true,
            success: res => {
              setTimeout(() => {
                this.$pcNProgress.done();
              }, 300);
              if (res.code === 200) {
                this.successTip('计算成功', 2000);
                this.result = res.result;
              } else {
                this.errorTip(res.message);
              }
            }
          });
        } else {
          // RMB -> CIF
          this.ajax({
            type: 'POST',
            url: '/malisk/client/macro/operationFuture',
            data: {
              country: that.formInline.region,
              caclType: '2',
              agencyFee: +that.justFrom.agencyFee,
              soptPriceRmb: +that.justFrom.soptPriceRmb,
              triffRate: that.triffRate,
              vatRate: that.vatRate
            },
            loading: true,
            success: res => {
              setTimeout(() => {
                this.$pcNProgress.done();
              }, 300);
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
  }
};
</script>

<style scoped>
.bottom-show > span {
  position: absolute;
  right: 0px;
}
.bottom-show {
  position: absolute;
  width: 260px;
  height: 36px;
  color: #1a1a1a;
  font-size: 16px;
  text-align: center;
  line-height: 36px;
  top: 16px;
  right: 96px;
  border-bottom: #1a1a1a solid 1px;
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
  margin-top: 40px;
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
.head-title {
  width: 250px;
  float: left;
  height: 42px;
  -webkit-user-select: none;
}
.head-title-text {
  text-align: center;
  line-height: 40px;
  margin: auto;
  color: #1a1a1a;
  font-size: 16px;
  width: 180px;
  height: 40px;
}
.head-title-text-active {
  text-align: center;
  line-height: 40px;
  margin: auto;
  color: #990808;
  font-size: 16px;
  width: 180px;
  z-index: 10;
  height: 40px;
  border-bottom: #990808 solid 2px;
}
.content {
  position: relative;
  width: 100%;
  height: 200px;
  top: 10px;
  /* background: #4fc08d; */
  border-bottom: 1px solid #e5e5e5;
}
.head {
  overflow: hidden;
  position: relative;
  top: -20px;
  border-bottom: 1px solid #e5e5e5;
  width: 100%;
  height: 41px;
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
