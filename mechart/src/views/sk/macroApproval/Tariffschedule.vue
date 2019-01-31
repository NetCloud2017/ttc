<template>
  <div>
    <div class='futures-wrap-center'>
      <div class='futures-cover-center' v-if='isShow' @click.stop='closeMyself'></div>
      <transition name='dropc'>
        <!-- title -->
        <div class='Tariffschedule-content-center' :style='[futuresSize]' v-if='isShow'>
          <div class='top-title-center' :style='{width:futuresSize.width}'>
            {{title}}
            <span class='futures-close-center' @click.stop='closeMyself'>x</span>
          </div>
          <!-- content -->
            <div class="searchWrp">
                <span>选择国家</span>
                <select class="search-select" v-model="country">
                    <option :value="item.country" v-for="(item,index) in countryList" :key='index'>{{item.country}}</option>
                </select>
                <button class="search-button" @click="searchData" id="btn">搜索</button>
            </div>
          <div class='tariffsContentt'>
              <el-table
                :data="tariffsList"
                border
                 align='center'>
                <el-table-column
                prop="customsCode"
                label="海关编码"
               >
                </el-table-column>
                <el-table-column
                prop="triffGoodsName"
                label="产品"
                >
                </el-table-column>
                <el-table-column
                prop="triffRate"
                label="关税"
               >
                </el-table-column>
                <el-table-column
                prop="vatRate"
                label="增值税"
               >
                </el-table-column>
            </el-table>
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
      default: '599'
    },
    height: {
      type: [String, Number],
      default: '460'
    }
  },
  data() {
    return {
      futuresSize: {
        width: this.width + 'px',
        height: this.height + 'px'
      },
      countryList: [],
      country: '',
      tariffsList: []
    };
  },
  created() {
  },
  mounted() {
    // 获取国家列表
    this.ajax({
      url: '/malisk/client/macro/countryList',
      type: 'GET',
      success: (res) => {
        this.countryList = res.result;
      }
    });
  },
  methods: {
    closeMyself() {
      this.$emit('on-close');
      this.country = '';
      this.tariffsList = null;
    },
    btnClick() {
      // 解决快速点击button按钮
      let btn = document.getElementById('btn');
      btn.disabled = 'disabled';
      setTimeout(() => {
        btn.disabled = '';
      }, 3000);
    },
    // 获取关税表数据
    searchData() {
      if (this.country !== '' && this.country !== null) {
        this.ajax({
          url: '/malisk/client/macro/triffList',
          type: 'POST',
          data: {country: this.country},
          success: (res) => {
            this.tariffsList = res.result;
          }
        });
      } else {
        this.errorTip('请选择国家！');
        this.btnClick();
      }
    }
  }
};
</script>

<style>
.tariffsContentt{
    width: 599px;
    height: 150px;
    margin-top: 30px;
    padding: 0 10px 0 10px;
}
.tariffsContentt .el-table__empty-block{
    background-color:  #fff;
 }
.tariffsContentt el-table th div, .el-table th > .cell{
  color:#1a1a1a;
}
.tariffsContentt .el-table td, .el-table th{
    background-color: #fff;
}
.tariffsContentt .el-table--small td{
  text-align: center;
  color:#1a1a1a;
  font-size:14px!important;
  font-family:"微软雅黑";
  border-color:#303541;
  background: #fff !important;
}
.tariffsContentt .el-table--enable-row-hover .el-table__body tr:hover>td{
  background: #fff !important;
}
.searchWrp{
    margin-left: 20px;
}
.searchWrp span{
    color:#1a1a1a;
    font-size: 14px;
}
.search-select{
    width: 200px;
    height: 34px;
}
.search-button{
    width: 100px;
    height: 34px;
    background-color: #990808;
    color: #fff;
    border-radius:2px;
    border: white;
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
.Tariffschedule-content-center {
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
